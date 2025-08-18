#!/bin/bash

echo "🔧 Setting up environment files..."

# Create frontend .env file
echo "📝 Creating frontend .env file..."
cd luxe_fashion
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Frontend .env file created from env.example"
    echo "📋 Please review and update the .env file with your actual credentials"
else
    echo "⚠️  Frontend .env file already exists"
fi

# Check backend .env
echo "🔍 Checking backend .env file..."
cd ../backend
if [ ! -f .env ]; then
    echo "⚠️  Backend .env file not found. Please create it from env.example"
    echo "   Copy env.example to .env and fill in your credentials"
else
    echo "✅ Backend .env file exists"
fi

echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update luxe_fashion/.env with your actual credentials"
echo "2. Review and update backend/.env with your actual credentials"
echo "3. Run ./start-dev.sh to start both servers"
