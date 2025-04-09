#!/bin/bash

# Install dependencies
echo "Installing server dependencies..."
cd server
npm install

echo "Installing client dependencies..."
cd ../client
npm install

# Build the React app
echo "Building React application..."
npm run build

echo "Build complete! Ready for deployment."
