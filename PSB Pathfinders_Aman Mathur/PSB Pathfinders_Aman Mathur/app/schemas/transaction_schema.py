from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    account_id: int
    amount: float
    type: str  # Credit, Debit, etc.
    category: Optional[str] = None # Food, Rent, etc.

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
