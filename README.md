# 🚀 Intelligent Application System (IAS)

## 📌 Overview

The **Intelligent Application System (IAS)** is a cloud-based distributed web application architecture deployed on AWS. It is designed to demonstrate **high availability, load balancing, session persistence, and web security** using industry-standard technologies.

The system uses a multi-tier architecture consisting of:

* NGINX Reverse Proxy / Load Balancer
* Multiple Backend Servers (Node.js)
* Redis for Session Management
* MySQL for Data Storage
* AWS Cloud Infrastructure (VPC, EC2, Route 53)

---

## 🎯 Objectives

* Implement a **highly available cloud architecture**
* Achieve **load balancing across multiple backend servers**
* Ensure **session persistence using Redis**
* Enhance security using **ModSecurity + OWASP rules**
* Demonstrate **failover using DNS (Route 53)**

---

## 🏗️ System Architecture

### 🔹 Components

* **User (Client Browser)**
* **NGINX Reverse Proxy / Load Balancer**
* **Backend Application Servers (Node.js)**
* **Redis Session Store**
* **MySQL Database**
* **AWS Route 53 (DNS Failover)**

### 🔹 Request Flow

```
User → DNS (Route 53) → NGINX Load Balancer → Backend Servers → Redis + MySQL
```

---

## ☁️ AWS Infrastructure

### 🔹 VPC Configuration

* CIDR Block: `10.0.0.0/16`
* Public Subnet: `10.0.0.0/20`
* Private Subnet: `10.0.32.0/20`

### 🔹 Key Components

* **Internet Gateway** → Public Access
* **NAT Gateway** → Private subnet outbound access
* **Elastic IPs** → Static public access
* **Security Groups** → Traffic control

---

## ⚙️ Technologies Used

| Layer          | Technology              |
| -------------- | ----------------------- |
| Load Balancer  | NGINX                   |
| Backend        | Node.js (Express)       |
| Session Store  | Redis                   |
| Database       | MySQL                   |
| Security       | ModSecurity + OWASP CRS |
| Cloud Platform | AWS                     |

---

## 🔐 Security Features

* Web Application Firewall (WAF) using **ModSecurity**
* Protection against:

  * SQL Injection
  * Cross-Site Scripting (XSS)
* Private subnet isolation for backend services
* Controlled access using **Security Groups**

---

## 🔄 High Availability & Failover

* Multiple backend servers for redundancy
* Load balancing using NGINX
* DNS Failover using Route 53:

  * Primary Server → Active
  * Secondary Server → Backup

---

## 📦 Features Implemented

* Load balancing across backend servers
* Session persistence using Redis
* User authentication system
* Database integration (MySQL)
* Secure architecture with layered design
* Health check endpoint (`/health`)

---

## 🧪 Testing

* Functional Testing
* Load Balancing Testing
* Session Persistence Testing
* Security Testing (SQL Injection, XSS)

---

## 📁 Project Structure

```
ias-project/
│── nginx/
│   ├── nginx.conf
│   ├── ias.conf
│
│── backend/
│   ├── server-backend1.js
│   ├── server-backend2.js
│
│── redis/
│   ├── redis.conf
│
│── db/
│   ├── mysqld.cnf
│   ├── ias_db_dump.sql
│
│── README.md
```

---

## 🚀 Setup Instructions (Simplified)

### 1. Launch AWS Infrastructure

* Create VPC, subnets, and route tables
* Launch EC2 instances

### 2. Configure NGINX

```
sudo yum install nginx -y
sudo systemctl start nginx
```

### 3. Setup Backend

```
npm install
node server.js
```

### 4. Setup Redis

```
redis-server
```

### 5. Setup MySQL

```
mysql -u root -p
```

---

## 📊 Future Improvements

* Auto Scaling Groups
* HTTPS (SSL/TLS)
* AWS Load Balancer integration
* CI/CD pipeline
* Containerization (Docker, Kubernetes)

---

## 👨‍💻 Author

**Shreyan Rimal**
Final Year Project – Intelligent Application System (IAS)

---

## 🙏 Acknowledgement

Special thanks to:

* **Prashant Pudasaini Sir (Internal Supervisor)**
* **Sujan Shrestha Sir (External Supervisor)**
* Family, friends, and colleagues for their support

---

## 📜 License

This project is developed for academic purposes.
