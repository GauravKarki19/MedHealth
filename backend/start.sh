#!/bin/bash
# Start script for Render deployment
# This script ensures the server starts correctly on Render

echo "Starting MedHealth Backend Server..."

# Check if PORT is set (Render automatically sets this)
if [ -z "$PORT" ]; then
    export PORT=5000
    echo "PORT not set, using default: $PORT"
else
    echo "Using PORT: $PORT"
fi

# Start Gunicorn with appropriate workers
# For free tier, use 1-2 workers to conserve resources
exec gunicorn app:app \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --worker-class sync \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info

