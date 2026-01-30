import base64
import io
import numpy as np
from PIL import Image
import cv2

def base64_to_image(base64_string: str) -> np.ndarray:
    """
    Convert base64 encoded string to OpenCV image (numpy array).
    
    Args:
        base64_string: Base64 encoded image string
        
    Returns:
        OpenCV image as numpy array (BGR format)
    """
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        image_bgr = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        return image_bgr
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")

def validate_image(image: np.ndarray) -> bool:
    """
    Validate image dimensions and format.
    
    Args:
        image: OpenCV image as numpy array
        
    Returns:
        True if valid, False otherwise
    """
    if image is None or image.size == 0:
        return False
    
    height, width = image.shape[:2]
    
    # Check minimum dimensions
    if height < 100 or width < 100:
        return False
    
    # Check maximum dimensions (10MB equivalent)
    if height > 4000 or width > 4000:
        return False
    
    return True

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for face recognition.
    
    Args:
        image: OpenCV image as numpy array
        
    Returns:
        Preprocessed image
    """
    # Resize if too large
    height, width = image.shape[:2]
    max_dimension = 1024
    
    if height > max_dimension or width > max_dimension:
        scale = max_dimension / max(height, width)
        new_width = int(width * scale)
        new_height = int(height * scale)
        image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    return image

def compress_image(image: np.ndarray, quality: int = 85) -> bytes:
    """
    Compress image to JPEG bytes.
    
    Args:
        image: OpenCV image as numpy array
        quality: JPEG quality (0-100)
        
    Returns:
        Compressed image as bytes
    """
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, buffer = cv2.imencode('.jpg', image, encode_param)
    return buffer.tobytes()
