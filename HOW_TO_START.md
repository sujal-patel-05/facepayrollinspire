# 🚀 How to Start Your HRMS System

## ✅ Current Status

Your HRMS system is **ALREADY RUNNING**! 

- ✅ **Backend:** Running on http://localhost:8000
- ✅ **InspireFace:** v1.2.3 with Megatron model loaded
- ✅ **Database:** Initialized and ready
- ✅ **Face Recognition:** Active and working

---

## 📱 Step 1: Test Employee Registration (RIGHT NOW!)

### Open the Registration Page

**Option A - Using File Manager:**
1. Open your file manager
2. Navigate to: `/home/petpooja-1118/Desktop/faceai/mobile-client/`
3. Double-click `register.html`

**Option B - Using Browser:**
```bash
firefox /home/petpooja-1118/Desktop/faceai/mobile-client/register.html
```

**Option C - Using Command:**
```bash
xdg-open /home/petpooja-1118/Desktop/faceai/mobile-client/register.html
```

### Registration Form Preview

![Employee Registration Form](file:///home/petpooja-1118/.gemini/antigravity/brain/b51ee9f5-9262-4579-a93b-6904e5632841/employee_registration_form_1769768533229.png)

### Fill the Form

1. **Full Name:** Enter your name (e.g., "John Doe")
2. **Email:** Enter email (e.g., "john@company.com")
3. **Employee ID:** Enter ID (e.g., "EMP001")
4. **Department:** Select from dropdown (IT, HR, Finance, Sales, Operations)
5. Click **"Proceed to Face Capture"**

### Capture Your Face

1. Allow camera access when prompted
2. Position your face in the circular guide
3. Make sure your face is well-lit
4. Click **"Capture Photo"**
5. Review the captured image
6. Click **"Register Employee"**

### Success!

You'll see a success message and the employee will be registered with face embedding stored in the database.

---

## 👤 Step 2: Test Attendance Check-in

### Open Attendance Page

```bash
firefox /home/petpooja-1118/Desktop/faceai/mobile-client/attendance.html
```

### Mark Attendance

1. **Employee ID:** Enter the ID you used for registration (e.g., "EMP001")
2. Click **"Capture Face for Check-in"**
3. Allow camera access
4. Position your face in the guide
5. Click **"Capture Photo"**
6. Click **"Check In"**

### Face Recognition in Action

The system will:
1. Extract face embedding from your photo
2. Compare with stored embeddings in database
3. If match found (similarity > 60%), mark attendance
4. Show success message with your name and confidence score

---

## 📊 Step 3: View API Documentation

### Open Swagger UI

Visit in your browser: **http://localhost:8000/docs**

This interactive documentation lets you:
- Test all API endpoints
- View request/response schemas
- Execute API calls directly
- See employee data
- Check attendance records

### Key Endpoints to Try

1. **GET /employees/** - List all registered employees
2. **GET /attendance/today** - View today's attendance
3. **GET /analytics/dashboard** - Dashboard statistics
4. **GET /departments/** - List departments

---

## 🎯 Complete Workflow Example

### Scenario: Register 3 Employees and Mark Attendance

#### 1. Register First Employee
```
Name: Alice Johnson
Email: alice@company.com
ID: EMP001
Department: IT
Position: Software Engineer
```
- Open `register.html`
- Fill form
- Capture face
- Submit

#### 2. Register Second Employee
```
Name: Bob Smith
Email: bob@company.com
ID: EMP002
Department: HR
Position: HR Manager
```
- Refresh `register.html`
- Fill form
- Capture face
- Submit

#### 3. Register Third Employee
```
Name: Carol Davis
Email: carol@company.com
ID: EMP003
Department: Finance
Position: Accountant
```
- Refresh `register.html`
- Fill form
- Capture face
- Submit

#### 4. Mark Attendance for All
- Open `attendance.html`
- Enter EMP001, capture face, check in
- Refresh page
- Enter EMP002, capture face, check in
- Refresh page
- Enter EMP003, capture face, check in

#### 5. View Results
- Go to http://localhost:8000/docs
- Try **GET /attendance/today**
- See all 3 employees marked present!

---

## 🔧 Useful Commands

### Check Backend Status
```bash
curl http://localhost:8000/
# Should return: {"message":"AI-Powered HRMS System API"}
```

### View All Employees
```bash
curl http://localhost:8000/employees/
```

### View Today's Attendance
```bash
curl http://localhost:8000/attendance/today
```

### Stop Backend
```bash
# Press Ctrl+C in the terminal running the backend
```

### Restart Backend
```bash
cd /home/petpooja-1118/Desktop/faceai/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📱 For Mobile Device Access (Optional)

### Install ngrok
```bash
sudo snap install ngrok
```

### Start ngrok Tunnel
```bash
ngrok http 8000
```

### Update Mobile Client URLs

Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)

**Edit mobile-client/register.html:**
```javascript
// Change this line (around line 150)
const API_URL = 'https://YOUR-NGROK-URL.ngrok.io';
```

**Edit mobile-client/attendance.html:**
```javascript
// Change this line (around line 120)
const API_URL = 'https://YOUR-NGROK-URL.ngrok.io';
```

Now you can access from any mobile device!

---

## 🎨 React Dashboard (Optional - Requires Node.js v18+)

Your system has Node.js v12, but Vite requires v18+.

### Upgrade Node.js
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node 18
nvm install 18
nvm use 18

# Install and run frontend
cd /home/petpooja-1118/Desktop/faceai/frontend
npm install
npm run dev
```

Then access dashboard at: http://localhost:5173

---

## ✅ You're All Set!

**Your HRMS system is fully functional RIGHT NOW!**

Just open the mobile client pages in your browser and start testing:

1. 📝 **Register employees:** `mobile-client/register.html`
2. ✅ **Mark attendance:** `mobile-client/attendance.html`
3. 📊 **View data:** http://localhost:8000/docs

**Everything is working with InspireFace face recognition!** 🎉
