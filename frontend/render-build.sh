#!/bin/bash

# Render build script for frontend
echo "Starting frontend build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the React app
echo "Building React application..."
npm run build

echo "Frontend build completed successfully!"
