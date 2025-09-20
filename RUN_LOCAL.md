# CareerCompass - Local Development Setup

This guide provides step-by-step instructions to run CareerCompass locally for development and testing.

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local installation or MongoDB Atlas)
- **Redis** (optional, will fallback to in-memory cache)
- **Git**

## Quick Start (Recommended)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd CareerCompass

# Install all dependencies (root, backend, frontend)
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration
# For quick demo, you can use the default values with USE_MOCK_AI=true
```

### 3. Start MongoDB (if running locally)

```bash
# Option A: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Option B: Using local MongoDB installation
mongod --dbpath /path/to/your/db
```

### 4. Seed Database (Optional)

```bash
# Create sample users and profiles
npm run seed
```

### 5. Start Development Servers

```bash
# Start both backend and frontend concurrently
npm run dev

# OR start individually:
# Backend: npm run dev:backend
# Frontend: npm run dev:frontend
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Detailed Setup Instructions

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your .env file (see Environment Variables section)

# Build TypeScript
npm run build

# Start development server
npm run dev

# Or start production build
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Edit `backend/.env` with the following configurations:

### Database
```env
MONGO_URI=mongodb://localhost:27017/careercompass
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careercompass
```

### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-token-secret-here
```

### AI Providers (Demo Mode)
```env
USE_MOCK_AI=true
USE_MOCK_EMBEDDINGS=true

# For real AI providers, set to false and configure:
# HF_TOKEN=your-hugging-face-token
# VERTEX_PROJECT=your-gcp-project-id
# GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

### Optional Services
```env
REDIS_URL=redis://localhost:6379
```

## Testing the Application

### 1. Register a New User
- Go to http://localhost:5173
- Use the chat or create a profile
- For API testing, use the Postman collection in `/postman/`

### 2. Demo Flow
1. **Landing Page**: Visit http://localhost:5173
2. **Chat**: Go to /chat and ask career questions
3. **Psychotest**: Take the personality test at /psychotest
4. **Profile**: Create your profile at /profile
5. **Dashboard**: View recommendations at /dashboard
6. **Resume**: Upload resume at /resume

### 3. API Testing
```bash
# Import the Postman collection
# File: postman/CareerCompass-API.postman_collection.json

# Or use curl:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'
```

## Background Services

### Tech Updates Worker
```bash
# Run once to fetch tech updates
cd backend
npm run build
node dist/worker/techWorker.js

# Or set up a cron job to run hourly
```

### Database Seeding
```bash
# Create sample data
npm run seed

# This creates 3 sample Indian student profiles
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   mongosh --eval "db.adminCommand('ping')"
   
   # Or use MongoDB Atlas connection string
   ```

2. **Port Already in Use**
   ```bash
   # Kill processes on ports 5000 or 5173
   npx kill-port 5000 5173
   ```

3. **AI Provider Errors**
   ```bash
   # Ensure USE_MOCK_AI=true in .env for demo mode
   # Check logs in backend/logs/ for detailed errors
   ```

4. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Performance Tips

1. **Use Redis for Caching**
   ```bash
   # Start Redis
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Update .env
   REDIS_URL=redis://localhost:6379
   ```

2. **Enable AI Providers**
   - Get Hugging Face token: https://huggingface.co/settings/tokens
   - Set up Google Cloud Vertex AI: https://cloud.google.com/vertex-ai
   - Update environment variables accordingly

## Production Deployment

See the main README.md for Docker and cloud deployment instructions.

## Development Scripts

```bash
# Root level
npm run dev              # Start both backend and frontend
npm run build           # Build both applications
npm run install:all     # Install all dependencies
npm run seed           # Seed database
npm run lint           # Lint both applications

# Backend specific
cd backend
npm run dev            # Development server with hot reload
npm run build          # Build TypeScript
npm run start          # Start production server
npm run test           # Run tests
npm run lint           # ESLint
npm run seed           # Seed database

# Frontend specific
cd frontend
npm run dev            # Vite development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # ESLint
```

## Support

If you encounter issues:

1. Check the logs in `backend/logs/`
2. Ensure all environment variables are set correctly
3. Verify MongoDB and Redis connections
4. Use mock mode (`USE_MOCK_AI=true`) for initial testing
5. Check the GitHub Issues for common problems

Happy coding! 🚀
