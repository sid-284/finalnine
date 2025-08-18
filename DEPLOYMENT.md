# Luxe Fashion - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to the GitHub repository
3. **Environment Variables**: Prepare all required environment variables

## Environment Variables Setup

### Backend Environment Variables (Set in Vercel Dashboard)

```
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
NODE_ENV=production
PORT=3000
```

### Frontend Environment Variables (Already configured in .env.production)

The frontend environment variables are already set in `.env.production` file.
Update `VITE_RAZORPAY_KEY_ID` with your actual Razorpay key.

## Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/sid-284/luxe-fashion.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project" and import from GitHub
3. **Select Repository**: Choose `sid-284/luxe-fashion`
4. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: `Luxe` (if your code is in the Luxe folder)
   - Build Command: Leave default
   - Output Directory: Leave default

### 3. Set Environment Variables

In the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the backend environment variables listed above
4. Make sure to set them for "Production" environment

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment

### 1. Update CORS Origins

After deployment, update the CORS configuration in `backend/index.js` to include your actual Vercel domain:

```javascript
origin: [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "http://localhost:4028",
  "https://accounts.google.com",
  "https://www.googleapis.com",
  "https://your-actual-vercel-domain.vercel.app"  // Replace with your actual domain
],
```

### 2. Test the Deployment

1. Visit your Vercel URL
2. Test user registration/login
3. Test product browsing
4. Test cart functionality
5. Test order placement

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in Vercel dashboard
2. **API Errors**: Verify environment variables are set correctly
3. **Database Connection**: Ensure MongoDB URL is correct and accessible
4. **CORS Errors**: Update CORS origins with your Vercel domain

### Useful Commands

```bash
# Test locally before deployment
npm run install-all
npm run dev-backend  # In one terminal
npm run dev-frontend # In another terminal

# Build frontend locally to test
npm run build-frontend
```

## File Structure

```
Luxe/
├── backend/           # Node.js/Express API
├── luxe_fashion/      # React frontend
├── vercel.json        # Vercel configuration
├── package.json       # Root package.json
└── .gitignore         # Git ignore rules
```

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables
3. Test API endpoints using the health check: `/api/health`
