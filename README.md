# 🎓 Student Management System (Backend API)

> A secure, role-based REST API built using Spring Boot 3, Spring Security 6, and JWT Authentication.  
> Designed with clean architecture, scalable security, and production-level best practices.

---

## 📌 Project Overview

The **Student Management System** is a backend application that manages core academic operations within an educational institution.

It implements a strict **Role-Based Access Control (RBAC)** mechanism to ensure secure and structured access for:

- 👨‍💼 Admin
- 👨‍🏫 Teacher
- 🎓 Student

The system follows a **stateless authentication model using JWT**, ensuring scalability and performance.

---


## ✨ Key Features

- ✅ Stateless Authentication using JWT (24-hour token validity)
- ✅ Role-Based Authorization (ADMIN / TEACHER / STUDENT)
- ✅ BCrypt Password Encryption
- ✅ Layered Architecture (Controller → Service → Repository)
- ✅ Normalized Relational Database Design
- ✅ Secure API Endpoints with Spring Security Filters
- ✅ Auto-seeded default users for quick testing

---

## 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Language | Java 21 |
| Framework | Spring Boot 3.4.0 |
| Security | Spring Security 6 + JWT (jjwt) |
| Database | MySQL 8 |
| ORM | Spring Data JPA (Hibernate) |
| Build Tool | Maven |

---

## 🔐 Security Architecture

The application follows a **3-layer security mechanism**:

### 1️⃣ Authentication
Users provide email & password → receive a JWT Bearer Token.

### 2️⃣ Authorization
Custom `JwtAuthenticationFilter` validates:
- Token authenticity
- User identity
- User role

### 3️⃣ Encryption
Passwords are securely hashed using `BCryptPasswordEncoder`.

---

## 👥 Roles & Permissions

| Role | Access |
|------|--------|
| **ADMIN** | Manage users, system operations |
| **TEACHER** | Create tasks, assign work, grade submissions |
| **STUDENT** | View dashboard, submit tasks, apply leave |

---

## 📂 Project Structure

```text
src/main/java/com/student/management_system
│
├── config          → Security Configuration
├── controller      → REST API Controllers
├── dto             → Request/Response Objects
├── entity          → JPA Entities (Database Models)
├── repository      → JPA Repositories
├── security        → JWT Utilities & Filters
└── service         → Business Logic Layer
```

---

## 🔌 API Endpoints

### 🔑 Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login & receive JWT token |

---

### 👨‍💼 Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| POST | `/api/admin/users/add` | Add new Teacher/Student |
| DELETE | `/api/admin/users/{id}` | Delete user |

---

### 👨‍🏫 Teacher APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/create` | Create new task |
| POST | `/api/tasks/assign/students` | Assign to students |
| POST | `/api/tasks/assign/team` | Assign to team |
| POST | `/api/tasks/grade` | Grade submission |

---

### 🎓 Student APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/dashboard/{id}` | View tasks |
| POST | `/api/student/submit/{id}` | Submit task |
| POST | `/api/school/leave/apply` | Apply leave |

---

### 📢 Announcement APIs

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/school/announcements` | Admin / Teacher |
| GET | `/api/school/announcements` | All Users |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/student-management-system.git
cd student-management-system
```

---

### 2️⃣ Configure Database

Create MySQL database:

```sql
CREATE DATABASE student_db;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

### 3️⃣ Run Application

```bash
mvn spring-boot:run
```

Server runs at:

```
http://localhost:8080
```

---

## 👤 Default Seeded Users

| Role | Email | Password |
|------|--------|----------|
| ADMIN | admin@school.com | password123 |
| TEACHER | teacher@school.com | password123 |
| STUDENT | student@school.com | password123 |

---

## 🧪 Testing with Postman

1. Send `POST /api/auth/login`
2. Copy the JWT token from response
3. Go to **Authorization → Bearer Token**
4. Paste token
5. Access protected APIs

---

## 🏗 Architecture Principles

- Clean Separation of Concerns
- Stateless Design
- Secure by Default
- Scalable JWT Authentication
- Industry-standard Layered Architecture

---

## 🚀 Future Improvements

- Refresh Token Mechanism
- Swagger/OpenAPI Documentation
- Docker Containerization
- Role-based method-level security annotations
- CI/CD Integration

---

## Frontend

A React frontend now ships in this repository under `frontend/`. It implements
the Admin, Teacher and Student consoles described above end to end — user
management, tasks and grading, teams, leave approvals, announcements and
private student notes — mapped directly to the endpoints documented in this
file. See `frontend/README.md` for setup instructions, environment
configuration and demo credentials.

Note: `spring.datasource.password` in `src/main/resources/application.properties`
is committed in plaintext. Consider moving it (and the username) to an
environment variable or a secrets manager before this repository becomes
public or is deployed anywhere beyond local development.

