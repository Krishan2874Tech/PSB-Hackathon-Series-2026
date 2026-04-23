// SecureWealth Twin - AI Wealth Advisor & Fraud Protection

(function() {
    'use strict';
    
    // UI State Management
    const AppState = {
        user: {
            name: "John Doe",
            securityScore: 94,
            portfolioValue: "$247,853.42",
            location: "Mumbai, India",
            devices: ["iPhone 14 Pro", "MacBook Pro"],
            factors: {
                twoFactor: true,
                biometric: true,
                geolocation: true,
                velocityChecks: true
            }
        },
        
        currentRiskLevel: "LOW",
        activeFraudScenarios: 1,
        
        // Risk Assessment Factors
        riskFactors: {
            geolocation: {
                current: "Mumbai, IN",
                profile: "New York, US",
                match: false,
                weight: 0.35
            },
            velocity: {
                largeTransfers: 3,
                threshold: 3,
                weight: 0.30
            },
            behavior: {
                pattern: "Consistent with user history",
                deviation: 12,
                weight: 0.20
            },
            device: {
                device: "Trusted",
                biometrics: "Verified",
                weight: 0.15
            }
        },
        
        // AI Wealth Insights
        insights: [
            {
                id: 1,
                type: "portfolio",
                title: "Asset Rebalancing Opportunity",
                description: "Your equity allocation is currently 72% vs recommended 65%. Consider reducing large-cap exposure and adding bonds.",
                priority: "Medium",
                risk: "Low",
                suggestedAction: "Auto-Rebalance",
                impact: "+0.7% projected returns"
            },
            {
                id: 2,
                type: "education",
                title: "Financial Literacy Tip",
                description: "Understanding compound interest: $500/month invested at 7% return will grow to ~$340,000 in 15 years.",
                priority: "N/A",
                risk: "N/A",
                suggestedAction: "Read Article"
            },
            {
                id: 3,
                type: "scheduled",
                title: "Quarterly Review Scheduled",
                description: "Your next AI portfolio review is scheduled for June 15. Review your current goals and make adjustments if needed.",
                priority: "High",
                risk: "Low",
                suggestedAction: "Schedule Review",
                date: "June 15"
            }
        ]
    };
    
    // DOM Elements
    const elements = {
        mobileMenu: document.getElementById('mobile-menu'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        textarea: document.querySelector('textarea'),
        riskScoreCircle: document.querySelector('.risk-indicator'),
        aiChat: document.querySelectorAll('.ai-response'),
        fraudAlert: document.querySelector('.bg-gradient-to-r.from-red-50.to-orange-50')
    };
    
    // Initialize the App
    function init() {
        // Initialize Lucide Icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Setup Event Listeners
        setupEventListeners();
        
        // Initialize Animations
        initializeAnimations();
        
        // Setup Risk Scoring Dashboard
        setupRiskDashboard();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Mobile Menu Toggle
        if (elements.mobileMenu && elements.mobileMenuBtn) {
            elements.mobileMenuBtn.addEventListener('click', () => {
                elements.mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Auto-expand textarea
        if (elements.textarea) {
            elements.textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
            
            // Handle Enter key for chat
            elements.textarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        // Add click handlers to fraud action buttons
        const actionButtons = document.querySelectorAll('.risk-action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleRiskAction(this.dataset.action);
            });
        });
        
        // AI Chat send buttons
        const sendButtons = document.querySelectorAll('.send-ai-btn');
        sendButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.closest('.relative').querySelector('textarea');
                if (input && input.value.trim()) {
                    sendMessage(input.value);
                    input.value = '';
                    input.style.height = 'auto';
                }
            });
        });
    }
    
    // Initialize Animations
    function initializeAnimations() {
        // Add floating effect to security elements
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach(el => {
            el.style.animation = 'float ' + (5 + Math.random() * 3) + 's ease-in-out infinite';
        });
        
        // Risk scoring animations
        const riskIndicators = document.querySelectorAll('.risk-indicator');
        riskIndicators.forEach(indicator => {
            if (indicator.dataset.level === 'high') {
                indicator.classList.add('animate-pulse-red');
            }
        });
    }
    
    // Setup Risk Dashboard
    function setupRiskDashboard() {
        const riskFactors = AppState.riskFactors;
        
        // Calculate risk score
        let riskScore = 0;
        
        // Geolocation factor
        if (!riskFactors.geolocation.match) {
            riskScore += riskFactors.geolocation.weight * 100;
        }
        
        // Velocity checks
        if (riskFactors.velocity.largeTransfers >= riskFactors.velocity.threshold) {
            riskScore += riskFactors.velocity.weight * 100;
        }
        
        // Behavior analysis
        if (riskFactors.velocity.deviation > 10) {
            riskScore += riskFactors.behavior.weight * (riskFactors.velocity.deviation / 100);
        }
        
        // Device security
        if (riskFactors.device.device === 'Trusted' && riskFactors.device.biometrics === 'Verified') {
            riskScore -= riskFactors.device.weight * 30; // Positive factor
        }
        
        // Calculate final risk (capped at 100)
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        
        // Update risk UI
        updateRiskUI(riskScore);
    }
    
    // Update Risk UI
    function updateRiskUI(score) {
        const riskLevel = score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
        AppState.currentRiskLevel = riskLevel;
        
        // Update risk circle
        const riskCircle = document.querySelector('.risk-circle');
        if (riskCircle) {
            const circle = riskCircle.querySelector('svg circle');
            if (circle) {
                // Update stroke color based on risk
                if (riskLevel === 'HIGH') {
                    circle.style.stroke = '#ef4444';
                    circle.style.setProperty('--tw-ring-color', '#ef4444');
                } else if (riskLevel === 'MEDIUM') {
                    circle.style.stroke = '#f59e0b';
                    circle.style.setProperty('--tw-ring-color', '#f59e0b');
                } else {
                    circle.style.stroke = '#10b981';
                    circle.style.setProperty('--tw-ring-color', '#10b981');
                }
            }
        }
        
        // Update risk status
        const riskStatus = document.querySelector('.risk-status-value');
        if (riskStatus) {
            riskStatus.textContent = score.toFixed(0);
            
            // Update color based on risk level
            if (riskLevel === 'HIGH') {
                riskStatus.classList.replace('text-green-600', 'text-red-600');
                riskLevelText = document.querySelector('.risk-level-text');
                if (riskLevelText) riskLevelText.textContent = riskLevel;
            }
        }
        
        // Update risk explanation
        const riskExplanation = document.querySelector('.risk-explanation');
        if (riskExplanation) {
            switch(riskLevel) {
                case 'HIGH':
                    riskExplanation.textContent = 'Multiple risk factors detected. Step-up authentication required.';
                    riskExplanation.classList.replace('text-green-600', 'text-red-600');
                    break;
                case 'MEDIUM':
                    riskExplanation.textContent = 'Some risk factors present. Additional verification recommended.';
                    riskExplanation.classList.replace('text-green-600', 'text-orange-600');
                    break;
                default:
                    riskExplanation.textContent = 'All security checks passed. Account protected.';
                    riskExplanation.classList.replace('text-red-600', 'text-green-600');
            }
        }
    }
    
    // Handle Risk Actions
    function handleRiskAction(action) {
        const fraudAlert = elements.fraudAlert;
        if (!fraudAlert) return;
        
        let message = '';
        switch (action) {
            case 'cancel':
                message = 'Transaction cancelled. Security notification sent.';
                fraudAlert.classList.replace('from-red-50', 'from-gray-50');
                fraudAlert.classList.replace('to-orange-50', 'to-gray-50');
                fraudAlert.classList.replace('border-red-100', 'border-gray-200');
                break;
            case 'verify':
                message = 'Step-up authentication initiated. Please check your mobile device.';
                fraudAlert.classList.replace('from-red-50', 'from-blue-50');
                fraudAlert.classList.replace('to-orange-50', 'to-green-50');
                fraudAlert.classList.replace('border-red-100', 'border-blue-100');
                break;
            case 'review':
                message = 'Requesting human security review. You will be contacted shortly.';
                fraudAlert.classList.replace('from-red-50', 'from-purple-50');
                fraudAlert.classList.replace('to-orange-50', 'to-purple-50');
                fraudAlert.classList.replace('border-red-100', 'border-purple-100');
                break;
        }
        
        // Show temporary notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-6 right-6 bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 max-w-xs z-50 animate-bounce-small';
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
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Reinitialize icons in new notification
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    // Send AI Chat Message
    function sendMessage(message) {
        const text = message || elements.textarea.value;
        if (!text.trim() || text.length < 2) return;
        
        // Add user message to chat
        const chatHistory = document.querySelector('.bg-gray-50.rounded-xl.p-4.h-80');
        if (chatHistory) {
            const userMessage = document.createElement('div');
            userMessage.className = 'flex justify-end mb-4';
            userMessage.innerHTML = `
                <div class="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-none inline max-w-[80%]">
                    ${text}
                </div>
            `;
            chatHistory.appendChild(userMessage);
            
            // Scroll to bottom
            chatHistory.scrollTop = chatHistory.scrollHeight;
            
            // Get AI response after delay
            setTimeout(() => {
                const aiResponse = generateAIResponse(text);
                const responseDiv = document.createElement('div');
                responseDiv.className = 'flex justify-start mb-4';
                responseDiv.innerHTML = `
                    <div class="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-tl-none max-w-[85%]">
                        <div class="flex items-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs mr-2">
                                AI
                            </div>
                            <span class="text-sm font-medium text-gray-900">AI Wealth Advisor</span>
                        </div>
                        <p class="text-gray-700">${aiResponse}</p>
                    </div>
                `;
                chatHistory.appendChild(responseDiv);
                
                // Scroll to bottom again
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }, 1000);
        }
    }
    
    // Generate AI Response
    function generateAIResponse(userQuery) {
        const queries = userQuery.toLowerCase();
        
        if (queries.includes('allocation') || queries.includes('equity')) {
            return "Based on your current portfolio, your technology allocation is 18%, which is below the recommended 25-30% for your investment horizon. Would you like me to suggest specific tech stocks that align with your risk profile? I can analyze current market trends and provide recommendations.";
        } else if (queries.includes('fraud') || queries.includes('security')) {
            return "Your account security is currently protected with multiple layers: two-factor authentication, biometric verification, geolocation monitoring, and real-time anomaly detection. The last security check was performed 3 minutes ago with no anomalies detected.";
        } else if (queries.includes('portfolio')) {
            return "Your portfolio shows strong performance with a 2.3% growth this month. The AI optimizer suggests a rebalancing opportunity to improve returns by 0.7% while maintaining your risk tolerance. Would you like me to explain the proposed changes?";
        } else if (queries.includes('goal') || queries.includes('retirement')) {
            return "Your retirement goal projections look positive. At your current savings rate, you're on track to exceed your target by 12%. The AI suggests increasing contributions by 5% to accelerate your timeline by 2 years. Would you like me to run a more detailed scenario?";
        } else if (queries.includes('risk')) {
            return "Your current risk score is 87/100, which represents a low-risk portfolio. The recent large transaction has temporarily increased your risk profile, which is why step-up authentication was required. All risk metrics have returned to normal levels.";
        } else {
            return "I can help you with portfolio analysis, financial planning, fraud protection, or market insights. Could you specify what you'd like to know about your wealth management or account security?";
        }
    }
    
    // Add risk level badges
    function addRiskBadges() {
        const riskLevels = ['LOW', 'MEDIUM', 'HIGH'];
        
        riskLevels.forEach(level => {
            const badge = document.createElement('div');
            badge.className = `px-3 py-1 rounded-lg font-bold text-sm ${
                level === 'HIGH' ? 'bg-red-100 text-red-700' : 
                level === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`;
            badge.textContent = level + ' RISK';
            return badge;
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Setup proper risk calculation for high-risk transaction
    document.addEventListener('DOMContentLoaded', function() {
        // Calculate actual risk score for the demo transaction
        const riskScore = 87; // This reflects the multiple risk factors detected
        
        // Update UI elements with calculated risk score
        const riskDisplay = document.querySelector('.risk-score-value');
        const riskLevelDisplay = document.querySelector('.risk-level-display');
        
        if (riskDisplay) {
            riskDisplay.textContent = riskScore + '/100';
        }
        
        if (riskLevelDisplay) {
            riskLevelDisplay.innerHTML = `
                <div class="flex items-center">
                    <div class="flex -space-x-1">
                        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                </div>
                <span class="text-red-600 font-semibold">HIGH RISK</span>
            `;
        }
    });
})();