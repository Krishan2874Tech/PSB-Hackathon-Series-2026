from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    timestamp = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float)
    type = Column(String(50))  # Credit, Debit, etc.
    category = Column(String(100), nullable=True)  # Food, Rent, etc.


