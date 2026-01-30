#!/bin/bash

# InspireFace C++ Compilation Script

set -e  # Exit on error

echo "🔨 InspireFace C++ Library Compilation"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

INSPIREFACE_DIR="/home/petpooja-1118/Downloads/InspireFace-master"
BUILD_DIR="$INSPIREFACE_DIR/build"

echo -e "${YELLOW}Step 1: Checking Build Dependencies${NC}"
echo "----------------------------------------"

# Check for required tools
MISSING_DEPS=()

if ! command -v cmake &> /dev/null; then
    MISSING_DEPS+=("cmake")
fi

if ! command -v g++ &> /dev/null; then
    MISSING_DEPS+=("g++")
fi

if ! command -v make &> /dev/null; then
    MISSING_DEPS+=("build-essential")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing dependencies: ${MISSING_DEPS[*]}${NC}"
    echo ""
    echo "Installing required packages..."
    sudo apt-get update
    sudo apt-get install -y cmake build-essential git
else
    echo -e "${GREEN}✅ All build tools found${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Checking Additional Dependencies${NC}"
echo "----------------------------------------"

# Check for OpenCV development files
if ! pkg-config --exists opencv4 2>/dev/null && ! pkg-config --exists opencv 2>/dev/null; then
    echo -e "${YELLOW}⚠️  OpenCV development files not found${NC}"
    echo "Installing OpenCV development libraries..."
    sudo apt-get install -y libopencv-dev
else
    echo -e "${GREEN}✅ OpenCV development files found${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3: Navigating to InspireFace Directory${NC}"
echo "----------------------------------------"

cd "$INSPIREFACE_DIR"
echo -e "${GREEN}✅ In directory: $(pwd)${NC}"

echo ""
echo -e "${YELLOW}Step 4: Creating Build Directory${NC}"
echo "----------------------------------------"

if [ -d "$BUILD_DIR" ]; then
    echo "Removing existing build directory..."
    rm -rf "$BUILD_DIR"
fi

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"
echo -e "${GREEN}✅ Build directory created${NC}"

echo ""
echo -e "${YELLOW}Step 5: Running CMake Configuration${NC}"
echo "----------------------------------------"

# Run CMake with appropriate flags
cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DISF_BUILD_SHARED_LIBS=ON \
    -DISF_BUILD_LINUX_X86_64=ON \
    -DISF_ENABLE_BENCHMARK=OFF \
    -DISF_ENABLE_TEST=OFF

echo -e "${GREEN}✅ CMake configuration complete${NC}"

echo ""
echo -e "${YELLOW}Step 6: Compiling InspireFace${NC}"
echo "----------------------------------------"

# Build with multiple cores
CORES=$(nproc)
echo "Building with $CORES cores..."
make -j$CORES

echo -e "${GREEN}✅ Compilation complete${NC}"

echo ""
echo -e "${YELLOW}Step 7: Installing Library${NC}"
echo "----------------------------------------"

# Copy library to the expected location
LIB_DIR="$INSPIREFACE_DIR/python/inspireface/modules/core/libs/linux/x64"
mkdir -p "$LIB_DIR"

# Find the compiled library
if [ -f "$BUILD_DIR/libInspireFace.so" ]; then
    cp "$BUILD_DIR/libInspireFace.so" "$LIB_DIR/"
    echo -e "${GREEN}✅ Library installed to: $LIB_DIR${NC}"
elif [ -f "$BUILD_DIR/lib/libInspireFace.so" ]; then
    cp "$BUILD_DIR/lib/libInspireFace.so" "$LIB_DIR/"
    echo -e "${GREEN}✅ Library installed to: $LIB_DIR${NC}"
else
    echo -e "${RED}❌ Could not find compiled library${NC}"
    echo "Searching for library files..."
    find "$BUILD_DIR" -name "*.so" -type f
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 8: Downloading Required Models${NC}"
echo "----------------------------------------"

cd "$INSPIREFACE_DIR/python"

# Activate virtual environment and download models
source /home/petpooja-1118/Desktop/faceai/backend/venv/bin/activate
python pull_models.py

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ InspireFace Compilation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo ""
echo "📋 Next Steps:"
echo "1. Test InspireFace installation:"
echo "   cd /home/petpooja-1118/Desktop/faceai/backend"
echo "   source venv/bin/activate"
echo "   python test_inspireface.py"
echo ""
echo "2. Start the backend server:"
echo "   python main.py"
echo ""
