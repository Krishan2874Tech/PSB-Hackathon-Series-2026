from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.transaction_model import Transaction
from app.models.action_log_model import ActionLog

from app.models.account_model import Account

class RiskEngine:
    @staticmethod
    def calculate_risk_score(db: Session, user_id: int, action_type: str, amount: float, is_new_device: bool, is_first_investment: bool):
        score = 0
        
        # 1. New Device Signal
        if is_new_device:
            score += 25
        
        # 2. Transaction Amount Deviation
        avg_txn_amount = 0
        txn_history = db.query(Transaction).join(Account).filter(Account.customer_id == user_id).all()
        if txn_history:
            avg_txn_amount = sum(t.amount for t in txn_history) / len(txn_history)
        
        if amount > 3 * avg_txn_amount and avg_txn_amount > 0:
            score += 40
        elif amount > 2 * avg_txn_amount and avg_txn_amount > 0:
            score += 20
        
        # 3. First-time Investment
        if is_first_investment:
            score += 15
        
        # 4. Velocity Check (Multiple transactions in last 5 minutes)
        five_mins_ago = datetime.utcnow() - timedelta(minutes=5)
        recent_actions_count = db.query(ActionLog).filter(
            ActionLog.user_id == user_id, 
            ActionLog.timestamp >= five_mins_ago
        ).count()
        
        if recent_actions_count >= 3:
            score += 50 # High risk for rapid actions
        elif recent_actions_count >= 1:
            score += 10
        
        # 5. Suspicious Pattern Detection (e.g., Round number large transactions)
        if amount > 50000 and amount % 10000 == 0:
            score += 10
        
        decision = 'Allow'
        if score > 70:
            decision = 'Block'
        elif score > 35:
            decision = 'Warning'
        
        return score, decision
