// SecureWealth Twin - Utility Functions

/**
 * AI-powered Risk Assessment Module
 */
const RiskAssessment = {
    factors: {
        geolocation: 0.35,
        velocity: 0.30,
        behavior: 0.20,
        device: 0.15
    },
    
    calculateRiskScore: (transactions, userBehavior, deviceInfo) => {
        let riskScore = 0;
        
        // Geolocation risk
        if (deviceInfo.location !== userBehavior.profileLocation) {
            riskScore += 0.35;
        }
        
        // Velocity checks
        const recentTransactions = transactions.filter(t => {
            const date = new Date(t.timestamp);
            const now = new Date();
            return (now - date) / (1000 * 60 * 60) < 24; // Last 24 hours
        });
        
        if (recentTransactions.length > 3) {
            riskScore += 0.30;
        }
        
        // Behavior analysis
        const deviation = calculateBehaviorDeviation(userBehavior);
        if (deviation > 15) {
            riskScore += 0.20;
        }
        
        // Device trust score
        if (!deviceInfo.isTrusted || !deviceInfo.biometricsVerified) {
            riskScore += 0.15;
        }
        
        return Math.min(Math.round(riskScore * 100), 100);
    }
};

/**
 * AI Wealth Insights Generator
 */
const WealthInsights = {
    generateInsight: (portfolioData, userGoals) => {
        const insights = [];
        
        // Portfolio Rebalancing
        if (portfolioData.equity > 0.70 && portfolioData.recommendedEquity < 0.65) {
            insights.push({
                type: 'rebalancing',
                title: 'Portfolio Rebalancing Opportunity',
                description: 'Your equity allocation is higher than optimal for your risk profile.',
                priority: 'Medium',
                impact: 'Reduce volatility by 12%'
            });
        }
        
        // Goal Progress
        if (portfolioData.goalProgress < 80) {
            insights.push({
                type: 'goal',
                title: 'Goal Adjustment Recommended',
                description: 'You are currently at ' + portfolioData.goalProgress + '% of your target.',
                priority: 'High',
                impact: 'Increase contributions by 8% to stay on track'
            });
        }
        
        // Tax Efficiency
        if (portfolioData.taxEfficiency < 0.85) {
            insights.push({
                type: 'tax',
                title: 'Tax Optimization Opportunity',
                description: ' ваш portfolio has ' + (1 - portfolioData.taxEfficiency) + ' tax inefficiency.',
                priority: 'Low',
                impact: 'Potential savings of ' + Math.round(portfolioData.values.total * 0.02) + '/year'
            });
        }
        
        return insights;
    }
};

/**
 * Fraud Protection Module
 */
const FraudProtection = {
    analyzeTransaction: (transaction, userProfile, deviceInfo) => {
        const riskFactors = {
            geolocation: 0,
            velocity: 0,
            behavior: 0,
            device: 0
        };
        
        // Geolocation Analysis
        if (transaction.location !== userProfile.location) {
            riskFactors.geolocation = 0.85;
        }
        
        // Velocity Analysis
        const recentTransactions = transaction.userTransactions.filter(t => {
            const date = new Date(t.timestamp);
            const now = new Date();
            return (now - date) / (1000 * 60 * 60) < 1;
        });
        
        if (recentTransactions.length > 2) {
            riskFactors.velocity = 0.75;
        }
        
        // Behavior Analysis
        const deviation = calculateBehaviorDeviation(userProfile);
        if (deviation > 12) {
            riskFactors.behavior = 0.65;
        }
        
        // Device Analysis
        if (!deviceInfo.isTrusted) {
            riskFactors.device = 0.9;
        }
        
        // Calculate overall risk score
        const riskScore = Object.values(riskFactors).reduce((a, b) => a + b, 0) / 4;
        
        return {
            riskScore: Math.round(riskScore * 100),
            riskLevel: getRiskLevel(riskScore * 100),
            riskFactors: riskFactors,
            recommendedAction: getRecommendedAction(riskScore)
        };
    }
};

/**
 * Utility Functions
 */
function calculateBehaviorDeviation(userProfile) {
    // Simulate behavior analysis
    return Math.random() * 20;
}

function getRiskLevel(score) {
    if (score >= 75) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
}

function getRecommendedAction(riskScore) {
    if (riskScore >= 0.75) return 'MANDATORY_MFA';
    if (riskScore >= 0.4) return 'STEP_UP_AUTH';
    return 'AUTOMATIC_APPROVAL';
}

/**
 * AI Wealth Chat Response Generator
 */
const AIChat = {
    responses: {
        portfolio: "Based on your portfolio analysis, I recommend maintaining your current allocation while considering a 5% shift toward technology sectors for potential growth.",
        fraud: "Your account security is protected by multiple layers including two-factor authentication and real-time anomaly detection. No suspicious activity has been detected recently.",
        goals: "Your financial goals are on track with a 72% completion rate. To maintain this momentum, consider increasing your monthly contributions by 8%.",
        investing: "I can help you explore investment opportunities that align with your risk tolerance and time horizon. Would you like me to analyze current market trends?"
    },
    
    generateResponse: (userQuery) => {
        const query = userQuery.toLowerCase();
        
        if (query.includes('portfolio') || query.includes('allocation')) {
            return this.responses.portfolio;
        } else if (query.includes('fraud') || query.includes('security') || query.includes('protect')) {
            return this.responses.fraud;
        } else if (query.includes('goal') || query.includes('target') || query.includes('retirement')) {
            return this.responses.goals;
        } else if (query.includes('invest') || query.includes('stock') || query.includes('market')) {
            return this.responses.investing;
        } else {
            return "I can help you with portfolio analysis, financial planning, fraud protection, or market insights. Could you specify what you'd like to know about your wealth management?";
        }
    }
};

/**
 * Mobile Navigation Handler
 */
const MobileNav = {
    init: () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        
        if (menuBtn && menu) {
            menuBtn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !menuBtn.contains(e.target) && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });
        }
    }
};

// Initialize app components
document.addEventListener('DOMContentLoaded', () => {
    MobileNav.init();
    
    // Add click handlers for risk assessment buttons
    const riskButtons = document.querySelectorAll('.risk-action-btn');
    riskButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleRiskAction(this.dataset.action);
        });
    });
});

// Risk Action Handler
function handleRiskAction(action) {
    const message = action === 'verify' 
        ? 'Step-up authentication initiated. Please check your mobile device.'
        : action === 'cancel'
        ? 'Transaction cancelled. Security notification sent.'
        : 'Requesting human security review. You will be contacted shortly.';
    
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 right-6 bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 max-w-xs z-50';
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i data-lucide="info" class="h-5 w-5 text-blue-500"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-gray-900 font-medium">Action Completed</p>
                <p class="text-sm text-gray-500 mt-1">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RiskAssessment,
        WealthInsights,
        FraudProtection,
        AIChat,
        calculateBehaviorDeviation,
        getRiskLevel,
        getRecommendedAction
    };
}