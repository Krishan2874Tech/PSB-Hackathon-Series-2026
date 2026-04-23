from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('users.id'))
    account_type = Column(String(50))  # Savings, Current, etc.
    balance = Column(Float, default=0.0)
    branch_code = Column(String(20))
    account_status = Column(String(20), default='active')
    last_updated = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())
