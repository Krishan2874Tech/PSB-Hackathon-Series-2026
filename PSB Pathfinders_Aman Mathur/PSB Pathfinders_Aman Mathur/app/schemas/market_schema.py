from pydantic import BaseModel
from typing import Optional

class MarketDataBase(BaseModel):
    symbol: str
    company_name: str
    sector: str
    current_price: float
    day_high: float
    day_low: float

class MarketDataCreate(MarketDataBase):
    pass

class MarketData(MarketDataBase):
    id: int

    class Config:
        from_attributes = True
