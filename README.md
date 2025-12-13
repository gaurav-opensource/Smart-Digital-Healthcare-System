
# 🏥 Smart Healthcare System (Full Stack + AI Powered)

I developed a full-stack AI-enabled healthcare platform that provides smart doctor-patient interaction. Users can search doctors, book appointments, make secure payments, upload medical reports, and attend video consultations.
The system includes **role-based dashboards**, **AI-based disease prediction**, **real-time chat**, and **secure cloud storage**.

---

## 📌 Table of Contents

* [About the Project](#about-the-project)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Project Flow](#project-flow)

  * [Patient Flow](#patient-flow)
  * [Doctor Flow](#doctor-flow)
  * [Admin Flow](#admin-flow)
* [AI Features](#ai-features)
* [Demo Videos & Screenshots](#demo-videos--screenshots)
* [Future Improvements](#future-improvements)
* [License](#license)
* [Contact](#contact)

---

## 📖 About the Project

This is a complete **online healthcare system** designed to connect patients and doctors through a secure, intuitive digital platform.
It features:

* Smart doctor search
* End-to-end appointment flow
* Video consultations
* Secure file-sharing
* AI-based disease prediction
* Real-time chat and notifications

The goal is to provide a modern and reliable telehealth experience.

---

## ⭐ Features

### 🔐 User Roles

* **Patient Portal**
* **Doctor Portal**
* **Admin Portal**

### 👨‍⚕️ Doctor Search

* Search by **specialization**, **location**, **consultation fees**, and **ratings**.

### 🧑‍💼 Profile Management

* Doctors can update qualification, experience, availability
* Patients can maintain health profile & upload reports

### 🔒 Secure Admin Panel

* Admin verifies doctor licenses & certificates
* Approves or rejects doctor onboarding requests

### 📅 Appointment Booking

* Patients book slots with date, time & symptoms
* Doctors manage pending, upcoming & completed appointments

### 📞 Video Consultation (WebRTC + Socket.IO)

* Real-time video calling between doctor & patient
* Includes in-call chat and notifications

### 📤 Secure Medical File Uploads

* Reports & images uploaded to **Cloudinary**

### 💊 Prescription Management

* Doctors send digital prescriptions after consultation

### ⭐ Rating System

* Patients rate & review doctors

### 💰 Payment Integration

* Basic model ready
* Razorpay integration planned

### 🔔 Notifications

* Email & SMS notifications for appointment updates

---

## 🤖 AI Features

### 🔹 **AI Heart Disease Prediction Model**

* Uses patient input fields to predict heart disease
* **Accuracy: 81.1%**
* Outputs risk percentage and recommendation message

### 🔹 **AI Medical Report Analyzer**

* Upload medical reports (PDF/JPG/PNG)
* Automatically extracts:

  * Hemoglobin
  * RBC/WBC
  * Creatinine
  * Cholesterol Levels
  * Sugar Levels
  * Blood Pressure
* Provides AI-generated health summary and suggestions

---

## 🛠️ Technology Stack

### **Frontend**

* React.js
* Tailwind CSS

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose

### **Key Tools/Libraries**

* Cloudinary (file storage)
* Socket.io (chat & signaling)
* WebRTC (video call)
* JWT (authentication)
* Bcrypt (password security)

---

# 🚀 Getting Started

## Prerequisites

* Node.js v14+
* MongoDB
* Cloudinary account
* Git

---

## Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/gaurav-opensource/online-healthcare-system.git
cd online-healthcare-system
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/online-healthcare
PORT=5000
JWT_SECRET=your_super_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

Start backend:

```bash
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

---

# 🔄 Project Flow

## 👨‍⚕️ Patient Flow

* Register/login
* Search doctors by filters
* View doctor profile
* Book appointment
* Make payment
* Join video consultation
* Upload test reports
* Receive prescription
* Give rating & feedback

---

## 🧑‍⚕️ Doctor Flow

* Register & upload certificates
* Wait for admin approval
* Manage appointments
* Attend video consultations
* Chat in real-time
* Send prescriptions

---

## 🛡️ Admin Flow

* Verify doctor documents
* Approve/reject doctors
* Monitor platform activity

---

# 🎥 Demo Videos & Screenshots

> **Upload your workflow videos, UI demo videos, and screenshots here.**
> (You can upload mp4/webm files on GitHub or add links to Google Drive / YouTube.)

Example:

* **Doctor Verification Flow (Video)**
* **Patient Appointment Booking (Screenshots)**
* **AI Report Analyzer Demonstration (Video)**
* **Video Call UI Demo (Screenshots)**

---

# 🔮 Future Improvements

* Add AI-based symptom checker
* Better dashboards with analytics
* Full Razorpay payment integration
* Improved search using NLP
* Full ML pipeline for automated test recommendations

---

# 📬 Contact

**Author:** Gaurav Yadav
**Email:** [gauravyadavgh@example.com](mailto:gauravyadavgh@example.com)
**LinkedIn:** [https://www.linkedin.com/in/gauravyadav95/](https://www.linkedin.com/in/gauravyadav95/)
**GitHub:** [https://github.com/gaurav-opensource](https://github.com/gaurav-opensource)

