# Phishing Simulation & Awareness Platform

A full-stack phishing simulation system built with NestJS microservices architecture, MongoDB, and React.

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

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd cymulate-phishing-simulation
```

### 2. Install Dependencies

**Server 1 (Phishing Simulation):**

```bash
cd phishing-simulation-server
npm install
```

**Server 2 (Management):**

```bash
cd management-server
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Configure MongoDB

Update MongoDB connection strings in:

- `phishing-simulation-server/src/app.module.ts`
- `management-server/src/app.module.ts`

Replace with your MongoDB Atlas connection string.

### 4. Start Services

**Terminal 1 - Server 1:**

```bash
cd phishing-simulation-server
npm run start:dev
```

**Terminal 2 - Server 2:**

```bash
cd management-server
npm run start:dev
```

**Terminal 3 - Frontend:**

```bash
cd frontend
npm start
```

## Usage

1. **Register/Login:** Navigate to http://localhost:3002
2. **Create Phishing Attempt:** Fill in target email, subject, and content
3. **Get Tracking Link:** Copy the tracking link from the success message
4. **Simulate Click:** Open the tracking link in browser
5. **View Status:** Watch the dashboard update to "CLICKED"

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

✅ Microservices architecture with inter-service communication
✅ JWT authentication and authorization
✅ User-specific data isolation
✅ Click tracking with unique tokens
✅ Real-time status updates
✅ Responsive React UI
✅ Form validation
✅ MongoDB data persistence

## Security Features

- Password hashing (bcrypt)
- JWT token authentication
- User-specific data access
- CORS enabled for development

## Future Enhancements

- Actual email sending via SMTP
- Email templates library
- Campaign scheduling
- Analytics dashboard
- User awareness training modules
- Docker containerization
