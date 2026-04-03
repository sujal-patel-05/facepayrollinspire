#!/bin/bash

# Master Startup Script for HRMS System
# Starts Backend, Ngrok, Frontend, Admin Dashboard
# Auto-configures Mobile Client with Ngrok URL

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# PIDs
BACKEND_PID=""
NGROK_PID=""
FRONTEND_PID=""
ADMIN_PID=""

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    if [ -n "$BACKEND_PID" ]; then kill $BACKEND_PID 2>/dev/null || true; fi
    if [ -n "$NGROK_PID" ]; then kill $NGROK_PID 2>/dev/null || true; fi
    if [ -n "$FRONTEND_PID" ]; then kill $FRONTEND_PID 2>/dev/null || true; fi
    if [ -n "$ADMIN_PID" ]; then kill $ADMIN_PID 2>/dev/null || true; fi
    echo -e "${GREEN}✅ All services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🚀 Starting HRMS System Full Stack...${NC}"
echo "=========================================="

# 1. Start Backend
echo -e "${YELLOW}⏳ Starting Backend...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}⚠️  Port 8000 is already in use. Killing existing process...${NC}"
    kill $(lsof -Pi :8000 -sTCP:LISTEN -t)
    sleep 2
fi

cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# 2. Start Ngrok
echo -e "${YELLOW}⏳ Starting Ngrok...${NC}"
ngrok http 8000 > /dev/null 2>&1 &
NGROK_PID=$!
sleep 5 # Wait for ngrok to initialize

# Fetch Ngrok URL
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*')

if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ Failed to get Ngrok URL. Is ngrok installed and authenticated?${NC}"
    # Continuing without ngrok update
else
    echo -e "${GREEN}✅ Ngrok started at: $NGROK_URL${NC}"
    
    # 3. Update Mobile Client
    echo -e "${YELLOW}📝 Updating Mobile Client configuration...${NC}"
    
    # Update register.html
    sed -i "s|const API_URL = '.*';|const API_URL = '$NGROK_URL';|" mobile-client/register.html
    
    # Update attendance.html
    sed -i "s|const API_URL = '.*';|const API_URL = '$NGROK_URL';|" mobile-client/attendance.html
    
    echo -e "${GREEN}✅ Mobile Client configured.${NC}"
fi

# 4. Start Frontend
echo -e "${YELLOW}⏳ Starting Frontend...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# 5. Start Admin Dashboard
echo -e "${YELLOW}⏳ Starting Admin Dashboard...${NC}"
cd admin-dashboard
npm run dev > ../admin-dashboard.log 2>&1 &
ADMIN_PID=$!
cd ..
echo -e "${GREEN}✅ Admin Dashboard started (PID: $ADMIN_PID)${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 All Systems Operational!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}🔧 Backend:${NC}             http://localhost:8000"
echo -e "${BLUE}🌐 Frontend:${NC}            http://localhost:5173"
echo -e "${BLUE}👤 Admin Dashboard:${NC}     http://localhost:5174"
echo ""
echo -e "${BLUE}📱 Mobile Access (Process):${NC}"
echo -e "   1. Open on your phone: ${YELLOW}$NGROK_URL/mobile-client/register.html${NC}"
echo -e "   2. Register your face."
echo -e "   3. Mark attendance:    ${YELLOW}$NGROK_URL/mobile-client/attendance.html${NC}"
echo ""
echo -e "${YELLOW}Logs: backend.log, frontend.log, admin-dashboard.log${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services.${NC}"

wait
