#!/bin/bash
# MzansiRides - Start both servers with proper timing
# Backend starts first, frontend waits for port 4000 to be ready

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "  MzansiRides - Starting Servers"
echo "=========================================="

# Kill any stale processes
fuser -k 4000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 1

# Start backend first
echo "[1/2] Starting backend (Spring Boot)..."
cd "$ROOT/backend" && mvn -o spring-boot:run &
BACKEND_PID=$!

# Wait for backend to be ready
echo -n "      Waiting for backend "
for i in $(seq 1 60); do
  if curl -s http://localhost:4000/api/health 2>/dev/null | grep -q ok; then
    echo " READY (${i}s)"
    break
  fi
  echo -n "."
  sleep 1
done

# Start frontend
echo "[2/2] Starting frontend (Vite)..."
cd "$ROOT" && npx vite &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "  Client:  http://localhost:5173"
echo "  Admin:   http://localhost:5173/admin/login"
echo "  API:     http://localhost:4000"
echo "  DB:      http://localhost:4000/h2-console"
echo "=========================================="

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
