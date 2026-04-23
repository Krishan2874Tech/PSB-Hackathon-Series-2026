class RecommendationEngine:
    @staticmethod
    def get_recommendations(risk_profile: str):
        recommendations = {
            'low': ['Fixed Deposit', 'Government Bonds', 'Corporate Bonds'],
            'medium': ['Balanced Mutual Funds', 'Index Funds', 'Dividend Stocks'],
            'high': ['Equity Mutual Funds', 'Growth Stocks', 'Cryptocurrencies']
        }
        return recommendations.get(risk_profile.lower(), ['Fixed Deposit'])
