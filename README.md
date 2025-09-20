# CareerCompass 🧭

> **Personalized Career & Skills Advisor** - A dark, minimalistic full-stack prototype built with React, Node.js, and AI integration.

[![CI/CD](https://github.com/your-username/CareerCompass/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/CareerCompass/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

CareerCompass is a production-ready prototype that provides personalized career guidance through AI-powered recommendations, psychometric testing, and real-time tech trend analysis. Built for hackathons and demos, it features a dark minimal UI and comprehensive backend with RAG (Retrieval-Augmented Generation) capabilities.

### ✨ Key Features

- **🤖 AI-Powered Chat**: Conversational career advisor with RAG integration
- **🧠 Psychometric Testing**: Big Five personality assessment with career matching
- **📊 Real-time Tech Updates**: Automated trend analysis from GitHub, HackerNews
- **👤 Smart Profiles**: Auto-skill extraction from resume uploads
- **🎨 Dark Minimal UI**: Responsive design with Tailwind CSS
- **🔐 Enterprise Authentication**: Clerk integration with social login
- **📈 Career Roadmaps**: 6-month personalized learning paths
- **☁️ Cloud-Ready**: Docker, Cloud Run, MongoDB Atlas support

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Services   │
│   React + Vite  │◄──►│  Node.js + TS   │◄──►│ Vertex AI / HF  │
│   TailwindCSS   │    │   Express API   │    │   Embeddings    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼────┐
            │ MongoDB │ │ Redis │ │ Worker │
            │ Atlas   │ │ Cache │ │ Queue  │
            └─────────┘ └───────┘ └────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional)
- Clerk account for authentication

### 1. Clone & Install
```bash
git clone https://github.com/your-username/CareerCompass.git
cd CareerCompass
npm run install:all
```

### 2. Environment Setup
```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment  
cp frontend/.env.example frontend/.env

# Edit both .env files with your configuration
```

### 3. Start Development
```bash
# Start both backend and frontend
npm run dev

# Access at:
# Frontend: http://localhost:5175
# Backend:  http://localhost:5000
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

For detailed setup instructions, see [RUN_LOCAL.md](./RUN_LOCAL.md).

## 📱 Demo Flow

1. **Landing** → Professional authentication with Clerk
2. **Sign Up/Sign In** → Enterprise-grade auth with social login options
3. **Chat** → AI-powered career conversations with RAG
4. **Psychotest** → 10-question personality assessment
5. **Profile** → Education, skills, preferences
6. **Dashboard** → Personalized recommendations + tech trends
7. **Resume** → Upload & auto-skill extraction

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for dark minimal design
- **React Router** for navigation
- **React Query** for data fetching
- **Clerk** for authentication UI

### Backend
- **Node.js 18+** with TypeScript
- **Express** REST API
- **MongoDB** with Mongoose ODM
- **Redis** for caching (optional)
- **Clerk** enterprise authentication
- **Winston** logging
- **Jest** testing

### AI Integration
- **Vertex AI Gemini 2B** (Google Cloud)
- **Hugging Face** Inference API
- **RAG** with embeddings and cosine similarity
- **Mock providers** for offline development

### Infrastructure
- **Docker** & Docker Compose
- **GitHub Actions** CI/CD
- **Google Cloud Run** deployment
- **MongoDB Atlas** cloud database
- **Nginx** reverse proxy

## 📊 API Endpoints

### Authentication
- `GET /api/clerk-auth/me` - Get current user
- `POST /api/clerk-auth/sync-user` - Sync user with database
- `DELETE /api/clerk-auth/delete-account` - Delete user account

### Core Features
- `POST /api/chat` - AI chat with RAG
- `GET /api/chat/:userId` - Chat history
- `POST /api/psychotest` - Submit personality test
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles/:id` - Get profile with recommendations

### Data Management
- `GET /api/tech-updates` - Latest tech trends
- `POST /api/upload/resume` - Resume upload & parsing
- `CRUD /api/projects` - Project management
- `CRUD /api/resumes` - Resume management

See [Postman Collection](./postman/CareerCompass-API.postman_collection.json) for testing.

## 🔐 Authentication Configuration

### Clerk Setup (Required)
```env
# Backend (.env)
CLERK_SECRET_KEY=your-clerk-secret-key

# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

**Important**: Never commit your actual API keys to GitHub. Use environment variables and `.env.example` files.

## 🤖 AI Provider Configuration

### Mock Mode (Default)
```env
USE_MOCK_AI=true
USE_MOCK_EMBEDDINGS=true
```

### Vertex AI Setup
```env
USE_MOCK_AI=false
VERTEX_PROJECT=your-gcp-project-id
VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-2.0-flash-exp
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

### Hugging Face Setup
```env
USE_MOCK_AI=false
HF_TOKEN=your-hugging-face-token
HF_MODEL=microsoft/DialoGPT-medium
HF_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## 🐳 Docker Deployment

### Local Development
```bash
docker-compose up -d
```

### Production Build
```bash
# Build images
docker build -t career-compass-backend ./backend
docker build -t career-compass-frontend ./frontend

# Run with environment variables
docker run -p 5000:5000 \
  -e MONGO_URI=your-mongo-uri \
  -e CLERK_SECRET_KEY=your-secret \
  career-compass-backend
```

## ☁️ Cloud Deployment

### Google Cloud Run
```bash
# Build and deploy backend
gcloud run deploy career-compass-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,USE_MOCK_AI=true

# Build and deploy frontend
gcloud run deploy career-compass-frontend \
  --source ./frontend \
  --region us-central1 \
  --allow-unauthenticated
```

### MongoDB Atlas Setup
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Update `MONGO_URI` in environment variables

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run lint
```

### API Testing
```bash
# Import Postman collection
# File: postman/CareerCompass-API.postman_collection.json

# Or use curl examples in RUN_LOCAL.md
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run tests/load-test.yml
```

## 📈 Performance & Scaling

### Optimization Features
- **Redis caching** for frequent queries
- **Connection pooling** for MongoDB
- **Gzip compression** for API responses
- **CDN-ready** static assets
- **Horizontal scaling** with Cloud Run

### Monitoring
- **Winston logging** with structured logs
- **Health check** endpoints
- **Error tracking** with stack traces
- **Performance metrics** via middleware

## 🔒 Security

### Implemented Features
- **Clerk enterprise authentication** with social login
- **Session-based security** with automatic token management
- **Rate limiting** (100 requests/15min)
- **Input validation** with Joi/express-validator
- **CORS configuration**
- **Helmet.js** security headers
- **Built-in security** via Clerk's enterprise platform

### Production Checklist
- [ ] Configure Clerk production keys
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up monitoring alerts
- [ ] Configure Clerk webhooks for user sync
- [ ] Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Use conventional commits
- Ensure CI/CD passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clerk** for enterprise-grade authentication
- **Google Vertex AI** for Gemini 2B integration
- **Hugging Face** for open-source models
- **MongoDB Atlas** for cloud database
- **Tailwind CSS** for design system
- **React** and **Node.js** communities

## 📞 Support

- **Documentation**: [RUN_LOCAL.md](./RUN_LOCAL.md)
- **API Reference**: [Postman Collection](./postman/)
- **Issues**: [GitHub Issues](https://github.com/your-username/CareerCompass/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/CareerCompass/discussions)

---

**Built with ❤️ for hackathons and career guidance**

*CareerCompass - Navigate your tech career with AI-powered insights*
