# CORS Fix Guide

## Problem
Your frontend at `https://www.9tytwooffical.com` is getting CORS errors when trying to access your backend at `https://finalnine.onrender.com`.

## Root Cause
The issue is that your frontend is configured to directly access the Render backend instead of using Vercel's API routing.

## Solutions

### Option 1: Use Vercel API Routing (Recommended)
Since you're deploying on Vercel, configure your frontend to use relative API paths:

1. **Set environment variable in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `/api`

2. **This will route all API calls through Vercel to your backend**

### Option 2: Fix Direct Backend Access
If you want to keep direct backend access, you need to:

1. **Set environment variable in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://finalnine.onrender.com/api`

2. **Update backend CORS configuration:**
   - The backend has been updated to allow your domain
   - Make sure to set `CORS_ORIGINS` environment variable in Render:
     ```
     CORS_ORIGINS=https://www.9tytwooffical.com,https://9tytwooffical.com
     ```

## Backend Changes Made
- ✅ Updated CORS configuration to explicitly allow your domains
- ✅ Added comprehensive CORS logging for debugging
- ✅ Added multiple CORS test endpoints:
  - `/api/cors-test` - Standard CORS test
  - `/api/public-test` - Public endpoint test
  - `/api/raw-cors-test` - Raw CORS test (no middleware interference)
- ✅ Added environment variable support for CORS origins
- ✅ Enhanced error handling for CORS violations
- ✅ Simplified CORS setup to avoid path-to-regexp errors
- ✅ Added global CORS middleware as backup
- ✅ Added comprehensive error handling for all middleware

## Testing

### Quick Tests
1. **Test CORS endpoint:**
   ```bash
   curl -H "Origin: https://www.9tytwooffical.com" \
        https://finalnine.onrender.com/api/cors-test
   ```

2. **Test preflight request:**
   ```bash
   curl -X OPTIONS \
        -H "Origin: https://www.9tytwooffical.com" \
        -H "Access-Control-Request-Method: GET" \
        https://finalnine.onrender.com/api/cors-test
   ```

### Comprehensive Testing
Run the comprehensive test script:
```bash
cd luxe-fashion-main
node test-cors-comprehensive.js
```

This will test all endpoints and preflight requests to identify exactly where the CORS issue is occurring.

## Environment Variables

### Backend (Render)
```bash
CORS_ORIGINS=https://www.9tytwooffical.com,https://9tytwooffical.com
```

### Frontend (Vercel)
```bash
# Option 1: Vercel routing
VITE_API_BASE_URL=/api

# Option 2: Direct backend
VITE_API_BASE_URL=https://finalnine.onrender.com/api
```

## Next Steps
1. Choose your preferred option (Vercel routing recommended)
2. Set the appropriate environment variables
3. Redeploy your backend if using Option 2
4. Test the CORS endpoint
5. Verify your frontend can now make API calls successfully

## Troubleshooting

### Path-to-Regexp Error
If you encounter a "Missing parameter name" error from path-to-regexp:
1. This usually indicates a malformed route pattern
2. The updated code now includes comprehensive error handling
3. Test server startup with: `node test-server-startup.js`
4. Check the logs for any middleware setup errors

### CORS Still Not Working
1. Verify the backend is running without errors
2. Check the CORS configuration logs in the backend console
3. Test with the comprehensive CORS test script
4. Ensure your domain is in the allowed origins list
