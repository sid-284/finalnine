# Frontend-Backend Connection Setup

This document explains how the frontend and backend are connected and how to set them up for local development.

## Current Architecture

### Frontend (React + Vite)
- **Port**: 4028
- **Location**: `luxe_fashion/`
- **API Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Proxy**: Vite proxy forwards `/api` requests to backend

### Backend (Node.js + Express)
- **Port**: 8000
- **Location**: `backend/`
- **API Routes**: All routes prefixed with `/api`
- **CORS**: Configured to allow frontend requests

## Connection Flow

1. Frontend makes API calls to `/api/*` endpoints
2. Vite proxy intercepts these requests
3. Proxy forwards requests to `http://localhost:8000/api/*`
4. Backend processes requests and returns responses
5. Proxy forwards responses back to frontend

## Setup Instructions

### 1. Environment Files Setup

Run the setup script to create environment files:
```bash
./setup-env.sh
```

Or manually create the files:

**Frontend (.env in luxe_fashion/)**
```bash
cp luxe_fashion/env.example luxe_fashion/.env
```

**Backend (.env in backend/)**
```bash
cp backend/env.example backend/.env
```

### 2. Update Environment Variables

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:8000/api
# Add your actual Firebase and Razorpay credentials
```

**Backend (.env)**
```
PORT=8000
MONGODB_URL=mongodb://localhost:27017/luxe_fashion
JWT_SECRET=your_jwt_secret_key_here
# Add your actual Cloudinary, Razorpay, and other credentials
```

### 3. Start Development Servers

**Option 1: Use the provided script**
```bash
./start-dev.sh
```

**Option 2: Start manually**

Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd luxe_fashion
npm install
npm start
```

### 4. Verify Connection

Test the backend health endpoint:
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuration Files

### Vite Configuration (vite.config.mjs)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, '/api'),
  },
}
```

### API Utility (src/utils/api.js)
- Uses `VITE_API_BASE_URL` environment variable
- Handles authentication cookies
- Provides helper functions for common HTTP methods

### Backend CORS (index.js)
- Allows requests from `http://localhost:4028` (frontend)
- Supports credentials for authentication
- Handles preflight requests

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8000
   - Check CORS configuration in backend/index.js
   - Verify frontend is running on port 4028

2. **Proxy Not Working**
   - Check Vite configuration in vite.config.mjs
   - Ensure backend is accessible at http://localhost:8000
   - Check browser network tab for request details

3. **Environment Variables Not Loading**
   - Restart the development server after changing .env files
   - Ensure .env files are in the correct directories
   - Check variable names start with `VITE_` for frontend

4. **Database Connection Issues**
   - Ensure MongoDB is running
   - Check MONGODB_URL in backend .env file
   - Verify database credentials

### Debug Commands

Check if servers are running:
```bash
# Check backend
curl http://localhost:8000/api/health

# Check frontend
curl http://localhost:4028
```

Check ports in use:
```bash
lsof -i :8000  # Backend port
lsof -i :4028  # Frontend port
```

## API Endpoints

The backend provides these main API routes:
- `/api/auth` - Authentication
- `/api/user` - User management
- `/api/product` - Product management
- `/api/cart` - Shopping cart
- `/api/order` - Order management

All endpoints are accessible through the frontend at the same paths (e.g., `/api/auth/login`).
