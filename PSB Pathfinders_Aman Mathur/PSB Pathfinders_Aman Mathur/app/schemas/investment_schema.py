from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InvestmentBase(BaseModel):
    customer_id: int
    type: str
    instrument_name: str
    units: float
    current_price: float
    purchase_price: float

class InvestmentCreate(InvestmentBase):
    pass

class Investment(InvestmentBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
