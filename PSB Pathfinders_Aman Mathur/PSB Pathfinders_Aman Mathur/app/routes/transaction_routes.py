from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.schemas.transaction_schema import TransactionCreate, Transaction as TransactionSchema
from app.services.wealth_twin_service import WealthTwinService
from app.routes.auth_routes import oauth2_scheme, SECRET_KEY, ALGORITHM
from jose import jwt

router = APIRouter(prefix='/transactions', tags=['Transactions'])

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            raise HTTPException(status_code=401, detail='Could not validate credentials')
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail='User not found')
        return user
    except:
        raise HTTPException(status_code=401, detail='Could not validate credentials')

from app.models.account_model import Account

@router.post('/', response_model=TransactionSchema)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify account belongs to user
    account = db.query(Account).filter(Account.id == transaction.account_id, Account.customer_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail='Account not found or access denied')
    
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get('/')
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Transaction).join(Account).filter(Account.customer_id == current_user.id).all()


@router.get('/analysis')
def analyze_spending(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return WealthTwinService.analyze_spending(db, current_user.id)
