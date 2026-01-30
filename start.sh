#!/bin/bash

# HRMS System Startup Script
# This script provides an easy way to start the complete HRMS system

set -e

echo "🚀 Starting HRMS System..."
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${GREEN}✅ Backend already running on port 8000${NC}"
else
    echo -e "${YELLOW}⏳ Starting backend server...${NC}"
    cd backend
    source venv/bin/activate
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    cd ..
    sleep 3
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 HRMS System is Running!${NC}"
echo "================================"
echo ""
echo "📱 Mobile Client (Employee Interface):"
echo "   Registration: file://$(pwd)/mobile-client/register.html"
echo "   Attendance:   file://$(pwd)/mobile-client/attendance.html"
echo ""
echo "📊 API Documentation:"
echo "   http://localhost:8000/docs"
echo ""
echo "🔧 Backend API:"
echo "   http://localhost:8000"
echo ""
echo "================================"
echo ""
echo "🎯 Quick Start:"
echo "1. Open mobile-client/register.html in your browser"
echo "2. Register an employee with face capture"
echo "3. Test attendance with mobile-client/attendance.html"
echo ""
echo "Press Ctrl+C to stop the backend server"
echo ""

# Keep script running
wait
