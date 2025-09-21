#!/bin/bash

# Render build script for backend
echo "Starting backend build process..."

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    echo "Found package-lock.json, using npm ci..."
    npm ci
else
    echo "No package-lock.json found, using npm install..."
    npm install
fi

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p uploads

echo "Backend build completed successfully!"
