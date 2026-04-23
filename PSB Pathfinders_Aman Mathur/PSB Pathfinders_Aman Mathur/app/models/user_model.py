from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    mobile = Column(String(15), unique=True, index=True)
    dob = Column(String(20))
    pan_number = Column(String(10), unique=True, index=True)
    income = Column(Float, default=0.0)
    risk_profile = Column(String(50), default='medium')  # low, medium, high
    is_trusted_device = Column(Boolean, default=True)
    last_device_id = Column(String(255), nullable=True)
    otp = Column(String(10), nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    otp_fail_count = Column(Integer, default=0)
    otp_request_count = Column(Integer, default=0)
    last_otp_request_time = Column(DateTime, nullable=True)
    blocked_until = Column(DateTime, nullable=True)
    