# 🏥 SmartCare Platform

**(End-to-end Healthcare Management & Telemedicine System)**

SmartCare Platform is a **full-stack healthcare platform** designed to enable seamless doctor–patient interaction through digital consultations, secure data handling, and intelligent medical report analysis.

The platform supports  **role-based dashboards**, **real-time video consultations**,  **secure medical report uploads**,  **AI-Powered Medical Report Analysis & Smart Doctor Recommendation**, and **cloud-based storage**, delivering a complete and modern telehealth solution.

---

## 📌 Table of Contents

* [About the Project](#about-the-project)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
  
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
    
* [Project Workflow](#project-workflow)
  * [Patient Flow](#patient-flow)
  * [Doctor Flow](#doctor-flow)
  * [Admin Flow](#admin-flow)
    
* [AI Medical Report Analyzer](#ai-medical-report-analyzer)
* [Demo Videos & Screenshots](#demo-videos--screenshots)
* [Future Enhancements](#future-enhancements)
* [Contact](#contact)

---

## 📖 About the Project

**SmartCare Platform** is an end-to-end **online healthcare management platform** that connects patients, doctors, and administrators on a single secure system.

It provides:

* 1 - Smart doctor discovery
* 2 - Appointment scheduling
* 3 - Real-time video consultations
* 4 - Secure medical report handling
* 5 - AI-powered medical report interpretation

SmartCare Platform focuses on scalability, security, and real-world healthcare workflows, enabling doctors to easily create and manage their profiles while allowing patients to seamlessly discover, consult, and book appointments with the right doctors.

---

## ⭐ Key Features

### 🔐 Role-Based Access

* **Patient Dashboard**
* **Doctor Dashboard**
* **Admin Dashboard**

---

### 🔎 Smart Doctor Search

* Filter doctors by:

  * Specialization
  * Location
  * Consultation fees
  * Ratings

---

### 👤 Profile Management

* Doctors manage:

  * Qualifications
  * Experience
  * Availability
 
* Patients manage:
  * Personal health profile
  * Appointments dashboard
  * Medical reports

---

### 🛡️ Secure Admin Panel

* Doctor document verification
* Approval/rejection of doctor onboarding
* Platform monitoring

---

### 📅 Appointment Booking System

* Date & time-based appointment scheduling
* Appointment status tracking:
* payment System

  * Pending
  * Upcoming
  * Completed

---

### 🎥 Video Consultation (WebRTC + Socket.IO)

* One-to-one real-time video calls
* In-call chat
* Live notifications

---

### 📤 Secure Medical File Upload

* Upload reports (PDF / JPG / PNG)
* Stored securely using **Cloudinary**

---

### 💊 Prescription Management

* Doctors upload prescription
* Patients can view and download prescriptions

---

### ⭐ Doctor Rating & Feedback

* Patients rate doctors after appointments
* Improves trust and transparency

---

### 💰 Payment Integration

* Appointment payment workflow implemented
* Razorpay integration planned for production

---

### 🔔 Notifications

* Email alerts for:

  * Appointment updates
  * Doctor approval status

---

## 🤖 AI Medical Report Analyzer

A **standalone AI microservice** built using **FastAPI** to analyze uploaded medical reports.

### 🔍 What It Does

* Accepts **PDF / image medical reports**
* Extracts text using:

  * `PyPDF2` (PDF)
  * `Tesseract OCR` (Images)
* Identifies medical parameters using **regex-based extraction**
* Compares values with standard medical ranges
* Flags:

  * Normal
  * Abnormal
  * Missing parameters

---

### 🧠 Parameters Analyzed

* Hemoglobin
* RBC / WBC / Platelets
* Cholesterol (HDL, LDL, Total)
* Triglycerides
* Blood Glucose (Fasting & PP)
* Creatinine
* Urea
* Vitamin D & B12
* Hematocrit, MCV, MCH, MCHC

---

### 📊 AI Output

* Overall **risk level** (Low / Medium / High)
* Count of abnormal parameters
* Parameter-wise analysis
* **Specialist recommendations** (Cardiologist, Nephrologist, Endocrinologist, etc.)
* AI-generated medical summary

---

### 🧩 Architecture

* Backend (Node.js) uploads report to Cloudinary
* FastAPI service fetches file URL
* AI engine processes & returns structured insights
* Results shown in patient dashboard

---

## 🛠️ Technology Stack

### **Frontend**

* React.js
* Tailwind CSS

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose

### **AI & Microservices**

* FastAPI (Python)
* PyPDF2
* Tesseract OCR
* Regex-based NLP processing

### **Other Tools**

* WebRTC (Video Calling)
* Socket.IO (Chat & Signaling)
* Cloudinary (File Storage)
* JWT (Authentication)
* Bcrypt (Password Hashing)
* Docker & Render (Deployment)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v14+)
* MongoDB
* Python 3.9+
* Cloudinary account
* Git

---

### Installation

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/gaurav-opensource/Smart-Digital-Healthcare-System.git
cd Smart-Digital-Healthcare-System
```

---

#### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/healthcare
PORT=5000
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

Start backend:

```bash
npm start
```

---

#### 3️⃣ AI Service (FastAPI)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

#### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔄 Project Workflow

### 👨‍⚕️ Patient Flow

* Register/Login
* Search doctors
* Book appointment
* Upload medical reports
* Attend video consultation
* View AI report analysis
* Receive prescription
* Submit rating

---

### 🧑‍⚕️ Doctor Flow

* Register & upload documents
* Admin approval
* Manage appointments
* Conduct consultations
* Upload prescriptions

---

### 🛡️ Admin Flow

* Verify doctor credentials
* Approve/reject doctors
* Monitor system usage

---

## 🎥 Demo Videos & Screenshots

> Add demo videos, screenshots, or links here:

* Doctor verification flow
* Appointment booking UI
* AI report analyzer demo
* Video consultation interface

---

## 🔮 Future Enhancements

* AI-based symptom checker
* Advanced analytics dashboard
* Full Razorpay integration
* NLP-based doctor search
* Multi-language support

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

**Author:** Gaurav Yadav
📧 Email: [gauravyadavgh@example.com](mailto:gauravyadavgh@example.com)
🔗 LinkedIn: [https://www.linkedin.com/in/gauravyadav95/](https://www.linkedin.com/in/gauravyadav95/)
💻 GitHub: [https://github.com/gaurav-opensource](https://github.com/gaurav-opensource)


