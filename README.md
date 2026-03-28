# 🚀 AI Resume Job Matcher

An AI-powered web application that analyzes resumes and compares them with job descriptions to calculate a match percentage and identify skill gaps.

---

## 📌 Features

- 📄 Upload Resume (PDF)
- 🧠 Extract text using pdf-parse
- 📊 Calculate Match Percentage
- ✅ Show Matched Skills
- ❌ Show Missing Skills
- 🌐 Deployed using:
  - Frontend: Vercel
  - Backend: Render

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS

### Backend
- Node.js
- Express.js
- Multer
- pdf-parse

---

## 📁 Project Structure

ai-resume-job-matcher-enterprise/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

git clone https://github.com/YOUR_USERNAME/ai-resume-job-matcher-enterprise.git  
cd ai-resume-job-matcher-enterprise  

---

### 2️⃣ Backend Setup

cd backend  
npm install  
npm start  

---

### 3️⃣ Frontend Setup

cd frontend  
npm install  
npm start  

---

## 🌐 Live Demo

Frontend: https://ai-resume-job-matcher-enterprise.vercel.app  
Backend: https://ai-resume-job-matcher-enterprise.onrender.com  

---

## 📡 API Endpoint

POST /analyze  

Request:
- resume (PDF)
- jobDescription (text)

Response:

{
  "matchPercentage": 75,
  "matchedSkills": ["javascript", "react"],
  "missingSkills": ["docker", "kubernetes"]
}

---

## ⚠️ Notes

- Backend must use process.env.PORT
- Frontend must use Render API URL
- Enable CORS in backend

---

## 👨‍💻 Author

Sunny Surendra

---

## ⭐ Give a star if you like this project!