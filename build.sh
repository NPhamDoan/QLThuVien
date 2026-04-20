#!/bin/bash
echo "=== Building Library Management System ==="
echo

echo "[1/3] Installing backend dependencies..."
cd backend
npm install

echo
echo "[2/3] Installing frontend dependencies..."
cd ../frontend
npm install

echo
echo "[3/3] Building..."
cd ../backend
npm run build

echo
echo "=== Build complete! ==="
