# AI-Powered Employee Management, Attendance & Payroll System

> **Production-Level HRMS using Mobile-Based Face Recognition (InspireFace)**

## 🎯 Project Overview

This is a complete, production-ready HRMS (Human Resource Management System) designed for MSc Big Data Analytics internship projects and industry demonstrations. The system uses **InspireFace** for face recognition and separates mobile employee operations from PC-based admin operations.

### Key Features

- ✅ **Mobile-Only Employee Operations**: Self-registration and attendance via mobile phones
- ✅ **PC-Only Admin Operations**: Management, payroll, and analytics on desktop
- ✅ **InspireFace Integration**: ArcFace-based 512-D face embeddings
- ✅ **Complete HRMS**: Departments, employees, attendance, payroll, analytics
- ✅ **Industry-Grade UI**: Modern design with locked color palette

## 🏗️ System Architecture

```
Mobile (Employee) → ngrok → FastAPI Backend → InspireFace → SQLite
                                    ↓
                            React Admin Dashboard (PC)
```

### Technology Stack

- **Backend**: FastAPI (Python)
- **Face Recognition**: InspireFace (ArcFace-based)
- **Database**: SQLite with BLOB storage for embeddings
- **Frontend**: React.js with Vite
- **Mobile**: HTML5 + Vanilla JavaScript
- **Communication**: ngrok for mobile-to-backend

### Color Palette (Locked)

- Background: `#F9F7F7`
- Cards: `#DBE2EF`
- Primary: `#3F72AF`
- Text: `#112D4E`

## 📁 Project Structure

```
faceai/
├── backend/
│   ├── api/                    # API endpoints
│   ├── face_recognition/       # InspireFace integration
│   ├── utils/                  # Utilities
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── database.py            # Database config
│   ├── config.py              # Settings
│   └── main.py                # FastAPI app
├── mobile-client/
│   ├── register.html          # Employee registration
│   ├── attendance.html        # Attendance check-in
│   ├── styles.css             # Mobile styles
│   └── camera.js              # Camera utilities
├── frontend/
│   └── src/
│       ├── components/        # React components
│       ├── styles/            # CSS styles
│       └── utils/             # API utilities
└── docs/                      # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- ngrok account (for mobile access)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Start Backend Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 3. Setup ngrok

```bash
ngrok http 8000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 4. Configure Mobile Client

Edit `mobile-client/register.html` and `mobile-client/attendance.html`:

```javascript
const API_URL = 'https://your-ngrok-url.ngrok.io';
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The admin dashboard will be available at `http://localhost:3000`

### 6. Create Admin Account

Visit `http://localhost:8000/docs` and use the `/auth/register` endpoint to create an admin account.

## 📱 Mobile Usage

### Employee Self-Registration

1. Open `https://your-ngrok-url.ngrok.io/mobile-client/register.html` on mobile
2. Fill in employee details
3. Capture face using camera
4. System extracts embedding and stores in database

### Daily Attendance

1. Open `https://your-ngrok-url.ngrok.io/mobile-client/attendance.html` on mobile
2. Camera opens automatically
3. Capture face
4. System recognizes and marks attendance

## 💻 Admin Dashboard Usage

### Login

1. Navigate to `http://localhost:3000`
2. Login with admin credentials
3. Access dashboard

### Features

- **Overview**: Statistics, recent attendance
- **Employees**: View all registered employees
- **Attendance**: Monitor attendance records
- **Payroll**: Calculate and view payroll
- **Analytics**: Charts and trends

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - Register admin
- `POST /auth/login` - Login admin

### Employees
- `POST /employees/register-face` - Mobile registration
- `GET /employees/list` - List employees

### Attendance
- `POST /attendance/check-in` - Mobile check-in
- `GET /attendance/history` - Attendance history

### Payroll
- `POST /payroll/calculate-monthly/{month}/{year}` - Calculate payroll
- `GET /payroll/summary` - Payroll summary

### Analytics
- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/monthly-trends` - Trends
- `GET /analytics/department-wise` - Department stats

## 🎓 Viva Preparation

**Key Points:**

1. **Mobile-First Design**: Employees use only mobile phones for registration and attendance
2. **InspireFace**: 512-D embeddings stored as BLOB in SQLite
3. **No Raw Images**: Only embeddings are stored for privacy
4. **Real-time Recognition**: Cosine similarity matching with configurable threshold
5. **Complete HRMS**: Departments, payroll, analytics - production-ready

**Viva Line:**

> "Employees self-register and mark attendance using mobile phones via ngrok, while HR operations like payroll and analytics are managed on PC dashboards, using centralized InspireFace-based recognition, SQLite embedding storage, and an industry-grade HRMS architecture."

## 📊 Database Schema

- **departments**: id, name, description
- **employees**: id, name, email, employee_id, department_id, face_embedding (BLOB)
- **attendance**: id, employee_id, date, check_in_time, confidence_score
- **payroll**: id, employee_id, month, year, present_days, total_salary

## 🔒 Security

- JWT authentication for admin
- Password hashing with bcrypt
- No raw face images stored
- HTTPS via ngrok for mobile

## 📝 License

This project is for educational purposes.

## 👥 Authors

MSc Big Data Analytics Project

---

**Note**: Replace `NGROK_URL_HERE` in mobile HTML files with your actual ngrok URL before testing.
