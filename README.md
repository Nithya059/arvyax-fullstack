# 🌿 Arvyax Full Stack Internship Assignment  

## 📌 Overview  
This project is a **secure wellness session platform** built as part of the Arvyax internship assignment.  

Features include:  
- 🔐 User authentication (JWT-based login/register)  
- 📝 Draft and publish wellness sessions (e.g. yoga, meditation)  
- 💾 Auto-save sessions while typing  
- 📱 Responsive frontend UI  

---

## 🏗️ Tech Stack  
- **Frontend:** React.js (Vercel deployment)  
- **Backend:** Node.js + Express.js (Render deployment)  
- **Database:** MongoDB Atlas (cloud)  
- **Auth:** JWT (jsonwebtoken + bcrypt)  

---

## 🚀 Live Demo  
- **Frontend (Vercel):** [Live Link Here](https://your-frontend-link.vercel.app)
  
- **Backend API (Render):** [API Link Here](https://your-backend-link.onrender.com)  

## 📂 Project Structure
/backend
   ├── index.js
   ├── models/
   ├── routes/
   └── middleware
/frontend
   ├── src/
   ├── public/
   └── pages/
  

## 🔑 API Endpoints  

### Authentication  
- `POST /register` → Register user (with hashed password)  
- `POST /login` → Login + returns JWT  

### Sessions  
- `GET /sessions` → View published sessions  
- `GET /my-sessions` → View drafts/published sessions (auth required)  
- `POST /my-sessions` → Create new session (auth required)  
- `POST /my-sessions/publish` → Publish session  


## ⚙️ Setup Instructions  
# Install Depwndencies
npm install

# Creare .env file in backend
MongoDB_URI= "your mongodb uri"
PORT=5000
JWT_Secret=your-secret

# Start server
node index.js

## Frontend

# install dependencies
npm install

# create .env.local file
NEXT_APP_URL=your url

# run 
npm run dev

### Backend (Node.js + Express)  
1. Clone repo:  
   
  git clone https://github.com/Nithya059/arvyax-fullstack.git
   
   
