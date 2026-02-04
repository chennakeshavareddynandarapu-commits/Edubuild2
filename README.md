# Edubuild Frontend (minimal scaffold)

This is a minimal Vite + React scaffold created to add authentication (Sign In / Sign Up) for Teacher (user) and Admin roles.

Quick setup:

1. cd edubuild-frontend
2. npm install
3. npm run dev

Expectations for backend endpoints:
- POST /api/auth/register -> returns { token, user }
- POST /api/auth/login -> returns { token, user }

Security note: Prefer HttpOnly cookie tokens set by backend. If using token in frontend, store carefully (prefer in-memory or HttpOnly cookie).