from pydantic import BaseModel
from typing import Optional

class ITRBase(BaseModel):
    customer_id: int
    financial_year: str
    declared_income: float
    tax_paid: float
    deductions: float
    refund_amount: float

class ITRCreate(ITRBase):
    pass

class ITR(ITRBase):
    id: int

    class Config:
        from_attributes = True
