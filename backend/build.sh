#!/bin/bash
# Build script for Render deployment
# This script runs before the start command

echo "Building MedHealth Backend..."

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify model files exist (optional check)
if [ -d "../models" ]; then
    echo "✅ Models directory found"
    if [ -f "../models/ExtraTrees" ]; then
        echo "✅ ML model file found"
    else
        echo "⚠️  Warning: ML model file not found. Disease prediction may not work."
    fi
else
    echo "⚠️  Warning: Models directory not found. Disease prediction may not work."
fi

echo "✅ Build complete!"

