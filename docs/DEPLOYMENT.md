# Deployment Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- ngrok account
- InspireFace installed

## Step-by-Step Deployment

### 1. Backend Deployment

#### Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Configure Environment

Create `.env` file:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./hrms.db
FACE_RECOGNITION_THRESHOLD=0.6
```

#### Initialize Database

```bash
python main.py
```

This will:
- Create database tables
- Add sample departments
- Start the API server

### 2. ngrok Setup

#### Install ngrok

```bash
# Download from https://ngrok.com/download
# Or use package manager
sudo snap install ngrok  # Linux
brew install ngrok       # macOS
```

#### Start ngrok Tunnel

```bash
ngrok http 8000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

#### Update Mobile Client

Edit both `mobile-client/register.html` and `mobile-client/attendance.html`:

```javascript
const API_URL = 'https://your-actual-ngrok-url.ngrok-free.app';
```

### 3. Frontend Deployment

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure API URL

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

#### Start Development Server

```bash
npm run dev
```

#### Build for Production

```bash
npm run build
```

Serve the `dist` folder with any static server.

### 4. Create Admin Account

Visit `http://localhost:8000/docs` (FastAPI Swagger UI)

Use `/auth/register` endpoint:

```json
{
  "username": "admin",
  "email": "admin@company.com",
  "password": "secure_password"
}
```

### 5. Mobile Access

#### Serve Mobile Client

```bash
cd mobile-client
python -m http.server 8080
```

Then access via ngrok:

```bash
ngrok http 8080
```

Or serve directly through the backend by adding static file serving.

#### Test Mobile Registration

1. Open ngrok URL + `/register.html` on mobile
2. Complete registration with face capture
3. Verify in admin dashboard

#### Test Mobile Attendance

1. Open ngrok URL + `/attendance.html` on mobile
2. Capture face
3. Verify attendance marked

## Production Deployment

### Backend (Production Server)

```bash
# Use gunicorn for production
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Production Build)

```bash
npm run build
# Serve dist folder with nginx or similar
```

### Database Backup

```bash
# Backup SQLite database
cp hrms.db hrms_backup_$(date +%Y%m%d).db
```

## Troubleshooting

### Camera Not Working on Mobile

- Ensure HTTPS (ngrok provides this)
- Check browser permissions
- Try different browser

### Face Not Recognized

- Check lighting conditions
- Ensure face is clearly visible
- Verify threshold setting (default: 0.6)

### ngrok URL Changes

- Free ngrok URLs change on restart
- Update mobile HTML files each time
- Consider paid ngrok for static URLs

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong admin password
- [ ] Enable HTTPS (ngrok provides)
- [ ] Regular database backups
- [ ] Monitor API access logs

## Performance Optimization

- Use production WSGI server (gunicorn)
- Enable database indexing
- Optimize face recognition threshold
- Cache department/employee lists
- Use CDN for frontend assets
