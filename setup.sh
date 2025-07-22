#!/bin/bash

echo "Installing server dependencies..."
cd server
npm install

echo "Installing client dependencies..."
cd ../client
npm install

echo "✅ All dependencies installed."
