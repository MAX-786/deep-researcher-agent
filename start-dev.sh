#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 2

# Start the frontend server
echo "Starting frontend server..."
cd web && npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep the script running
echo "Development environment is running. Press Ctrl+C to stop."
wait
