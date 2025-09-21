#!/bin/bash

# Render build script for backend
echo "Starting backend build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p uploads

echo "Backend build completed successfully!"
