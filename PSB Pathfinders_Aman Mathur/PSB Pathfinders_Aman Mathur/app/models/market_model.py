from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class MarketData(Base):
    __tablename__ = 'market_data'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, index=True)
    company_name = Column(String(255))
    sector = Column(String(100))
    current_price = Column(Float)
    day_high = Column(Float)
    day_low = Column(Float)
