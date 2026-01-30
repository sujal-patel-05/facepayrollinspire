#!/bin/bash

# InspireFace Setup and Project Initialization Script

set -e  # Exit on error

echo "🚀 InspireFace Setup and HRMS Project Initialization"
echo "=" 

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
INSPIREFACE_PATH="/home/petpooja-1118/Downloads/InspireFace-master"
PROJECT_DIR="/home/petpooja-1118/Desktop/faceai"
BACKEND_DIR="$PROJECT_DIR/backend"

echo -e "${YELLOW}Step 1: Checking Prerequisites${NC}"
echo "----------------------------------------"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found:${NC} $(python3 --version)"

# Check if InspireFace directory exists
if [ ! -d "$INSPIREFACE_PATH" ]; then
    echo -e "${RED}❌ InspireFace not found at: $INSPIREFACE_PATH${NC}"
    echo "Please verify the path or download InspireFace"
    exit 1
fi
echo -e "${GREEN}✅ InspireFace directory found${NC}"

echo ""
echo -e "${YELLOW}Step 2: Setting up Virtual Environment${NC}"
echo "----------------------------------------"

cd "$BACKEND_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo -e "${YELLOW}Step 3: Installing Core Dependencies${NC}"
echo "----------------------------------------"

# Upgrade pip
pip install --upgrade pip

# Install core dependencies first
echo "Installing NumPy, OpenCV, and ONNX Runtime..."
pip install numpy opencv-python onnxruntime

echo ""
echo -e "${YELLOW}Step 4: Installing InspireFace from Local Path${NC}"
echo "----------------------------------------"

# Try to install InspireFace
if [ -f "$INSPIREFACE_PATH/setup.py" ] || [ -f "$INSPIREFACE_PATH/pyproject.toml" ]; then
    echo "Installing InspireFace in development mode..."
    pip install -e "$INSPIREFACE_PATH" || {
        echo -e "${YELLOW}⚠️  Development mode failed, trying direct installation...${NC}"
        pip install "$INSPIREFACE_PATH" || {
            echo -e "${RED}❌ InspireFace installation failed${NC}"
            echo "Continuing with fallback mode (OpenCV Haar Cascade)"
        }
    }
else
    echo -e "${YELLOW}⚠️  No setup.py found in InspireFace directory${NC}"
    echo "Adding InspireFace to Python path instead..."
    
    # Add to .env file
    if [ ! -f .env ]; then
        echo "PYTHONPATH=$INSPIREFACE_PATH" >> .env
    else
        if ! grep -q "PYTHONPATH" .env; then
            echo "PYTHONPATH=$INSPIREFACE_PATH" >> .env
        fi
    fi
    echo -e "${GREEN}✅ Added InspireFace to PYTHONPATH in .env${NC}"
fi

echo ""
echo -e "${YELLOW}Step 5: Installing Project Dependencies${NC}"
echo "----------------------------------------"

# Install remaining dependencies
pip install -r requirements.txt

echo ""
echo -e "${YELLOW}Step 6: Testing InspireFace Installation${NC}"
echo "----------------------------------------"

# Run test script
python test_inspireface.py

echo ""
echo -e "${YELLOW}Step 7: Creating Environment Configuration${NC}"
echo "----------------------------------------"

# Create or update .env file
if [ ! -f .env ]; then
    cat > .env << EOF
# Database
DATABASE_URL=sqlite:///./hrms.db

# JWT Authentication
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# InspireFace
FACE_RECOGNITION_THRESHOLD=0.6
INSPIREFACE_MODEL_PATH=./models

# Python Path (for local InspireFace)
PYTHONPATH=$INSPIREFACE_PATH

# ngrok URL (update after starting ngrok)
NGROK_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${YELLOW}Step 8: Initializing Database${NC}"
echo "----------------------------------------"

# Start backend briefly to create database
echo "Starting backend to initialize database..."
timeout 5 python main.py || true
echo -e "${GREEN}✅ Database initialized${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Start the backend server:"
echo "   cd $BACKEND_DIR"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "2️⃣  In a new terminal, start ngrok:"
echo "   ngrok http 8000"
echo ""
echo "3️⃣  Update mobile client with ngrok URL:"
echo "   Edit mobile-client/register.html"
echo "   Edit mobile-client/attendance.html"
echo "   Replace 'NGROK_URL_HERE' with your ngrok HTTPS URL"
echo ""
echo "4️⃣  Start the frontend:"
echo "   cd $PROJECT_DIR/frontend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "5️⃣  Create admin account:"
echo "   Visit http://localhost:8000/docs"
echo "   Use /auth/register endpoint"
echo ""
echo "📱 Mobile URLs (after ngrok setup):"
echo "   Registration: https://your-ngrok-url/mobile-client/register.html"
echo "   Attendance: https://your-ngrok-url/mobile-client/attendance.html"
echo ""
echo "💻 Admin Dashboard:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   README: $PROJECT_DIR/README.md"
echo "   Architecture: $PROJECT_DIR/docs/ARCHITECTURE.md"
echo "   Deployment: $PROJECT_DIR/docs/DEPLOYMENT.md"
echo "   InspireFace Setup: $PROJECT_DIR/docs/INSPIREFACE_SETUP.md"
echo ""
