# Deployment Guide

This guide covers deploying ChatPDF to various environments including local, staging, and production deployments.

## 🚀 Quick Deployment Options

### Option 1: Docker (Recommended)
```bash
docker run -p 3000:3000 -e COHERE_API_KEY=your_key chatpdf:latest
```

### Option 2: Node.js
```bash
npm install --production && npm start
```

### Option 3: Bun (Fastest)
```bash
bun install --production && bun start
```

---

## 🐳 Docker Deployment

### Build Docker Image

Create a `Dockerfile`:
```dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/z || exit 1

# Start application
CMD ["bun", "start"]
```

### Build and Run
```bash
# Build image
docker build -t chatpdf:latest .

# Run container
docker run -d \
  --name chatpdf \
  -p 3000:3000 \
  -e COHERE_API_KEY=your_cohere_key \
  -e SUPABASE_URL=your_supabase_url \
  -e SUPABASE_KEY=your_supabase_key \
  -e JWT_SECRET=your_jwt_secret \
  --restart unless-stopped \
  chatpdf:latest
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  chatpdf:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - COHERE_API_KEY=${COHERE_API_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/z"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ./logs:/app/logs
    
  # Optional: Add Redis for session storage
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

Run with:
```bash
docker-compose up -d
```

---

## ☁️ Cloud Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Railway Deployment

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically on push**

### Heroku Deployment

1. **Create `Procfile`**
   ```
   web: bun start
   ```

2. **Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   heroku config:set COHERE_API_KEY=your_key
   ```

### DigitalOcean App Platform

1. **Create `app.yaml`**
   ```yaml
   name: chatpdf
   services:
   - name: api
     source_dir: /
     github:
       repo: your-username/ChatPDF
       branch: main
     run_command: bun start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: COHERE_API_KEY
       value: ${COHERE_API_KEY}
     http_port: 3000
   ```

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Install Node.js and dependencies
   curl -fsSL https://bun.sh/install | bash
   git clone https://github.com/your-username/ChatPDF.git
   cd ChatPDF
   bun install --production
   ```

2. **Set up PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start index.js --name chatpdf
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
# Application
NODE_ENV=production
PORT=3000

# API Keys
COHERE_API_KEY=your_production_cohere_key
JWT_SECRET=your_strong_production_jwt_secret

# Database
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL=error
ENABLE_METRICS=true

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_TIMEOUT=300000

# Performance
COMPRESSION_LEVEL=6
KEEP_ALIVE_TIMEOUT=5000
```

### Staging Environment Variables

Create `.env.staging`:
```env
NODE_ENV=staging
PORT=3000
COHERE_API_KEY=your_staging_cohere_key
# ... other staging-specific values
```

---

## 🔒 Security Configuration

### SSL/TLS Certificate

#### Using Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### Security Headers
The application includes security headers via Helmet.js. For additional security:

```javascript
// Additional security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})
```

---

## 📊 Monitoring and Logging

### Health Monitoring

Set up monitoring for:
- Application uptime
- Response times
- Error rates
- Memory usage
- API rate limits

#### Example monitoring script:
```bash
#!/bin/bash
# monitor.sh

ENDPOINT="http://localhost:3000/z"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Service is healthy"
else
    echo "$(date): Service is down (HTTP $RESPONSE)"
    # Send alert (email, Slack, etc.)
fi
```

### Log Management

#### Using Winston for structured logging:
```javascript
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

#### Log Rotation with PM2:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'chatpdf',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    log_file: 'logs/combined.log',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
}
```

---

## ⚡ Performance Optimization

### Application Optimization

1. **Enable Compression**
   ```javascript
   import compression from 'compression'
   app.use(compression({ level: 6 }))
   ```

2. **Connection Pooling**
   ```javascript
   // For database connections
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   })
   ```

3. **Caching**
   ```javascript
   import NodeCache from 'node-cache'
   const cache = new NodeCache({ stdTTL: 600 })
   ```

### Server Optimization

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/chatpdf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File upload size
    client_max_body_size 10M;
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: oven-sh/setup-bun@v1
    - run: bun install
    - run: bun test
    - run: bun run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/ChatPDF
          git pull origin main
          bun install --production
          pm2 restart chatpdf
```

### Environment Secrets

Set these secrets in your repository:
- `HOST` - Your server IP
- `USERNAME` - SSH username
- `SSH_KEY` - Private SSH key
- `COHERE_API_KEY` - Cohere API key
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_KEY` - Supabase key
- `JWT_SECRET` - JWT secret

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

#### 2. Memory Issues
```bash
# Check memory usage
free -h

# Check Node.js process memory
ps aux | grep node
```

#### 3. File Upload Issues
```bash
# Check disk space
df -h

# Check file permissions
ls -la uploads/
```

#### 4. API Key Issues
```bash
# Test Cohere API
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.cohere.ai/v1/models"
```

### Debugging Production Issues

1. **Check logs**
   ```bash
   tail -f logs/error.log
   pm2 logs chatpdf
   ```

2. **Check system resources**
   ```bash
   htop
   iotop
   ```

3. **Test endpoints**
   ```bash
   curl -I http://localhost:3000/z
   ```

---

## 📦 Backup and Recovery

### Database Backup
```bash
# Backup Supabase data
pg_dump -h your-supabase-host -U postgres your_db > backup.sql

# Restore
psql -h your-supabase-host -U postgres your_db < backup.sql
```

### File Backup
```bash
# Backup uploaded files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Backup logs
tar -czf logs_backup_$(date +%Y%m%d).tar.gz logs/
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup files
tar -czf $BACKUP_DIR/chatpdf_$DATE.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  /path/to/ChatPDF

# Keep only last 7 days of backups
find $BACKUP_DIR -name "chatpdf_*.tar.gz" -mtime +7 -delete

echo "Backup completed: chatpdf_$DATE.tar.gz"
```

---

## 📞 Support

For deployment support:
- 📧 Email: ops@chatpdf.example.com
- 📖 Documentation: [docs.chatpdf.example.com](https://docs.chatpdf.example.com)
- 🎫 Support Portal: [support.chatpdf.example.com](https://support.chatpdf.example.com)

---

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure automated backups
3. Implement log rotation
4. Set up SSL certificates
5. Configure CDN (if needed)
6. Test disaster recovery procedures
7. Document runbook procedures

Congratulations on your ChatPDF deployment! 🚀