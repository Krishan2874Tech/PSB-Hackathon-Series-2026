from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    mobile: str
    dob: str
    pan_number: str
    income: float
    risk_profile: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_trusted_device: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class OTPRequest(BaseModel):
    email: EmailStr
    password: str
    device_id: Optional[str] = None

class OTPLogin(BaseModel):
    email: EmailStr
    otp: str




