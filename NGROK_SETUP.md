# 🌐 ngrok Setup Guide - Access Your HRMS from Anywhere

## 📋 What is ngrok?

ngrok creates a secure tunnel from the internet to your local server, allowing you to access your HRMS system from any device, anywhere in the world!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Free ngrok Account

1. **Open this link:** https://dashboard.ngrok.com/signup
2. **Sign up using:**
   - Google account (fastest)
   - GitHub account
   - Or email/password

**It's completely FREE!** No credit card required.

### Step 2: Get Your Authentication Token

After signing up:
1. You'll be redirected to: https://dashboard.ngrok.com/get-started/your-authtoken
2. **Copy your authtoken** (looks like: `2abc123def456ghi789jkl`)

### Step 3: Run Setup Script

Open a new terminal and run:

```bash
cd /home/petpooja-1118/Desktop/faceai
./setup_ngrok.sh
```

The script will:
1. Check if ngrok is installed
2. Ask for your authtoken
3. Configure ngrok
4. Start the tunnel
5. Show you your public URL!

### Step 4: Get Your Public URL

After running the script, you'll see something like:

```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:8000
```

**Copy this HTTPS URL!** This is your public URL.

### Step 5: Update Mobile Client

You need to update the mobile client files with your ngrok URL.

**Option A - Automatic (Recommended):**
```bash
cd /home/petpooja-1118/Desktop/faceai
./update_ngrok_url.sh https://YOUR-NGROK-URL.ngrok-free.app
```

**Option B - Manual:**

Edit these files:
1. `mobile-client/register.html` (line 99)
2. `mobile-client/attendance.html` (line 79)

Change:
```javascript
const API_URL = 'https://YOUR-NGROK-URL.ngrok-free.app';
```

---

## 📱 Access from Mobile

### Share Your URLs

**Registration Page:**
```
https://YOUR-NGROK-URL.ngrok-free.app/mobile-client/register.html
```

**Attendance Page:**
```
https://YOUR-NGROK-URL.ngrok-free.app/mobile-client/attendance.html
```

**Share these URLs via:**
- WhatsApp
- Email
- SMS
- QR Code

### Access from Anywhere!

Now anyone with the URL can:
- Register their face
- Mark attendance
- Access from any device
- No WiFi restrictions!

---

## 🔧 Manual Setup (Alternative)

If you prefer to do it manually:

### 1. Install ngrok (Already Done)
```bash
# ngrok is already installed on your system
ngrok version
```

### 2. Configure Authentication
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### 3. Start Tunnel
```bash
ngrok http 8000
```

### 4. Note Your URL

Look for the line:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:8000
```

Copy the HTTPS URL.

### 5. Update Mobile Client

Edit both files and replace the API_URL with your ngrok URL.

---

## 🎯 Complete Example

Let's say your ngrok URL is: `https://abc123.ngrok-free.app`

### Update register.html (line 99):
```javascript
const API_URL = 'https://abc123.ngrok-free.app';
```

### Update attendance.html (line 79):
```javascript
const API_URL = 'https://abc123.ngrok-free.app';
```

### Share with employees:
- Registration: `https://abc123.ngrok-free.app/mobile-client/register.html`
- Attendance: `https://abc123.ngrok-free.app/mobile-client/attendance.html`

---

## 📊 View Dashboard

Access API documentation from anywhere:
```
https://YOUR-NGROK-URL.ngrok-free.app/docs
```

---

## ⚠️ Important Notes

### Free Plan Limitations
- URL changes each time you restart ngrok
- Session expires after 2 hours (just restart)
- Limited to 1 tunnel at a time

### Keep Terminal Open
- Don't close the terminal running ngrok
- If closed, restart with: `ngrok http 8000`
- You'll get a new URL each time

### Update URLs After Restart
- If ngrok restarts, you get a new URL
- Update mobile client files with new URL
- Share new URLs with employees

---

## 🔒 Security

ngrok provides:
- ✅ HTTPS encryption
- ✅ Secure tunnel
- ✅ No port forwarding needed
- ✅ No firewall changes needed

---

## 🆘 Troubleshooting

### "Authentication failed"
- You need to add your authtoken
- Run: `ngrok config add-authtoken YOUR_TOKEN`

### "Tunnel not found"
- ngrok might have stopped
- Restart: `ngrok http 8000`

### "Can't access from mobile"
- Check if ngrok is still running
- Verify you're using the HTTPS URL
- Make sure you updated the mobile client files

### "Face registration fails"
- Check backend is still running
- Verify ngrok tunnel is active
- Check browser console for errors

---

## 🎓 Pro Tips

### 1. Keep Backend Running
```bash
# Terminal 1: Backend
cd /home/petpooja-1118/Desktop/faceai/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: ngrok
ngrok http 8000
```

### 2. Save Your URL
After starting ngrok, save the URL somewhere so you can share it easily.

### 3. Test Locally First
Before sharing with others, test the ngrok URL on your own mobile device.

### 4. Monitor Traffic
ngrok shows all requests in the terminal - useful for debugging!

---

## 🎉 You're All Set!

Once ngrok is running:
1. ✅ Your HRMS is accessible from anywhere
2. ✅ Employees can register from their phones
3. ✅ Attendance can be marked remotely
4. ✅ Completely secure with HTTPS

**Start ngrok now and share your HRMS system with the world!** 🌍
