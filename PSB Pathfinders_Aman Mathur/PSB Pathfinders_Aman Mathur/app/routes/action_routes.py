from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user_model import User
from app.models.action_log_model import ActionLog
from app.routes.transaction_routes import get_current_user
from app.services.risk_engine import RiskEngine
from pydantic import BaseModel

router = APIRouter(prefix='/actions', tags=['Protected Wealth Actions'])

class WealthAction(BaseModel):
    amount: float
    action_name: str
    is_first_investment: bool = False

@router.post('/execute')
def execute_action(action: WealthAction, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check for new device signal
    is_new_device = not current_user.is_trusted_device
    
    score, decision = RiskEngine.calculate_risk_score(
        db, current_user.id, action.action_name, action.amount, 
        is_new_device, action.is_first_investment
    )
    
    # Introduce Cooling Period for high risk (Warning decision)
    status_msg = "Completed"
    if decision == 'Warning':
        status_msg = "Pending"
    
    # Log action
    new_log = ActionLog(
        user_id=current_user.id, 
        action_type=action.action_name, 
        risk_score=score, 
        decision=decision,
        status=status_msg
    )
    db.add(new_log)
    db.commit()
    
    if decision == 'Block':
        raise HTTPException(status_code=403, detail={'risk_score': score, 'decision': 'Action Blocked due to high risk score'})
    
    if decision == 'Warning':
        return {
            'status': 'pending', 
            'decision': decision, 
            'risk_score': score, 
            'message': 'Action is under a 24-hour cooling period for verification due to high risk patterns.'
        }
    
    return {'status': 'success', 'decision': decision, 'risk_score': score, 'message': 'Action processed'}

