# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Install dependencies
npm install
```

Note: No test suite is currently configured.

## Environment Setup

Required environment variables in `.env`:
- `PORT` - Server port
- `URI` - MongoDB connection string

## Architecture

This is an Express.js authentication API using session-based auth with Passport.js.

### Request Flow

1. `server.js` - Entry point, configures middleware stack:
   - CORS → JSON parser → Session (MongoDB-backed) → Passport → Routes → Error handler

2. Authentication uses Passport Local Strategy with email as the username field (`config/passport-strategy.js`)

3. Sessions are stored in MongoDB via `connect-mongo`

### Key Patterns

**Validation**: Routes use `express-validator` for input validation, processed by `middleware/handleValidationErrors.js`

**Password Hashing**: `utils/helpers.js` wraps bcrypt operations (`hashPassword`, `comparePassword`)

**Error Handling**: Centralized error handler in `middleware/error.js` - errors with `.status` property return that status code, otherwise 500

### API Routes

All routes are mounted at `/api/auth`:
- `POST /register` - Create user (email, username, password)
- `POST /login` - Authenticate user with Passport
