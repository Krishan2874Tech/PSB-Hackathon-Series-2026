from sqlalchemy.orm import Session
from app.models.transaction_model import Transaction
from app.models.user_model import User

from app.models.account_model import Account

class WealthTwinService:
    @staticmethod
    def analyze_spending(db: Session, user_id: int):
        transactions = db.query(Transaction).join(Account).filter(Account.customer_id == user_id).all()
        total_income = sum(t.amount for t in transactions if t.type.lower() in ['income', 'credit'])
        total_expense = sum(t.amount for t in transactions if t.type.lower() in ['expense', 'debit'])
        
        # Category breakdown
        categories = {}
        for t in transactions:
            if t.type.lower() in ['expense', 'debit']:
                cat = t.category or 'Uncategorized'
                categories[cat] = categories.get(cat, 0) + t.amount

        savings_rate = 0.0
        if total_income > 0:
            savings_rate = ((total_income - total_expense) / total_income) * 100

        budget_tips = []
        if savings_rate < 20:
            budget_tips.append("Your savings rate is low. Try to follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.")
        
        # Check for specific overspending
        for cat, amount in categories.items():
            if total_income > 0 and amount > (0.4 * total_income):
                budget_tips.append(f"You're spending a large portion ({round(amount/total_income*100)}%) of your income on {cat}. Consider reducing it.")

        if not budget_tips:
            budget_tips.append("Your financial habits look great! Consider increasing your SIP for better long-term returns.")

        overspending_alert = total_expense > (0.8 * total_income) if total_income > 0 else False

        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'savings_rate': round(savings_rate, 2),
            'overspending_alert': overspending_alert,
            'category_breakdown': categories,
            'budget_tips': budget_tips,
            'recommended_savings': round(0.2 * total_income, 2) if total_income > 0 else 0
        }

    @staticmethod
    def predict_future_wealth(monthly_investment: float, growth_rate: float, years: int):
        total_wealth = 0
        monthly_rate = growth_rate / 12 / 100
        months = years * 12
        for _ in range(months):
            total_wealth = (total_wealth + monthly_investment) * (1 + monthly_rate)
        return round(total_wealth, 2)

    @staticmethod
    def predict_5_year_wealth(db: Session, user: User):
        # Calculate monthly savings from transactions
        spending_analysis = WealthTwinService.analyze_spending(db, user.id)
        
        # If the user has no transactions yet, use their profile income and assume a 20% savings rate
        monthly_income = user.income / 12 if user.income > 0 else 0
        if spending_analysis['total_income'] > 0:
             # Average monthly income from transactions if available
             monthly_income = spending_analysis['total_income'] / 1 # Simplified for now, assuming analysis is over 1 month

        monthly_savings = spending_analysis['total_income'] - spending_analysis['total_expense']
        if monthly_savings <= 0:
            # Assume 20% of their profile income if no savings are detected
            monthly_savings = monthly_income * 0.2

        # Growth rate based on risk profile
        growth_rates = {'low': 4, 'medium': 7, 'high': 10}
        growth_rate = growth_rates.get(user.risk_profile.lower(), 7)

        # 5-year prediction
        predicted_wealth = WealthTwinService.predict_future_wealth(monthly_savings, growth_rate, 5)
        
        return {
            'current_monthly_savings': round(monthly_savings, 2),
            'assumed_annual_growth_rate': growth_rate,
            'predicted_wealth_5_years': predicted_wealth,
            'risk_profile': user.risk_profile
        }
