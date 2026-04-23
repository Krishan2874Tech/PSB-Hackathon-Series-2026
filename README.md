<img width="980" height="149" alt="image" src="https://github.com/user-attachments/assets/d0856c23-86de-4170-a666-4f972f986384" />
PSB-Hackathon-Series-2026 — SecureWealth Twin
SecureWealth Twin — Intelligent Wealth Growth with Built‑in Fraud Protection
An end‑to‑end prototype combining personalized AI wealth advisory with a mandatory fraud‑protection layer for critical actions. This README guides contributors and judges through setup, architecture, components, development workflow, testing, and deployment.

Table of contents

Project overview
Key features
Tech stack
Repo structure
Prerequisites
Step 1 — Backend setup (detailed)
Step 2 — Frontend setup (detailed)
Environment configuration (.env)
Database schema (summary)
Running locally (both services)
API docs & Postman collection
Tests (unit, integration, load)
Mock/demo data
Security & secrets
CI/CD (Cloud Build sample)
Deployment notes (GCP Terraform pointers)
Troubleshooting
Contact / Contributors
Project overview
SecureWealth Twin is a demo-grade platform showing how banks can offer AI-driven personalized financial advice while enforcing mandatory fraud-protection for transfer, trade, withdrawal, and payout setup flows. The repo contains a FastAPI backend, React frontend, and demo assets for the PSB Suraksha Manthan hackathon.

Key features (high level)

Onboarding with KYC stub, risk profiling, and simulated account tokenization
Personalized wealth advisor: goals, allocations, rebalancing suggestions, scenario simulation, natural language Q&A (LLM)
Fraud Protection (mandatory): real‑time risk scoring, device fingerprint basics, velocity checks, step‑up auth, human approval / cooling period, transaction throttling
Explainability & Audit: immutable audit entries, reason codes, customer-facing risk messages
Monitoring hooks, SIEM-friendly logs, demo incident runbook
Demo mode with synthetic users for hackathon presentation

<img width="1024" height="513" alt="image" src="https://github.com/user-attachments/assets/4e804500-54d3-4e1d-a4ad-347ff0fe26d2" />

Tech stack

Backend: Python, FastAPI, Uvicorn, SQLAlchemy, Alembic, Celery (optional), Redis (optional)
Auth: Firebase Authentication (email/phone/SSO) — simulated locally / stubbed for demo
Database: MySQL (production), SQLite for quick local dev
Frontend: React (web) and React Native (mobile) skeleton (mobile not included in this repo—see mobile/ folder)
Serverless/Cloud: Cloud Functions (business logic), Cloud Run (AI microservice), Pub/Sub (events), BigQuery (analytics) — infra via Terraform (samples)
LLM: microservice pattern calling instruction‑tuned LLM (OpenAI or other) with embeddings for profile + history
Observability: Stackdriver / Cloud Logging (GCP), optional SIEM integration
Secrets: Google Secret Manager (production); local uses .env (never commit)
CI/CD: Cloud Build (sample cloudbuild.yaml) + GitHub Actions.
