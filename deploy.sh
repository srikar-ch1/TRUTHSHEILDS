#!/bin/bash
# TRUTHSHIELD Deployment Script for Linux/macOS
# Run this script to deploy the application

echo "=== TRUTHSHIELD Deployment Script ==="
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✓ Docker found: $(docker --version)"
    DOCKER_AVAILABLE=true
else
    echo "✗ Docker not found"
    DOCKER_AVAILABLE=false
fi

# Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    echo "✓ Docker Compose found: $(docker-compose --version)"
    COMPOSE_AVAILABLE=true
elif docker compose version &> /dev/null; then
    echo "✓ Docker Compose (plugin) found: $(docker compose version)"
    COMPOSE_AVAILABLE=true
    USE_PLUGIN=true
else
    echo "✗ Docker Compose not found"
    COMPOSE_AVAILABLE=false
fi

echo ""

# Deployment options
echo "Deployment Options:"
echo "1. Docker Compose (Recommended - Full stack)"
echo "2. Manual Backend Only"
echo "3. Manual Frontend Only"
echo ""

read -p "Select deployment method (1-3): " choice

if [ "$choice" == "1" ]; then
    if [ "$DOCKER_AVAILABLE" = false ] || [ "$COMPOSE_AVAILABLE" = false ]; then
        echo "Error: Docker and Docker Compose are required for this option"
        exit 1
    fi
    
    echo ""
    echo "Building and starting services with Docker Compose..."
    
    if [ "$USE_PLUGIN" = true ]; then
        docker compose up -d --build
    else
        docker-compose up -d --build
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Deployment successful!"
        echo ""
        echo "Services are running:"
        echo "  Frontend: http://localhost"
        echo "  Backend API: http://localhost:5000"
        echo "  Health Check: http://localhost:5000/health"
        echo ""
        echo "To view logs: docker-compose logs -f (or docker compose logs -f)"
        echo "To stop: docker-compose down (or docker compose down)"
    else
        echo "✗ Deployment failed. Check errors above."
        exit 1
    fi
elif [ "$choice" == "2" ]; then
    echo ""
    echo "Setting up Backend..."
    
    if [ ! -d "backend/venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv backend/venv
    fi
    
    echo "Activating virtual environment..."
    source backend/venv/bin/activate
    
    echo "Installing dependencies..."
    pip install -r backend/requirements.txt
    
    echo ""
    echo "✓ Backend setup complete!"
    echo ""
    echo "To start backend:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  python app.py"
elif [ "$choice" == "3" ]; then
    echo ""
    echo "Building Frontend..."
    
    cd frontend
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Frontend build complete!"
        echo ""
        echo "Build output: frontend/dist"
        echo "Serve this folder with a web server (nginx, apache, or static hosting)"
    else
        echo "✗ Build failed. Check errors above."
        exit 1
    fi
    
    cd ..
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "=== Deployment Complete ==="
