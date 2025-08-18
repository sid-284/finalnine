# Luxe Fashion - E-commerce Website

A fully functional e-commerce website with React frontend and Node.js backend.

## Features

- User authentication (Email/Password + Google OAuth)
- Product browsing and search
- Shopping cart functionality
- Wishlist management
- User profile management
- Admin panel for product CRUD operations
- Razorpay payment integration
- Responsive design

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd luxe_fashion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_API_BASE_URL=/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:4028`

## Payment Setup

### Razorpay Configuration

1. Sign up for a Razorpay account at https://razorpay.com
2. Get your test API keys from the Razorpay dashboard
3. Add the keys to your environment files:
   - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Frontend: `VITE_RAZORPAY_KEY_ID`

### Admin Setup

1. Create an admin user in MongoDB by setting `isAdmin: true` for a user
2. Admin users will see an "Admin Panel" link in the header
3. Admins can perform CRUD operations on products

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Products
- `GET /api/product/list` - Get all products
- `POST /api/product/addproduct` - Add product (Admin only)
- `PUT /api/product/update/:id` - Update product (Admin only)
- `DELETE /api/product/delete/:id` - Delete product (Admin only)

### Orders
- `POST /api/order/razorpay` - Create Razorpay order
- `POST /api/order/verifyrazorpay` - Verify Razorpay payment

### User
- `GET /api/user/wishlist` - Get user wishlist
- `POST /api/user/wishlist/add` - Add to wishlist
- `POST /api/user/wishlist/remove` - Remove from wishlist
- `POST /api/user/updateprofile` - Update user profile

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Firebase Authentication, JWT
- **Payment**: Razorpay
- **File Upload**: Multer, Cloudinary
- **State Management**: React Context API
