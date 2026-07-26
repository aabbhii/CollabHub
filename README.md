# 🚀 CollabStudy – Student Collaboration & Study Management Platform

> A full-stack, real-time collaboration platform that helps students organize study sessions, manage projects, collaborate seamlessly, and gamify their learning experience.

---

## 📖 Project Overview

**CollabStudy** is a modern full-stack web application designed to improve student collaboration and academic productivity. It combines real-time communication, Kanban-based task management, study session organization, and gamification into one unified platform.

Built using a scalable **Node.js + Express** backend, **React 19** frontend, and **Aiven Cloud MySQL**, the platform enables students to collaborate efficiently through live synchronization, secure authentication, interactive task boards, and productivity tracking.

---

## 📌 Project Abstract

In today's education environment, effective collaboration and structured project management are essential for academic success. However, many existing tools either lack real-time synchronization or fail to provide student-focused productivity features.

**CollabStudy** solves these challenges by providing a centralized platform where students can:

- Create and join collaborative study sessions
- Organize project tasks using a Kanban board
- Receive instant real-time updates via WebSockets
- Track deadlines and project progress
- Communicate with teammates seamlessly
- Earn XP and level up through completed tasks
- Compete on a global productivity leaderboard

The platform follows an enterprise-grade architecture using the **Controller → Service → Repository** pattern and integrates securely with **Aiven Cloud MySQL** using SSL encryption.

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT-based authentication
- Secure password hashing using **bcrypt**
- User registration and login
- Role-Based Access Control (Student / Admin)

---

## 🤝 Collaboration Sessions

- Create study groups
- Join existing sessions
- Invite collaborators
- Assign session deadlines
- Monitor overall session progress

---

## 📋 Kanban Task Management

Organize work using an interactive Kanban board with task statuses:

- ⏳ Pending
- 🚧 In Progress
- 👀 Review
- ✅ Completed

Task Features:

- Priority Levels
  - Low
  - Medium
  - High
- Due dates
- User assignment
- Progress tracking

---

## ⚡ Real-Time Collaboration

Powered by **Socket.io**.

Features include:

- Instant task updates
- Live notifications
- Real-time synchronization
- Multi-user collaboration
- Active session updates

---

## 🎮 Gamification

Keep students motivated by rewarding productivity.

Features:

- Earn Experience Points (XP)
- Unlock new Levels
- Achievement notifications
- Productivity tracking

---

## 🏆 Global Leaderboard

Students compete based on:

- XP earned
- Completed tasks
- Productivity score
- Ranking among peers

---

## 👤 Student Profiles

Every student has a customizable profile including:

- Bio
- Tech Stack
- Experience Level
- XP
- Rank
- Activity History

---

## 🗄️ Cloud Database

The application uses **Aiven Cloud MySQL** with:

- SSL Encryption
- Secure connections
- High availability
- Enterprise-grade reliability

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js (TypeScript) | REST API |
| Sequelize ORM | Database ORM |
| sequelize-typescript | Type-safe Models |
| Aiven Cloud MySQL | Database |
| Socket.io | Real-time Communication |
| JWT | Authentication |
| bcrypt | Password Hashing |
| CORS | Cross-Origin Resource Sharing |

---

## Frontend

| Technology | Purpose |
|------------|----------|
| React 19 | Frontend Framework |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Zustand | State Management |
| Motion (Framer Motion) | Animations |
| Lucide React | Icons |
| Axios | API Communication |

---

# 🗂️ Database Schema

### 👥 Users

- User Credentials
- Email
- Password
- Roles
- Authentication Tokens

---

### 👤 Profiles

- Bio
- Tech Stack
- Experience Level
- XP
- Level Rank

---

### 📚 StudySessions

- Session Title
- Description
- Deadline
- Progress Percentage

---

### 👥 SessionMembers

Relationship between:

- Users
- Study Sessions

Roles:

- Owner
- Member

---

### ✅ Tasks

- Session Reference
- Assigned User
- Title
- Description
- Priority
- Status
- Deadline

---

### 🔔 Notifications

Stores:

- Task Assignment Notifications
- XP Rewards
- Level-Up Notifications

---

# 🏗️ Architecture

```
React 19 (Frontend)
        │
        │ Axios API Calls
        ▼
Node.js + Express REST API
        │
        ├──────── JWT Authentication
        ├──────── Socket.io
        ├──────── Controller
        ├──────── Service
        └──────── Repository
                │
                ▼
      Sequelize ORM
                │
                ▼
      Aiven Cloud MySQL
```

---

# 🌟 Core Functionalities

- ✅ Secure Authentication
- ✅ Study Session Management
- ✅ Kanban Task Board
- ✅ Real-Time Collaboration
- ✅ WebSocket Notifications
- ✅ XP & Level System
- ✅ Leaderboard
- ✅ Student Profiles
- ✅ Cloud Database Integration
- ✅ Enterprise Backend Architecture

---

# 🌐 Live Demo

🔗 **Hosted Application:**  
> _Add your deployed application link here_

Example:

```
https://collabstudy.vercel.app
```

---

# 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub!

# Run and deploy 

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
