from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user_model import User
from app.routes.transaction_routes import get_current_user
from app.services.recommendation_engine import RecommendationEngine
from app.services.wealth_twin_service import WealthTwinService

router = APIRouter(prefix='/wealth', tags=['Wealth Intelligence'])

@router.get('/investment-recommendations')
def get_recommendations(current_user: User = Depends(get_current_user)):
    return {'recommendations': RecommendationEngine.get_recommendations(current_user.risk_profile)}

@router.get('/future-prediction')
def predict_future_wealth(monthly_investment: float, growth_rate: float, years: int):
    prediction = WealthTwinService.predict_future_wealth(monthly_investment, growth_rate, years)
    return {'future_wealth': prediction}

@router.get('/predict-5-years')
def predict_5_years(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # This endpoint uses the user's data to predict wealth in 5 years
    prediction_data = WealthTwinService.predict_5_year_wealth(db, current_user)
    return prediction_data
