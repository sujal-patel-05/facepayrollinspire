#!/usr/bin/env python3
"""
Test script to verify InspireFace installation and functionality.
"""

import sys
import os

def test_basic_import():
    """Test if InspireFace can be imported."""
    print("=" * 60)
    print("TEST 1: Basic Import")
    print("=" * 60)
    
    try:
        import inspireface
        print("✅ InspireFace imported successfully!")
        print(f"   Location: {inspireface.__file__}")
        
        # Try to get version if available
        if hasattr(inspireface, '__version__'):
            print(f"   Version: {inspireface.__version__}")
        
        return True
    except ImportError as e:
        print(f"❌ Failed to import InspireFace: {e}")
        print("\nTroubleshooting:")
        print("1. Check if InspireFace is installed: pip list | grep inspire")
        print("2. Verify installation path")
        print("3. Check Python path:", sys.path)
        return False

def test_dependencies():
    """Test if required dependencies are available."""
    print("\n" + "=" * 60)
    print("TEST 2: Dependencies Check")
    print("=" * 60)
    
    dependencies = {
        'numpy': 'NumPy',
        'cv2': 'OpenCV',
        'onnxruntime': 'ONNX Runtime'
    }
    
    all_ok = True
    for module, name in dependencies.items():
        try:
            __import__(module)
            print(f"✅ {name} is available")
        except ImportError:
            print(f"❌ {name} is missing - install with: pip install {module if module != 'cv2' else 'opencv-python'}")
            all_ok = False
    
    return all_ok

def test_inspireface_components():
    """Test InspireFace components if import was successful."""
    print("\n" + "=" * 60)
    print("TEST 3: InspireFace Components")
    print("=" * 60)
    
    try:
        import inspireface as isf
        
        # Check for common classes/functions
        components = [
            'FaceDetector',
            'FaceRecognizer',
            'FaceAnalyzer'
        ]
        
        available = []
        missing = []
        
        for component in components:
            if hasattr(isf, component):
                available.append(component)
                print(f"✅ {component} available")
            else:
                missing.append(component)
                print(f"⚠️  {component} not found (may not be in this version)")
        
        if available:
            print(f"\n✅ Found {len(available)} InspireFace components")
            return True
        else:
            print("\n⚠️  No standard components found - InspireFace may have different API")
            print("   Check InspireFace documentation for correct usage")
            return False
            
    except Exception as e:
        print(f"❌ Error checking components: {e}")
        return False

def test_fallback_opencv():
    """Test OpenCV face detection as fallback."""
    print("\n" + "=" * 60)
    print("TEST 4: OpenCV Fallback (Haar Cascade)")
    print("=" * 60)
    
    try:
        import cv2
        import numpy as np
        
        # Try to load Haar Cascade
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)
        
        if face_cascade.empty():
            print("❌ Failed to load Haar Cascade")
            return False
        
        print("✅ OpenCV Haar Cascade loaded successfully")
        print("   This can be used as fallback for face detection")
        
        # Test with dummy image
        dummy_image = np.zeros((480, 640, 3), dtype=np.uint8)
        gray = cv2.cvtColor(dummy_image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        print("✅ OpenCV face detection working (fallback ready)")
        return True
        
    except Exception as e:
        print(f"❌ OpenCV fallback test failed: {e}")
        return False

def print_python_info():
    """Print Python environment information."""
    print("\n" + "=" * 60)
    print("PYTHON ENVIRONMENT INFO")
    print("=" * 60)
    print(f"Python Version: {sys.version}")
    print(f"Python Executable: {sys.executable}")
    print(f"\nPython Path:")
    for path in sys.path:
        print(f"  - {path}")

def main():
    """Run all tests."""
    print("\n🔍 InspireFace Installation Verification\n")
    
    results = {
        'Basic Import': test_basic_import(),
        'Dependencies': test_dependencies(),
    }
    
    # Only test components if import succeeded
    if results['Basic Import']:
        results['InspireFace Components'] = test_inspireface_components()
    
    results['OpenCV Fallback'] = test_fallback_opencv()
    
    print_python_info()
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n🎉 All tests passed! InspireFace is ready to use.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        print("\nNext steps:")
        print("1. Install missing dependencies")
        print("2. Verify InspireFace installation path")
        print("3. Check InspireFace documentation for API changes")
        return 1

if __name__ == "__main__":
    sys.exit(main())
