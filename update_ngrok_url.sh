#!/bin/bash

# Script to update mobile client URLs with ngrok URL

if [ -z "$1" ]; then
    echo "Usage: ./update_ngrok_url.sh https://your-ngrok-url.ngrok-free.app"
    exit 1
fi

NGROK_URL="$1"

echo "Updating mobile client with ngrok URL: $NGROK_URL"

# Update register.html
sed -i "s|const API_URL = '.*';|const API_URL = '$NGROK_URL';|g" mobile-client/register.html

# Update attendance.html
sed -i "s|const API_URL = '.*';|const API_URL = '$NGROK_URL';|g" mobile-client/attendance.html

echo "✅ Updated successfully!"
echo ""
echo "📱 Share these URLs with employees:"
echo "   Registration: $NGROK_URL/mobile-client/register.html"
echo "   Attendance:   $NGROK_URL/mobile-client/attendance.html"
