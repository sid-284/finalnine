# Backend Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Credentials
ADMIN_EMAIL=admin_9twoofficialinfo
ADMIN_PASSWORD=admin_92991
```

## Admin Setup

1. **Set Admin Credentials**: Add the admin email and password to your `.env` file
2. **Restart Backend**: After updating the `.env` file, restart your backend server
3. **Access Admin Panel**: Go to `/admin` in your frontend
4. **Login**: Use the admin credentials to access the admin panel

## Admin Features

- **Product Management**: Add, edit, delete products
- **Image Upload**: Upload product images
- **CRUD Operations**: Full product management capabilities

## Troubleshooting

If admin login fails:
1. Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env`
2. Restart the backend server after updating `.env`
3. Check backend console logs for admin login attempts
4. Verify the credentials match exactly (case-sensitive)