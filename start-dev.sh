#!/bin/bash

echo "🚀 Starting Luxe Fashion Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB is not running. Please start MongoDB first."
        echo "   You can start it with: mongod"
    else
        echo "✅ MongoDB is running"
    fi
fi

# Start Backend
echo "📦 Starting Backend Server..."
cd backend
if [ ! -f .env ]; then
    echo "⚠️  Backend .env file not found. Please create it from env.example"
    echo "   Copy env.example to .env and fill in your credentials"
fi

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd ../luxe_fashion

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Check if frontend .env exists
if [ ! -f .env ]; then
    echo "⚠️  Frontend .env file not found. Please create it from env.example"
    echo "   Copy env.example to .env and fill in your credentials"
fi

# Start frontend
echo "🌐 Frontend will be available at http://localhost:4028"
npm start

# Cleanup function
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Wait for background processes
wait 