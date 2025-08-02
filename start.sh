#!/bin/bash

# Exit immediately if any command fails
set -e

# Check if yarn is installed, install if missing
if ! command -v yarn &> /dev/null; then
    echo "Yarn is not installed. Installing now..."
    npm install -g yarn
else
    echo "Yarn is already installed."
fi

echo "Installing root dependencies with Yarn..."
yarn install

echo "Navigating to the server directory..."
cd server || { echo "Error: 'server' directory not found!"; exit 1; }

echo "Installing server dependencies with Yarn..."
yarn install

echo "Starting the server in the background..."
#yarn start &  # Run server process in the background

# Return to the root directory
cd ..

echo "Starting the root project..."
yarn start
