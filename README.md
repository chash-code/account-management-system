# Account Management System

A Full Stack Account Management System built with React, Node.js, Express, and Supabase.

## Features
- User Signup and Login with JWT Authentication
- Account Dashboard with current balance
- Send Money to other registered users
- Account Statement with color-coded transactions (Green = Credit, Red = Debit)

## Tech Stack
- **Frontend:** React, React Router, Context API, Axios
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT (JSON Web Token)

##  Structure
project-repo/
├── frontend/   → React Application
└── backend/    → Node + Express + Supabase
## Setup
1. Add your Supabase URL and key to `backend/.env`
2. Run backend: `cd backend && npm install && npm start`
3. Run frontend: `cd frontend && npm install && npm start`
