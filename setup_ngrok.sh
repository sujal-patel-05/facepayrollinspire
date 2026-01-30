#!/bin/bash

# ngrok Setup Script for HRMS System
# This script helps you configure ngrok for mobile access

set -e

echo "🌐 ngrok Setup for HRMS System"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}❌ ngrok is not installed${NC}"
    echo "Installing ngrok..."
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
    sudo apt update
    sudo apt install -y ngrok
    echo -e "${GREEN}✅ ngrok installed${NC}"
fi

echo ""
echo -e "${YELLOW}📝 To use ngrok, you need an authentication token${NC}"
echo ""
echo "Steps to get your token:"
echo "1. Visit: https://dashboard.ngrok.com/signup"
echo "2. Sign up for a FREE account (Google/GitHub login available)"
echo "3. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken"
echo "4. Copy your authtoken"
echo ""
echo -e "${BLUE}Press Enter when you have your authtoken ready...${NC}"
read

echo ""
echo "Enter your ngrok authtoken:"
read -r AUTHTOKEN

if [ -z "$AUTHTOKEN" ]; then
    echo -e "${RED}❌ No token provided. Exiting.${NC}"
    exit 1
fi

# Configure ngrok
echo ""
echo "Configuring ngrok..."
ngrok config add-authtoken "$AUTHTOKEN"

echo -e "${GREEN}✅ ngrok configured successfully!${NC}"
echo ""
echo "Starting ngrok tunnel on port 8000..."
echo ""
echo -e "${YELLOW}Keep this terminal open. Your public URL will appear below.${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the tunnel.${NC}"
echo ""

# Start ngrok
ngrok http 8000
