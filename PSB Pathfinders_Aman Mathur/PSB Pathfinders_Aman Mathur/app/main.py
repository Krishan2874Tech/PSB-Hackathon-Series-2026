from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user_model, transaction_model, investment_model, action_log_model, account_model, itr_model, market_model
from app.routes import auth_routes, transaction_routes, wealth_routes, action_routes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='PSB Pathfinders_backend',
    description='Intelligent Wealth Growth with Fraud Protection',
    version='1.0.0'
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Include routes
app.include_router(auth_routes.router)
app.include_router(transaction_routes.router)
app.include_router(wealth_routes.router)
app.include_router(action_routes.router)

@app.get('/')
def root():
    return {'message': 'Welcome to PSB Pathfinders API'}
