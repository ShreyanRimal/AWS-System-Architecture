const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// ===== CONFIG =====
const BACKEND_NAME = 'Backend-2'; // change to Backend-2 on second server

const DB_CONFIG = {
  host: '10.0.32.210',
  user: 'ias_user',
  password: 'StrongPassword123!', // change if needed
  database: 'ias_db'
};

const REDIS_URL = 'redis://10.0.38.130:6379';

// ===== MIDDLEWARE =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ===== REDIS SESSION SETUP =====
const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'ias_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000 // 5 minutes
    }
  })
);

// ===== MYSQL CONNECTION POOL =====
let db;

(async () => {
  try {
    db = await mysql.createPool({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to MySQL');
  } catch (err) {
    console.error('MySQL connection failed:', err);
  }
})();

// ===== ROUTES =====

// Health route
app.get('/health', (req, res) => {
  res.status(200).send('healthy');
});

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.send(`
      <h1>🔥 Welcome ${req.session.user.username}</h1>
      <p>Served by: ${BACKEND_NAME}</p>
      <p>Session Active ✅</p>
      <a href="/logout">Logout</a>
    `);
  }

  res.send(`
    <h1>IAS Login System</h1>
    <p>Served by: ${BACKEND_NAME}</p>

    <h2>Signup</h2>
    <form method="POST" action="/signup">
      <input type="text" name="username" placeholder="Enter username" required />
      <br><br>
      <input type="password" name="password" placeholder="Enter password" required />
      <br><br>
      <button type="submit">Signup</button>
    </form>

    <h2>Login</h2>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Enter username" required />
      <br><br>
      <input type="password" name="password" placeholder="Enter password" required />
      <br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.send(`
      <h2>Signup successful ✅</h2>
      <p>User created: ${username}</p>
      <a href="/">Go to Home</a>
    `);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Signup failed');
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.send(`
      <h2>Logged out successfully ✅</h2>
      <a href="/">Go back</a>
    `);
  });
});

// Protected dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized. Please login first.');
  }

  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome, ${req.session.user.username}</p>
    <p>Served by: ${BACKEND_NAME}</p>
    <a href="/logout">Logout</a>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${BACKEND_NAME} running on port ${PORT}`);
});
