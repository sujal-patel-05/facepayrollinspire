import numpy as np
import cv2
from typing import Optional, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InspireFaceEngine:
    """
    InspireFace integration for face detection and recognition.
    Uses the session-based API with Megatron model.
    """
    
    def __init__(self, model_name: str = "Megatron", detection_threshold: float = 0.6):
        """
        Initialize InspireFace engine.
        
        Args:
            model_name: Model to use ("Pikachu" or "Megatron")
            detection_threshold: Confidence threshold for face detection
        """
        self.model_name = model_name
        self.detection_threshold = detection_threshold
        self.session = None
        self.use_fallback = False
        
        try:
            import inspireface as isf
            self.isf = isf
            
            # Load the model
            ret = isf.reload(model_name)
            if not ret:
                logger.warning(f"Failed to load {model_name} model, trying fallback...")
                self.use_fallback = True
                self._init_fallback()
            else:
                # Create session with face recognition enabled
                opt = isf.HF_ENABLE_FACE_RECOGNITION
                self.session = isf.InspireFaceSession(opt, isf.HF_DETECT_MODE_ALWAYS_DETECT)
                logger.info(f"InspireFace initialized successfully with {model_name} model")
                
        except Exception as e:
            logger.warning(f"InspireFace initialization failed: {e}")
            logger.info("Using OpenCV Haar Cascade fallback")
            self.use_fallback = True
            self._init_fallback()
    
    def _init_fallback(self):
        """Initialize OpenCV Haar Cascade for fallback face detection."""
        try:
            # Load Haar Cascade for face detection
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
            
            if self.face_cascade.empty():
                logger.error("Failed to load Haar Cascade classifier")
                self.face_cascade = None
            else:
                logger.info("Haar Cascade fallback initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize fallback: {e}")
            self.face_cascade = None
    
    def detect_faces(self, image: np.ndarray) -> list:
        """
        Detect faces in an image.
        
        Args:
            image: Input image as numpy array (BGR format)
            
        Returns:
            List of detected faces
        """
        if self.use_fallback:
            return self._detect_faces_fallback(image)
        
        try:
            faces = self.session.face_detection(image)
            return faces if faces else []
        except Exception as e:
            logger.error(f"Face detection failed: {e}")
            return []
    
    def _detect_faces_fallback(self, image: np.ndarray) -> list:
        """Fallback face detection using OpenCV."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        # Convert to list of dicts for consistency
        return [{'x': x, 'y': y, 'w': w, 'h': h} for (x, y, w, h) in faces]
    
    def extract_embedding(self, image: np.ndarray, face=None) -> Optional[np.ndarray]:
        """
        Extract face embedding from an image.
        
        Args:
            image: Input image as numpy array
            face: Detected face object (optional, will detect if not provided)
            
        Returns:
            512-D embedding vector as numpy array, or None if failed
        """
        if self.use_fallback:
            return self._extract_embedding_fallback(image)
        
        try:
            # Detect face if not provided
            if face is None:
                faces = self.detect_faces(image)
                if not faces:
                    logger.warning("No face detected in image")
                    return None
                face = faces[0]  # Use first detected face
            
            # Extract feature
            feature = self.session.face_feature_extract(image, face)
            
            # Convert to numpy array if needed
            if hasattr(feature, 'data'):
                embedding = np.array(feature.data, dtype=np.float32)
            else:
                embedding = np.array(feature, dtype=np.float32)
            
            # Normalize
            norm = np.linalg.norm(embedding)
            if norm > 0:
                embedding = embedding / norm
            
            return embedding
            
        except Exception as e:
            logger.error(f"Embedding extraction failed: {e}")
            return None
    
    def _extract_embedding_fallback(self, image: np.ndarray) -> Optional[np.ndarray]:
        """
        Fallback embedding extraction using simple features.
        ALWAYS returns exactly 512-D embedding to match InspireFace.
        """
        faces = self._detect_faces_fallback(image)
        if not faces:
            logger.warning("No face detected in fallback mode")
            return None
        
        # Get first face
        face = faces[0]
        x, y, w, h = face['x'], face['y'], face['w'], face['h']
        
        # Ensure valid coordinates
        h_img, w_img = image.shape[:2]
        x = max(0, min(x, w_img - 1))
        y = max(0, min(y, h_img - 1))
        w = min(w, w_img - x)
        h = min(h, h_img - y)
        
        # Extract face region
        face_img = image[y:y+h, x:x+w]
        
        if face_img.size == 0:
            logger.error("Empty face region extracted")
            return None
        
        # Resize to standard size
        face_img = cv2.resize(face_img, (64, 64))
        
        # Convert to grayscale
        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        
        # Flatten the 64x64 image = 4096 values
        # We'll take every 8th value to get 512 dimensions
        flattened = gray.flatten()  # 4096 values
        
        # Sample every 8th value to get exactly 512 dimensions
        embedding = flattened[::8].astype(np.float32)  # 512 values
        
        # Normalize to 0-1 range
        embedding = embedding / 255.0
        
        # L2 normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        logger.warning(f"Using fallback embedding extraction (shape: {embedding.shape})")
        
        return embedding.astype(np.float32)
    
    def compare_faces(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Compare two face embeddings using cosine similarity.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Similarity score (0-1, higher is more similar)
        """
        # Cosine similarity
        similarity = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )
        
        # Convert to 0-1 range
        similarity = (similarity + 1) / 2
        
        return float(similarity)
    
    def recognize_face(self, image: np.ndarray, known_embeddings: dict, 
                      threshold: float = 0.6) -> Tuple[Optional[int], float]:
        """
        Recognize a face by comparing against known embeddings.
        
        Args:
            image: Input image
            known_embeddings: Dict of {employee_id: embedding}
            threshold: Similarity threshold for recognition
            
        Returns:
            Tuple of (employee_id, confidence) or (None, 0.0) if no match
        """
        # Extract embedding from input image
        query_embedding = self.extract_embedding(image)
        if query_embedding is None:
            return None, 0.0
        
        # Compare with all known embeddings
        best_match_id = None
        best_similarity = 0.0
        
        for emp_id, known_embedding in known_embeddings.items():
            similarity = self.compare_faces(query_embedding, known_embedding)
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match_id = emp_id
        
        # Check if best match exceeds threshold
        if best_similarity >= threshold:
            return best_match_id, best_similarity
        else:
            return None, best_similarity
