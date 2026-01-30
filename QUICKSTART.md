# 🚀 HRMS System - Quick Start Guide

## ✅ System Status

**Backend:** Running on `http://localhost:8000`  
**InspireFace:** v1.2.3 with Megatron model loaded  
**Database:** SQLite (hrms.db) created with sample departments  

---

## 🎯 What's Working Right Now

### 1. Backend API (FastAPI) ✅
- Face recognition with InspireFace Megatron model
- All REST API endpoints functional
- Database initialized

### 2. Mobile Client (HTML5) ✅
- Employee registration page
- Attendance check-in page
- Camera access ready

---

## 📱 Quick Test - Mobile Face Registration

### Step 1: Open Mobile Registration Page

```bash
# Open in your browser
firefox mobile-client/register.html
# OR
google-chrome mobile-client/register.html
```

### Step 2: Test Registration
1. Fill in employee details:
   - Name: Test Employee
   - Email: test@company.com
   - Phone: 1234567890
   - Department: Select from dropdown
   - Position: Software Engineer

2. Click "Capture Face" button
3. Allow camera access
4. Position your face in the guide
5. Click "Register Employee"

### Step 3: Verify in Database

```bash
cd backend
source venv/bin/activate
python -c "
from database import SessionLocal
from models import Employee

db = SessionLocal()
employees = db.query(Employee).all()
for emp in employees:
    print(f'ID: {emp.id}, Name: {emp.full_name}, Has Face: {emp.face_embedding is not None}')
"
```

---

## 🔐 Admin Dashboard Access

### Option 1: Create Admin Account

```bash
cd backend
source venv/bin/activate
python -c "
from database import SessionLocal
from models import Admin
import bcrypt

db = SessionLocal()

# Simple password hashing
password = 'admin123'.encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

admin = Admin(
    username='admin',
    email='admin@hrms.com',
    hashed_password=hashed.decode('utf-8'),
    full_name='System Administrator'
)
db.add(admin)
db.commit()
print('✅ Admin created: username=admin, password=admin123')
"
```

### Option 2: Access API Directly

Visit: `http://localhost:8000/docs`

This opens the FastAPI interactive documentation where you can:
- Test all API endpoints
- View employee data
- Check attendance records
- Generate payroll

---

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/register` - Create admin account

### Employees
- `POST /employees/register-face` - Register employee with face
- `GET /employees/` - List all employees
- `GET /employees/{id}` - Get employee details

### Attendance
- `POST /attendance/check-in` - Face-based check-in
- `GET /attendance/today` - Today's attendance
- `GET /attendance/employee/{id}` - Employee attendance history

### Payroll
- `POST /payroll/generate/{employee_id}` - Generate payroll
- `GET /payroll/employee/{id}` - Get employee payroll

### Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/attendance-trends` - Attendance trends

---

## 🔧 Troubleshooting

### Backend Not Running?

```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Check InspireFace Status

```bash
cd backend
source venv/bin/activate
python -c "import inspireface as isf; print(f'InspireFace v{isf.__version__}')"
```

### View Backend Logs

The backend terminal shows:
- Face detection results
- Embedding extraction status
- API request logs
- Database operations

---

## 📱 Mobile Access via ngrok

### Step 1: Install ngrok

```bash
# Download from https://ngrok.com/download
# Or install via snap
sudo snap install ngrok
```

### Step 2: Start ngrok Tunnel

```bash
ngrok http 8000
```

### Step 3: Update Mobile Client

Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`) and update:

**mobile-client/register.html** (around line 150):
```javascript
const API_URL = 'https://YOUR-NGROK-URL.ngrok.io';
```

**mobile-client/attendance.html** (around line 120):
```javascript
const API_URL = 'https://YOUR-NGROK-URL.ngrok.io';
```

Now you can access the mobile client from any device on the internet!

---

## 🎨 Frontend Dashboard (React)

**Note:** The React frontend requires Node.js v18+ but your system has v12.

### Option A: Upgrade Node.js (Recommended)

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18

# Install and run frontend
cd frontend
npm install
npm run dev
```

### Option B: Use API Documentation

Access `http://localhost:8000/docs` for full API functionality without the React dashboard.

---

## 🎯 Next Steps

1. ✅ **Test Face Registration** - Use mobile-client/register.html
2. ✅ **Test Attendance** - Use mobile-client/attendance.html  
3. ⏳ **Setup ngrok** - For mobile device access
4. ⏳ **Upgrade Node.js** - For React dashboard
5. ⏳ **Create Admin Account** - For dashboard login

---

## 📞 Support

- **API Documentation:** http://localhost:8000/docs
- **Backend Logs:** Check terminal running uvicorn
- **Database:** backend/hrms.db (SQLite browser compatible)

---

## 🏆 What You've Built

✅ Production-grade face recognition with InspireFace  
✅ RESTful API with FastAPI  
✅ Mobile-first employee interface  
✅ Complete HRMS functionality  
✅ Comprehensive documentation  

**The system is READY for demonstration and testing!**
