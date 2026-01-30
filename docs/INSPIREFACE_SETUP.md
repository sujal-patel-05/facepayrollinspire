# InspireFace Local Installation Guide

## Overview

This guide explains how to use InspireFace from a local directory instead of pip installation.

## Step 1: Locate Your InspireFace Directory

Based on your screenshot, InspireFace is located at:
```
/home/petpooja-1118/Downloads/InspireFace-master
```

## Step 2: Install InspireFace from Local Path

### Option A: Install in Development Mode (Recommended)

This creates a symbolic link, so changes to the source are immediately available:

```bash
# Activate your virtual environment first
cd /home/petpooja-1118/Desktop/faceai/backend
source venv/bin/activate

# Install InspireFace in editable mode
pip install -e /home/petpooja-1118/Downloads/InspireFace-master
```

### Option B: Direct Installation

```bash
# Activate virtual environment
cd /home/petpooja-1118/Desktop/faceai/backend
source venv/bin/activate

# Install from local directory
pip install /home/petpooja-1118/Downloads/InspireFace-master
```

### Option C: Add to Python Path (Not Recommended for Production)

If the above methods don't work, you can add to PYTHONPATH:

```bash
# Temporary (current session only)
export PYTHONPATH="/home/petpooja-1118/Downloads/InspireFace-master:$PYTHONPATH"
```

## Step 3: Verify Installation

Create a test script to verify InspireFace is working:

```bash
cd /home/petpooja-1118/Desktop/faceai/backend
python test_inspireface.py
```

## Step 4: Check InspireFace Dependencies

InspireFace typically requires:
- numpy
- opencv-python
- onnxruntime (or onnxruntime-gpu)

Install missing dependencies:

```bash
pip install numpy opencv-python onnxruntime
```

## Common Issues and Solutions

### Issue 1: ModuleNotFoundError

**Error**: `ModuleNotFoundError: No module named 'inspireface'`

**Solutions**:
1. Check if InspireFace has a `setup.py` or `pyproject.toml`
2. Verify the directory structure
3. Try installing dependencies first

### Issue 2: Import Error

**Error**: `ImportError: cannot import name 'X' from 'inspireface'`

**Solutions**:
1. Check InspireFace version compatibility
2. Verify all dependencies are installed
3. Check if models are downloaded

### Issue 3: ONNX Runtime Error

**Error**: `Error loading ONNX model`

**Solutions**:
1. Download required model files
2. Set correct model path in config
3. Check ONNX runtime installation

## Step 5: Update Backend Configuration

Update the InspireFace engine to handle local installation properly.

## Verification Checklist

- [ ] Virtual environment activated
- [ ] InspireFace installed (check with `pip list | grep inspire`)
- [ ] Dependencies installed
- [ ] Test import successful
- [ ] Model files available (if required)

## Next Steps

After successful installation:
1. Run the test script
2. Start the backend server
3. Test face recognition endpoints
