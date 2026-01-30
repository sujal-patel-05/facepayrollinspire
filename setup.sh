#!/bin/bash

# Setup script for HRMS system

echo "🚀 Setting up AI-Powered HRMS System..."

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "Python 3 is required"; exit 1; }

# Check Node.js version
echo "Checking Node.js version..."
node --version || { echo "Node.js is required"; exit 1; }

# Setup backend
echo "📦 Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
DATABASE_URL=sqlite:///./hrms.db
FACE_RECOGNITION_THRESHOLD=0.6
EOF
fi

cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && source venv/bin/activate && python main.py"
echo "2. Start ngrok: ngrok http 8000"
echo "3. Update mobile-client HTML files with ngrok URL"
echo "4. Start frontend: cd frontend && npm run dev"
echo "5. Create admin account via http://localhost:8000/docs"
echo ""
echo "📱 Mobile URLs:"
echo "   Registration: https://your-ngrok-url/mobile-client/register.html"
echo "   Attendance: https://your-ngrok-url/mobile-client/attendance.html"
echo ""
echo "💻 Admin Dashboard: http://localhost:3000"
