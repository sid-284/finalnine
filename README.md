# Luxe Fashion - E-commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.

## 🚀 Features

- **User Authentication**: Firebase Authentication with Google OAuth
- **Product Management**: Admin panel for product CRUD operations
- **Shopping Cart**: Persistent cart with backend synchronization
- **Payment Integration**: Razorpay payment gateway
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live cart and user state management
- **Security**: JWT tokens, rate limiting, and secure cookies

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Firebase Authentication**
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Razorpay** for payments

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project
- Cloudinary account
- Razorpay account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Luxe
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=6000
MONGODB_URL=mongodb://localhost:27017/luxe_fashion
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=admin@luxe.com
ADMIN_PASSWORD=admin_password_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd luxe_fashion
npm install
```

Create a `.env` file in the luxe_fashion directory:
```env
VITE_API_BASE_URL=http://localhost:6000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd luxe_fashion
npm start
```

The application will be available at:
- Frontend: http://localhost:4028
- Backend: http://localhost:6000

## 📁 Project Structure

```
Luxe/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controller/         # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── model/              # MongoDB models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── luxe_fashion/           # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
│   └── public/             # Static assets
└── README.md
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Add your Firebase config to the frontend `.env` file

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `luxe_fashion`
3. Update the `MONGODB_URL` in backend `.env`

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Update the Cloudinary config in backend `.env`

### Razorpay Setup
1. Create a Razorpay account
2. Get your key ID and secret
3. Update the Razorpay config in both frontend and backend `.env` files

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse of API endpoints
- **JWT Tokens**: Secure authentication with httpOnly cookies
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for development and production
- **Environment Variables**: Sensitive data stored in `.env` files

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Update CORS origins for your production domain
3. Use a production MongoDB instance
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder to platforms like Vercel, Netlify, or AWS S3
3. Update environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@luxe.com or create an issue in the repository. # finalnine
