from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base

from sqlalchemy.sql import func

class Investment(Base):
    __tablename__ = 'investments'

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('users.id'))
    type = Column(String(100))  # FD, Bond, Mutual Fund, Stock
    instrument_name = Column(String(255))
    units = Column(Float)
    current_price = Column(Float)
    purchase_price = Column(Float)
    date = Column(DateTime, default=func.now())

