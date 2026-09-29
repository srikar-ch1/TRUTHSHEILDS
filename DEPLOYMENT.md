# TRUTHSHIELD Deployment Guide

## Quick Deployment with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80 and 5000 available

### Steps

1. **Clone and navigate to project**
   ```bash
   cd truthshield
   ```

2. **Set up environment variables** (optional, defaults work for local deployment)
   - Backend: Copy `backend/.env.example` to `backend/.env` and update if needed
   - Frontend: Copy `frontend/.env.example` to `frontend/.env` and update if needed

3. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify deployment**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services**
   ```bash
   docker-compose down
   ```

## Production Deployment

### Environment Variables

#### Backend (.env)
```env
FRONTEND_URL=https://yourdomain.com
FLASK_DEBUG=false
PORT=5000
MAX_CONTENT_LENGTH=104857600
CORS_ORIGINS=https://yourdomain.com
```

#### Frontend (.env)
```env
VITE_API_BASE=/api
VITE_API_TIMEOUT=60000
```

### Manual Deployment

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Set environment variables
export FLASK_DEBUG=false
export FRONTEND_URL=https://yourdomain.com
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with nginx/apache or static hosting
```

### Production Server Setup (Nginx)

1. **Install Nginx**
   ```bash
   sudo apt-get update
   sudo apt-get install nginx
   ```

2. **Copy nginx.conf** to `/etc/nginx/sites-available/truthshield`

3. **Update backend URL** in nginx.conf (replace `http://backend:5000` with your backend URL)

4. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/truthshield /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Set up SSL** (recommended)
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Health Checks

- Backend health: `GET /health`
- Returns: `{"status": "ok", "service": "truthshield-api", "version": "1.0.0"}`

## Monitoring

- Backend logs: `backend/logs/truthshield_YYYYMMDD.log`
- Docker logs: `docker-compose logs backend`
- System metrics: `GET /api/system-metrics`

## Troubleshooting

### Backend won't start
- Check Python version (3.11+)
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check logs: `docker-compose logs backend`

### Frontend build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version (20+)
- Verify TypeScript compilation: `npm run build`

### API timeout errors
- Increase `VITE_API_TIMEOUT` in frontend `.env`
- Check backend processing time in logs
- Verify file size limits

### CORS errors
- Update `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL matches exactly

## Scaling

For production scaling:
- Use a production WSGI server (Gunicorn/uWSGI) instead of Flask dev server
- Set up load balancer for multiple backend instances
- Use Redis for session management if needed
- Consider CDN for frontend static assets
