from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class ActionLog(Base):
    __tablename__ = 'action_logs'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    action_type = Column(String(100))
    risk_score = Column(Float)
    decision = Column(String(50))  # Allow, Warning, Block
    status = Column(String(50), default='Completed') # Completed, Pending, Cancelled
    timestamp = Column(DateTime, default=datetime.utcnow)
