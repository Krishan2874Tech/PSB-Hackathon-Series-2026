from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AccountBase(BaseModel):
    customer_id: int
    account_type: str
    balance: float
    branch_code: str
    account_status: str

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True
