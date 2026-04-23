from app.utils.otp_service import OTPService
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, User as UserSchema, Token, OTPRequest, OTPLogin

router = APIRouter(prefix='/auth', tags=['Authentication'])

SECRET_KEY = 'YOUR_SECRET_KEY'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))        
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post('/register', response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        mobile=user.mobile,
        dob=user.dob,
        pan_number=user.pan_number,
        income=user.income,
        risk_profile=user.risk_profile
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send Welcome Email
    OTPService.send_welcome_email(user.email, user.full_name, user.password)

    return new_user

@router.post('/request-otp')
def request_otp(request: OTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    # 1. Block Check
    if user.blocked_until and datetime.utcnow() < user.blocked_until:
        remaining_time = int((user.blocked_until - datetime.utcnow()).total_seconds())
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f'User is blocked. Try again in {remaining_time} seconds'
        )

    # 2. OTP Misuse Detection (Rate Limiting)
    now = datetime.utcnow()
    if user.last_otp_request_time:
        if (now - user.last_otp_request_time).total_seconds() < 300: # Within 5 minutes
            user.otp_request_count += 1
        else:
            user.otp_request_count = 1
    else:
        user.otp_request_count = 1
    
    user.last_otp_request_time = now

    if user.otp_request_count > 3:
        user.blocked_until = now + timedelta(minutes=15)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail='Too many OTP requests. Account blocked for 15 minutes'
        )

    # 3. Device Check
    if request.device_id:
        if user.last_device_id and user.last_device_id != request.device_id:
            user.is_trusted_device = False
            # You could add notification logic here
            print(f"[SECURITY ALERT] Unrecognized device detected for {user.email}")
        user.last_device_id = request.device_id

    # 4. Verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect password')        

    # 5. Generate OTP
    otp = OTPService.generate_otp()
    user.otp = otp
    user.otp_expiry = now + timedelta(minutes=10) # 10 mins expiry

    db.commit()

    # Print OTP to CMD/Console
    print(f'\n[OTP SERVICE] Generated OTP for {user.email}: {otp}\n')

    # Send OTP Email
    OTPService.send_otp_email(user.email, otp)

    return {'message': 'OTP sent successfully'}

@router.post('/login', response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')

    # Check if user is blocked (MOVE TO TOP OF LOGIC)
    if user.blocked_until and datetime.utcnow() < user.blocked_until:
        remaining_time = int((user.blocked_until - datetime.utcnow()).total_seconds())
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f'User is blocked. Try again in {remaining_time} seconds'
        )

    # Verify OTP
    if not user.otp or user.otp != form_data.password or not user.otp_expiry or datetime.utcnow() > user.otp_expiry:     
        # OTP invalid or expired
        user.otp_fail_count += 1
        if user.otp_fail_count >= 3:
            user.blocked_until = datetime.utcnow() + timedelta(minutes=2)
            user.otp_fail_count = 0
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='Too many failed attempts. User blocked for 2 minutes'
            )
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid or expired OTP')    

    # OTP is correct, reset fail count and blocked_until
    user.otp_fail_count = 0
    user.blocked_until = None
    user.otp = None
    db.commit()

    access_token = create_access_token(data={'sub': user.email})
    return {'access_token': access_token, 'token_type': 'bearer'}

