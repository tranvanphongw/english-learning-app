# English Learning App

## Overview

English Learning App is a full-stack application designed to support English learning through vocabulary, quizzes, and interactive exercises. The system includes a web platform for management and a mobile application for end users.

## Features

### Web (Admin/Teacher)

* Manage vocabulary and topics
* Create and manage quizzes
* Track student progress and reports
* User management system

### Mobile App (User)

* Learn vocabulary by topics
* Practice exercises and quizzes
* Track personal learning progress
* Interactive and user-friendly interface

### Backend

* RESTful API system
* Authentication & authorization
* Data management for users, quizzes, vocabulary
* File upload support

---

## Tech Stack

### Frontend (Web)

* ReactJS + TypeScript
* Vite
* TailwindCSS

### Mobile

* Flutter

### Backend

* Node.js
* Express.js
* MongoDB

---

## Project Structure

```bash
english-learning-app/
│
├── english-app-backend1/    # Backend (Node.js API)
├── english-app-web/         # Web admin (React)
├── English-App-Mobile1/     # Mobile app (Flutter)
│
├── IMPLEMENTATION_GUIDE.md
├── THIET_KE_CO_SO_DU_LIEU.md
└── README.md
```

---

## Installation

### Backend

```bash
cd english-app-backend1
npm install
npm run dev
```

### Web

```bash
cd english-app-web
npm install
npm run dev
```

### Mobile

```bash
cd English-App-Mobile1
flutter pub get
flutter run
```

---

## Environment Variables

Create `.env` file in backend and web:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## Contribution

This project was developed as part of a team collaboration.
My responsibilities include:

* Backend API development
* Database design
* Feature implementation for learning modules
* Integration between frontend and backend

---

## Demo

(You can add demo link here if available)

---

## Author

* Name: Tran Van Phong
* GitHub: https://github.com/tranvanphongw

---

## Notes

This project is for educational and portfolio purposes.
