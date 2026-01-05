# Phishing Simulation & Awareness Platform

A full-stack phishing simulation system built with NestJS microservices architecture, MongoDB, and React.

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB Atlas account

### Setup:

**1. Install dependencies:**

```bash
# Server 1 (Phishing Simulation - Port 3001)
cd phishing-simulation-server && npm install

# Server 2 (Management - Port 3000)
cd ../management-server && npm install

# Frontend (Port 3002)
cd ../frontend && npm install
```

**2. Configure MongoDB:**

- Update connection strings in both servers `src/app.module.ts`
- Use your MongoDB Atlas connection string

**3. Start all services:**

```bash
# Terminal 1
cd phishing-simulation-server && npm run start:dev

# Terminal 2
cd management-server && npm run start:dev

# Terminal 3
cd frontend && npm start
```

**4. Open http://localhost:3002**

## Architecture

### Server 1: Phishing Simulation Service (Port 3001)

- Sends phishing emails with tracking links
- Tracks user clicks on phishing links
- Updates attempt status when clicked

### Server 2: Management Service (Port 3000)

- User authentication (JWT)
- Phishing attempt management
- User dashboard and monitoring

### Frontend: React Dashboard (Port 3002)

- User login/registration
- Create phishing simulations
- View and track attempts
- Real-time status updates

## Tech Stack

**Backend:**

- NestJS (TypeScript)
- MongoDB (with Mongoose)
- JWT Authentication
- Nodemailer (email simulation)
- Microservices communication via HTTP

**Frontend:**

- React
- TypeScript
- Fetch API

## Configuration Notes

### Database Connection

MongoDB Atlas connection strings are currently hardcoded in:

- `phishing-simulation-server/src/app.module.ts`
- `management-server/src/app.module.ts`

**For production**, these should be moved to `.env` files:

```env
# .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
PORT=3000
```

## API Endpoints

### Server 1 (Phishing Simulation)

- `POST /phishing/send` - Send phishing email
- `GET /phishing/track/:token` - Track click and show warning

### Server 2 (Management)

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login (returns JWT)
- `POST /phishing-attempts` - Create phishing attempt (requires auth)
- `GET /phishing-attempts` - Get user's attempts (requires auth)
- `PATCH /phishing-attempts/status/:token` - Update status (internal)

## Features

- Microservices architecture with inter-service communication
- JWT authentication and authorization
- Password hashing (bcrypt)
- User-specific data isolation
- Click tracking with unique tokens
- Auto-refresh status updates
- Form validation (email, required fields)
- MongoDB data persistence
- CORS enabled for development
