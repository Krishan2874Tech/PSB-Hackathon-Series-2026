# PSB Pathfinders Frontend

## Overview
A modern React (TypeScript) frontend for intelligent wealth growth and fraud protection. 

## Features
- **OTP-Based Login**: Integrated with backend 3-fail/2-minute lockout logic.
- **Wealth Twin Prediction**: 5-year wealth growth visualization.
- **Protected Actions**: Real-time risk assessment before executing high-value operations.
- **Glassmorphism Design**: High-fidelity UI with electric blue and emerald green accents.

## Setup Instructions
1. Ensure your backend is running on `http://127.0.0.1:8000`.
2. Navigate to this directory and install dependencies:
   ```bash
   npm install react react-dom react-scripts typescript @types/react @types/react-dom
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Development Progress
- [x] Global Styles (Vanilla CSS)
- [x] AuthContext with Token Persistence
- [x] OTP Login Flow (Phase 1 & 2)
- [x] Dashboard with Wealth Prediction Chart
- [x] Protected Action Modal with Risk Score Feedback

