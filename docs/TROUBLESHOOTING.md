# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with ChatPDF.

## 🚨 Quick Fixes

### Server Won't Start
```bash
# Check if port is in use
lsof -ti:3000
kill -9 $(lsof -ti:3000)

# Check environment variables
node -e "console.log(process.env.COHERE_API_KEY ? 'API key set' : 'API key missing')"

# Check Node.js version
node --version  # Should be 18+
```

### Memory Issues
```bash
# Check memory usage
free -h
ps aux | grep node | head -5

# Restart with memory monitoring
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### File Upload Fails
```bash
# Check disk space
df -h

# Check file permissions
ls -la uploads/
chmod 755 uploads/
```

---

## 🔍 Common Issues

### 1. API Key Issues

#### Symptoms
- `Error: COHERE_API_KEY must be set`
- `401 Unauthorized` responses from Cohere
- Chat responses failing

#### Solutions
```bash
# Check environment file
cat .env.local | grep COHERE

# Test API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.cohere.ai/v1/models"

# Verify key format
echo $COHERE_API_KEY | wc -c  # Should be ~40 characters
```

#### Validation Script
```javascript
// test-api-key.js
import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
})

try {
  const response = await cohere.models.list()
  console.log('✅ API key is valid')
  console.log('Available models:', response.models.length)
} catch (error) {
  console.error('❌ API key error:', error.message)
}
```

### 2. Database Connection Issues

#### Symptoms
- User authentication failing
- `Connection refused` errors
- Supabase-related errors

#### Solutions
```bash
# Test Supabase connection
curl -H "apikey: YOUR_SUPABASE_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/"

# Check environment variables
echo "URL: $SUPABASE_URL"
echo "Key: ${SUPABASE_KEY:0:10}..."
```

#### Connection Test
```javascript
// test-supabase.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

try {
  const { data, error } = await supabase
    .from('users')
    .select('count(*)')
    .limit(1)
  
  if (error) throw error
  console.log('✅ Database connection successful')
} catch (error) {
  console.error('❌ Database error:', error.message)
}
```

### 3. File Processing Errors

#### Symptoms
- Upload hangs or times out
- `File processing failed` errors
- Memory errors during upload

#### Solutions
```bash
# Check file size
ls -lh your-file.pdf

# Test with smaller file
dd if=/dev/zero of=test.txt bs=1M count=1

# Check available memory
free -h
```

#### File Validation
```javascript
// test-file-processing.js
import { StoreFileInVDB } from './src/db/hnsw.js'

const testFile = async () => {
  try {
    await StoreFileInVDB('./test.txt')
    console.log('✅ File processing works')
  } catch (error) {
    console.error('❌ File processing error:', error.message)
  }
}
```

### 4. JWT Token Issues

#### Symptoms
- `Invalid token` errors
- Authentication randomly failing
- Token expired messages

#### Solutions
```bash
# Check JWT secret
echo $JWT_SECRET | wc -c  # Should be 32+ characters

# Decode JWT token (without verification)
node -e "
const token = 'YOUR_JWT_TOKEN'
const [header, payload] = token.split('.').map(part => 
  JSON.parse(Buffer.from(part, 'base64').toString())
)
console.log('Header:', header)
console.log('Payload:', payload)
console.log('Expires:', new Date(payload.exp * 1000))
"
```

### 5. CORS Issues

#### Symptoms
- Browser console shows CORS errors
- `Access-Control-Allow-Origin` errors
- Preflight request failures

#### Solutions
```javascript
// Check CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log('Request origin:', origin)
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
    console.log('Allowed origins:', allowedOrigins)
    callback(null, true) // Temporarily allow all
  }
}
```

### 6. Vector Database Issues

#### Symptoms
- Chat responses are irrelevant
- `VDB not initialized` errors
- Search returning no results

#### Solutions
```javascript
// Reset vector database
import { VDB } from './src/db/hnsw.js'

const resetVDB = async () => {
  // Clear existing data
  VDB.clear()
  console.log('✅ Vector database reset')
}

// Check VDB status
const checkVDB = async () => {
  const count = VDB.index.getCurrentCount()
  console.log('Documents in VDB:', count)
}
```

---

## 🐛 Debug Mode

### Enable Debug Logging
```bash
# Set debug environment
export DEBUG=chatpdf:*
export NODE_ENV=development
export LOG_LEVEL=debug

# Start with verbose logging
npm start
```

### Custom Debug Middleware
```javascript
// Debug middleware
const debugMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Debug Info:')
    console.log('- Method:', req.method)
    console.log('- URL:', req.url)
    console.log('- Headers:', JSON.stringify(req.headers, null, 2))
    console.log('- Body:', JSON.stringify(req.body, null, 2))
    console.log('- Query:', JSON.stringify(req.query, null, 2))
    console.log('---')
  }
  next()
}

app.use(debugMiddleware)
```

---

## 📊 Performance Issues

### High Memory Usage

#### Diagnosis
```bash
# Monitor memory usage
watch -n 1 'ps aux | grep node'

# Node.js memory profiling
node --inspect index.js
# Open chrome://inspect in Chrome
```

#### Solutions
```javascript
// Memory optimization
process.on('warning', (warning) => {
  console.warn('Memory warning:', warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})

// Garbage collection monitoring
if (global.gc) {
  setInterval(() => {
    global.gc()
    const usage = process.memoryUsage()
    console.log('Memory usage:', {
      rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB'
    })
  }, 30000)
}
```

### Slow Response Times

#### Diagnosis
```javascript
// Response time monitoring
const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    if (duration > 5000) { // Log slow requests
      console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`)
    }
  })
  
  next()
}
```

#### Solutions
```javascript
// Implement caching
const cache = new Map()

const getCachedResponse = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data
  }
  return null
}

const setCachedResponse = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}
```

---

## 🔧 Development Issues

### Hot Reload Not Working

#### Solutions
```bash
# Check file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Use nodemon alternative
npm install -g bun
bun --watch index.js
```

### Import/Export Issues

#### ES Modules Configuration
```json
// package.json
{
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Common Import Fixes
```javascript
// Add .js extensions
import { helper } from './utils/helper.js'

// Use import.meta for __dirname equivalent
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

### Dependency Conflicts

#### Solutions
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps

# Check for conflicts
npm ls --depth=0
npm audit
```

---

## 🚨 Production Issues

### Server Crashes

#### Diagnosis
```bash
# Check system logs
sudo journalctl -u your-service -f

# Check PM2 logs
pm2 logs chatpdf

# Check for core dumps
ls -la /var/crash/
```

#### Solutions
```javascript
// Graceful error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Log to file/service
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Log to file/service
})

// Health check improvements
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: Date.now(),
    status: 'ok'
  }
  
  try {
    // Add additional health checks
    // - Database connectivity
    // - External API status
    // - File system access
    res.status(200).json(health)
  } catch (error) {
    health.status = 'error'
    health.error = error.message
    res.status(503).json(health)
  }
})
```

### High CPU Usage

#### Diagnosis
```bash
# Check CPU usage
top -p $(pgrep node)
htop

# Profile with clinic.js
npm install -g clinic
clinic doctor -- node index.js
```

#### Solutions
```javascript
// CPU optimization
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  // Worker process
  require('./index.js')
}
```

---

## 📋 Diagnostic Tools

### Health Check Script
```bash
#!/bin/bash
# health-check.sh

echo "🏥 ChatPDF Health Check"
echo "======================="

# Check server
echo "Checking server..."
if curl -f http://localhost:3000/z > /dev/null 2>&1; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
fi

# Check memory
echo "Checking memory..."
MEMORY=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100)}')
echo "Memory usage: ${MEMORY}%"

# Check disk space
echo "Checking disk space..."
DISK=$(df / | grep -vE '^Filesystem' | awk '{print $5}' | sed 's/%//g')
echo "Disk usage: ${DISK}%"

# Check processes
echo "Checking processes..."
if pgrep -f "node.*index.js" > /dev/null; then
    echo "✅ Node.js process running"
else
    echo "❌ Node.js process not found"
fi

echo "======================="
```

### Log Analysis Script
```bash
#!/bin/bash
# analyze-logs.sh

echo "📊 Log Analysis"
echo "==============="

# Error count
ERROR_COUNT=$(grep -c "ERROR\|Error\|error" logs/combined.log)
echo "Total errors: $ERROR_COUNT"

# Recent errors
echo "Recent errors:"
grep "ERROR\|Error\|error" logs/combined.log | tail -5

# Request statistics
echo "Request statistics:"
grep "POST\|GET\|PUT\|DELETE" logs/combined.log | \
  awk '{print $1}' | sort | uniq -c | sort -nr

echo "==============="
```

### Environment Validation
```javascript
// validate-env.js
const requiredEnvVars = [
  'COHERE_API_KEY',
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_KEY'
]

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'ALLOWED_ORIGINS'
]

console.log('🔍 Environment Validation')
console.log('=========================')

// Check required variables
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  if (value) {
    console.log(`✅ ${envVar}: Set (${value.length} chars)`)
  } else {
    console.log(`❌ ${envVar}: Missing`)
  }
})

// Check optional variables
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  if (value) {
    console.log(`ℹ️ ${envVar}: ${value}`)
  } else {
    console.log(`⚠️ ${envVar}: Not set (using default)`)
  }
})

console.log('=========================')
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check the logs**
   ```bash
   tail -f logs/error.log
   pm2 logs chatpdf
   ```

2. **Verify environment**
   ```bash
   node validate-env.js
   ```

3. **Run health check**
   ```bash
   ./health-check.sh
   ```

4. **Test individual components**
   ```bash
   node test-api-key.js
   node test-supabase.js
   ```

### Support Channels

- 📖 **Documentation**: [docs/](.)
- 🐛 **GitHub Issues**: [Report bugs](https://github.com/oovaa/ChatPDF/issues)
- 💬 **Discussions**: [Ask questions](https://github.com/oovaa/ChatPDF/discussions)
- 📧 **Email**: support@chatpdf.example.com

### When Reporting Issues

Include this information:
```bash
# System info
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Memory: $(free -h | grep Mem)"
echo "Disk: $(df -h | grep '/$')"

# Application info
echo "Environment: $(cat .env.local | grep NODE_ENV)"
echo "Last 10 log entries:"
tail -10 logs/error.log
```

---

## 🎯 Prevention Tips

### Regular Maintenance

```bash
# Weekly maintenance script
#!/bin/bash

# Update dependencies
npm audit fix

# Clear logs older than 30 days
find logs/ -name "*.log" -mtime +30 -delete

# Restart application
pm2 restart chatpdf

# Run health check
./health-check.sh
```

### Monitoring Setup

```javascript
// Simple monitoring
setInterval(() => {
  const usage = process.memoryUsage()
  const memoryMB = Math.round(usage.heapUsed / 1024 / 1024)
  
  if (memoryMB > 500) { // Alert if > 500MB
    console.warn(`High memory usage: ${memoryMB}MB`)
    // Send alert to monitoring service
  }
}, 60000) // Check every minute
```

Remember: Prevention is better than cure. Regular monitoring and maintenance can prevent most issues from occurring in production.