# Security Guidelines

This document outlines security best practices and guidelines for the ChatPDF application.

## 🔒 Security Overview

ChatPDF handles sensitive document data and user information. This guide covers:
- Authentication and authorization
- Data protection
- API security
- Infrastructure security
- Compliance considerations

---

## 🛡️ Authentication & Authorization

### JWT Security

#### Best Practices
- Use strong, random JWT secrets (minimum 256 bits)
- Implement token expiration (recommended: 1-24 hours)
- Use refresh tokens for longer sessions
- Store tokens securely on client side

#### Implementation
```javascript
// Generate secure JWT secret
import crypto from 'crypto'
const jwtSecret = crypto.randomBytes(64).toString('hex')

// JWT configuration
const jwtConfig = {
  expiresIn: '24h',
  algorithm: 'HS256',
  issuer: 'chatpdf-api',
  audience: 'chatpdf-client'
}

// Token validation middleware
const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, jwtConfig)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Password Security

#### Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Implementation
```javascript
import bcrypt from 'bcrypt'

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Password validation
const validatePassword = (password) => {
  const minLength = 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial
}
```

### Rate Limiting

#### API Rate Limits
```javascript
import rateLimit from 'express-rate-limit'

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true
})

// File upload rate limiting
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    error: 'Upload limit exceeded',
    retryAfter: '1 hour'
  }
})
```

---

## 🔐 Data Protection

### Input Validation

#### File Upload Security
```javascript
import multer from 'multer'
import path from 'path'

// Secure file upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Single file upload
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]
    
    // Allowed extensions
    const allowedExts = ['.pdf', '.docx', '.pptx', '.txt']
    const fileExt = path.extname(file.originalname).toLowerCase()
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(fileExt)) {
      cb(null, true)
    } else {
      cb(new Error('File type not allowed'), false)
    }
  }
})

// Additional file validation
const validateFileContent = async (fileBuffer, mimetype) => {
  // Check file signatures (magic numbers)
  const signatures = {
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'application/zip': [0x50, 0x4B, 0x03, 0x04], // PK.. (for docx/pptx)
  }
  
  // Implement signature validation
  // Scan for malicious content
  // Validate file structure
}
```

#### Input Sanitization
```javascript
import validator from 'validator'
import DOMPurify from 'isomorphic-dompurify'

// Sanitize user inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  // Remove HTML tags and scripts
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
  
  // Escape special characters
  return validator.escape(cleaned)
}

// Validate email addresses
const validateEmail = (email) => {
  return validator.isEmail(email) && email.length <= 254
}

// Validate and sanitize questions
const validateQuestion = (question) => {
  if (!question || typeof question !== 'string') {
    throw new Error('Question must be a non-empty string')
  }
  
  const sanitized = sanitizeInput(question.trim())
  
  if (sanitized.length === 0 || sanitized.length > 1000) {
    throw new Error('Question must be between 1 and 1000 characters')
  }
  
  return sanitized
}
```

### Data Encryption

#### Encryption at Rest
```javascript
import crypto from 'crypto'

// Encrypt sensitive data before storage
const encrypt = (text, key) => {
  const algorithm = 'aes-256-gcm'
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(algorithm, key)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

// Decrypt sensitive data
const decrypt = (encryptedData, key) => {
  const algorithm = 'aes-256-gcm'
  const decipher = crypto.createDecipher(algorithm, key)
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

#### Encryption in Transit
```javascript
// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  // Use modern TLS versions only
  secureProtocol: 'TLSv1_2_method',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384'
  ].join(':'),
  honorCipherOrder: true
}
```

---

## 🌐 API Security

### Security Headers

#### Helmet.js Configuration
```javascript
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.cohere.ai"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

### CORS Configuration

```javascript
import cors from 'cors'

// Production CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}

app.use(cors(corsOptions))
```

### Request Validation

```javascript
// Input validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      })
    }
    
    req.body = value
    next()
  }
}

// Request size limiting
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // Additional request verification
    req.rawBody = buf
  }
}))
```

---

## 🏗️ Infrastructure Security

### Environment Variables

#### Secure Configuration
```bash
# .env.production
NODE_ENV=production

# Use strong, unique secrets
JWT_SECRET=your_256_bit_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# API keys (rotate regularly)
COHERE_API_KEY=your_cohere_api_key

# Database (use SSL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key

# Security settings
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# SSL/TLS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Docker Security

#### Secure Dockerfile
```dockerfile
FROM oven/bun:1-alpine AS base

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S chatpdf -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production && \
    rm -rf /root/.bun/cache

# Copy source code
COPY --chown=chatpdf:nodejs . .

# Remove unnecessary files
RUN rm -rf .git .github docs tests *.md

# Switch to non-root user
USER chatpdf

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/z || exit 1

# Start application
CMD ["bun", "start"]
```

### Server Hardening

#### Linux Security
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Security Monitoring

### Logging Security Events

```javascript
import winston from 'winston'

// Security event logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' })
  ]
})

// Log security events
const logSecurityEvent = (event, details) => {
  securityLogger.info({
    event,
    timestamp: new Date().toISOString(),
    ip: details.ip,
    userAgent: details.userAgent,
    userId: details.userId,
    details: details.data
  })
}

// Authentication middleware with logging
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      logSecurityEvent('AUTH_FAILURE', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        reason: 'No token provided'
      })
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    
    logSecurityEvent('AUTH_SUCCESS', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: decoded.id
    })
    
    next()
  } catch (error) {
    logSecurityEvent('AUTH_FAILURE', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      reason: error.message
    })
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Intrusion Detection

```javascript
// Suspicious activity detection
const suspiciousActivityDetector = {
  // Track failed login attempts
  failedAttempts: new Map(),
  
  // Track IP addresses
  ipAddresses: new Map(),
  
  checkSuspiciousActivity: (req) => {
    const ip = req.ip
    const now = Date.now()
    
    // Check for too many requests from single IP
    const ipData = this.ipAddresses.get(ip) || { count: 0, firstSeen: now }
    ipData.count++
    
    if (ipData.count > 100 && (now - ipData.firstSeen) < 3600000) { // 100 requests in 1 hour
      logSecurityEvent('SUSPICIOUS_ACTIVITY', {
        ip,
        reason: 'High request rate',
        count: ipData.count,
        timeWindow: now - ipData.firstSeen
      })
      return true
    }
    
    this.ipAddresses.set(ip, ipData)
    return false
  },
  
  recordFailedLogin: (ip) => {
    const attempts = this.failedAttempts.get(ip) || 0
    this.failedAttempts.set(ip, attempts + 1)
    
    if (attempts >= 5) {
      logSecurityEvent('BRUTE_FORCE_ATTEMPT', {
        ip,
        attempts: attempts + 1
      })
    }
  }
}
```

---

## 🔍 Vulnerability Management

### Security Scanning

#### Dependency Scanning
```bash
# Check for known vulnerabilities
npm audit

# Fix automatically (when possible)
npm audit fix

# Use Snyk for advanced scanning
npm install -g snyk
snyk test
snyk monitor
```

#### Code Security Analysis
```bash
# Static analysis with ESLint security plugin
npm install eslint-plugin-security --save-dev

# .eslintrc.js
module.exports = {
  plugins: ['security'],
  extends: ['plugin:security/recommended']
}

# Run security linting
npx eslint --ext .js src/
```

### Security Testing

#### Penetration Testing Checklist
- [ ] SQL injection testing
- [ ] XSS vulnerability testing
- [ ] CSRF protection testing
- [ ] Authentication bypass testing
- [ ] Authorization testing
- [ ] File upload security testing
- [ ] Rate limiting testing
- [ ] SSL/TLS configuration testing

#### Automated Security Testing
```javascript
// Security test examples
describe('Security Tests', () => {
  test('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --"
    const response = await request(app)
      .post('/api/v1/signin')
      .send({ login: maliciousInput, password: 'test' })
    
    expect(response.status).toBe(400)
  })
  
  test('should validate file uploads', async () => {
    const response = await request(app)
      .post('/api/v1/upload')
      .attach('file', Buffer.from('malicious content'), 'test.exe')
    
    expect(response.status).toBe(400)
    expect(response.body.error).toContain('File type not allowed')
  })
})
```

---

## 📋 Compliance & Standards

### Data Privacy (GDPR/CCPA)

#### User Data Handling
```javascript
// Data retention policy
const dataRetentionPolicy = {
  userSessions: 24 * 60 * 60 * 1000, // 24 hours
  uploadedFiles: 30 * 24 * 60 * 60 * 1000, // 30 days
  conversationHistory: 7 * 24 * 60 * 60 * 1000, // 7 days
  logs: 90 * 24 * 60 * 60 * 1000 // 90 days
}

// Data deletion
const deleteUserData = async (userId) => {
  // Delete user files
  await deleteUserFiles(userId)
  
  // Delete conversation history
  await deleteConversationHistory(userId)
  
  // Anonymize logs
  await anonymizeLogs(userId)
  
  // Delete user account
  await deleteUserAccount(userId)
}

// Privacy-first logging
const privacyLog = (message, data) => {
  // Remove PII from logs
  const sanitizedData = { ...data }
  delete sanitizedData.email
  delete sanitizedData.name
  delete sanitizedData.phone
  
  logger.info(message, sanitizedData)
}
```

### Security Standards

#### OWASP Top 10 Compliance
1. **Injection** - Input validation and parameterized queries
2. **Broken Authentication** - Strong JWT implementation
3. **Sensitive Data Exposure** - Encryption and secure headers
4. **XML External Entities** - Disabled XML processing
5. **Broken Access Control** - Proper authorization checks
6. **Security Misconfiguration** - Secure defaults and headers
7. **Cross-Site Scripting** - Input sanitization and CSP
8. **Insecure Deserialization** - Safe JSON parsing
9. **Known Vulnerabilities** - Regular dependency updates
10. **Insufficient Logging** - Comprehensive security logging

---

## 🚨 Incident Response

### Security Incident Playbook

#### 1. Detection
- Monitor security logs
- Set up alerts for suspicious activity
- Regular security scans

#### 2. Containment
```bash
# Immediate response steps
# 1. Isolate affected systems
sudo ufw deny from suspicious_ip

# 2. Preserve evidence
sudo tar -czf incident_logs_$(date +%Y%m%d_%H%M%S).tar.gz /var/log/

# 3. Stop the attack
pm2 stop chatpdf  # If necessary
```

#### 3. Investigation
- Analyze logs
- Determine scope of breach
- Identify attack vectors

#### 4. Recovery
- Patch vulnerabilities
- Restore from clean backups
- Update security measures

#### 5. Lessons Learned
- Document incident
- Update security procedures
- Improve monitoring

---

## 📞 Security Contact

For security-related issues:
- 🔒 **Security Email**: security@chatpdf.example.com
- 🐛 **Vulnerability Reports**: [Responsible Disclosure Policy](SECURITY.md)
- 🚨 **Emergency Contact**: +1-XXX-XXX-XXXX

### Responsible Disclosure

If you discover a security vulnerability:
1. **DO NOT** publicly disclose the vulnerability
2. Send details to security@chatpdf.example.com
3. Include steps to reproduce the issue
4. Allow reasonable time for response and fix
5. We will acknowledge and work with you on resolution

---

Remember: Security is everyone's responsibility. Stay vigilant, keep dependencies updated, and follow security best practices at all times.