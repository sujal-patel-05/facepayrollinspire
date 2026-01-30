import numpy as np
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class EmbeddingManager:
    """
    Manage face embeddings storage and retrieval.
    """
    
    @staticmethod
    def embedding_to_bytes(embedding: np.ndarray) -> bytes:
        """
        Convert numpy embedding to bytes for SQLite BLOB storage.
        
        Args:
            embedding: Numpy array (512-D)
            
        Returns:
            Bytes representation
        """
        return embedding.tobytes()
    
    @staticmethod
    def bytes_to_embedding(embedding_bytes: bytes) -> np.ndarray:
        """
        Convert bytes from SQLite BLOB to numpy embedding.
        
        Args:
            embedding_bytes: Bytes from database
            
        Returns:
            Numpy array (512-D)
        """
        return np.frombuffer(embedding_bytes, dtype=np.float32)  # CRITICAL: Must match embedding_to_bytes dtype!
    
    @staticmethod
    def load_all_embeddings(db_session) -> Dict[int, np.ndarray]:
        """
        Load all employee embeddings from database.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            Dictionary of {employee_id: embedding}
        """
        from models import Employee
        
        embeddings = {}
        
        try:
            # Query all employees with face embeddings
            employees = db_session.query(Employee).filter(
                Employee.face_embedding.isnot(None)
            ).all()
            
            for employee in employees:
                embedding = EmbeddingManager.bytes_to_embedding(employee.face_embedding)
                embeddings[employee.id] = embedding
            
            logger.info(f"Loaded {len(embeddings)} face embeddings from database")
            return embeddings
        
        except Exception as e:
            logger.error(f"Failed to load embeddings: {str(e)}")
            return {}
    
    @staticmethod
    def save_embedding(db_session, employee_id: int, embedding: np.ndarray) -> bool:
        """
        Save face embedding to database.
        
        Args:
            db_session: SQLAlchemy database session
            employee_id: Employee ID
            embedding: Numpy array (512-D)
            
        Returns:
            True if successful, False otherwise
        """
        from models import Employee
        
        try:
            employee = db_session.query(Employee).filter(
                Employee.id == employee_id
            ).first()
            
            if not employee:
                logger.error(f"Employee {employee_id} not found")
                return False
            
            # Convert embedding to bytes
            embedding_bytes = EmbeddingManager.embedding_to_bytes(embedding)
            
            # Update employee record
            employee.face_embedding = embedding_bytes
            db_session.commit()
            
            logger.info(f"Saved face embedding for employee {employee_id}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to save embedding: {str(e)}")
            db_session.rollback()
            return False
    
    @staticmethod
    def get_embedding(db_session, employee_id: int) -> Optional[np.ndarray]:
        """
        Get face embedding for specific employee.
        
        Args:
            db_session: SQLAlchemy database session
            employee_id: Employee ID
            
        Returns:
            Numpy array (512-D) or None if not found
        """
        from models import Employee
        
        try:
            employee = db_session.query(Employee).filter(
                Employee.id == employee_id
            ).first()
            
            if not employee or not employee.face_embedding:
                return None
            
            return EmbeddingManager.bytes_to_embedding(employee.face_embedding)
        
        except Exception as e:
            logger.error(f"Failed to get embedding: {str(e)}")
            return None
