#!/bin/bash

# Adaptive Probe - Quick Start Script for macOS/Linux

echo ""
echo "==================================="
echo "  Adaptive Probe - MERN Stack"
echo "  Quick Start for macOS/Linux"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found"
echo ""

# Check if .env exists in server
if [ ! -f "server/.env" ]; then
    echo "ERROR: server/.env not found"
    echo "Please create server/.env with your MongoDB and OpenAI keys"
    echo "Copy from server/.env.example"
    exit 1
fi

echo "✓ server/.env found"

# Check if .env.local exists in client
if [ ! -f "client/.env.local" ]; then
    echo "Creating client/.env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > client/.env.local
    echo "✓ client/.env.local created"
fi

echo ""
echo "Starting services..."
echo ""

# Start backend in background
echo "Starting Backend Server (port 5000)..."
cd server
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in new terminal
echo "Starting Frontend Server (port 3000)..."
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "   Services Starting..."
echo "==================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "To stop all services, press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user interrupt
wait
