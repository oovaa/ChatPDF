# Development Guide

This guide covers setting up the ChatPDF development environment and contributing to the project.

## 🛠️ Development Setup

### Prerequisites

Before starting development, ensure you have:

- **Node.js** 18+ or **Bun** (recommended)
- **Git** for version control
- **Code Editor** (VS Code recommended with extensions below)
- **API Keys** for external services

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/oovaa/ChatPDF.git
   cd ChatPDF
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended for speed)
   bun install
   
   # Or using npm with legacy peer deps
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your development credentials:
   ```env
   # Required
   COHERE_API_KEY=your_cohere_api_key
   
   # Optional but recommended for full functionality
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_development_jwt_secret
   
   # Development settings
   NODE_ENV=development
   PORT=3000
   ```

4. **Start development server**
   ```bash
   bun run dev
   # or npm run dev
   ```

The server will start with auto-reload on file changes.

---

## 📁 Project Structure

```
ChatPDF/
├── index.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
├── .prettierrc              # Code formatting configuration
├── jsconfig.json            # JavaScript project configuration
├── 
├── src/                     # Source code
│   ├── Routes/              # API endpoint definitions
│   │   ├── index.js         # Route aggregation
│   │   ├── userAuth.js      # Authentication routes
│   │   ├── upload.js        # File upload handling
│   │   ├── messaging.js     # Chat functionality
│   │   └── admin.js         # Admin endpoints
│   │
│   ├── middleware/          # Express middleware
│   │   ├── logger.js        # Request/response logging
│   │   ├── authMiddleware.js # JWT authentication
│   │   └── multerMiddleWare.js # File upload handling
│   │
│   ├── models/              # AI model configurations
│   │   ├── Ecohere.js       # Cohere embeddings model
│   │   └── Ccohere.js       # Cohere chat model
│   │
│   ├── db/                  # Database and vector store
│   │   ├── index.js         # Supabase integration
│   │   ├── supabase.js      # Supabase client
│   │   ├── hnsw.js          # Vector database operations
│   │   └── retriver.js      # Document retrieval logic
│   │
│   └── utils/               # Utility functions
│       ├── auth.js          # Authentication helpers
│       ├── chains.js        # LangChain configurations
│       ├── chunker.js       # Document chunking
│       ├── fileProcessing.js # File parsing logic
│       ├── hash.js          # Password hashing
│       └── validate.js      # Input validation
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── CONTRIBUTION.md     # Contribution guidelines
│   ├── DEVELOPMENT.md      # This file
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── SECURITY.md         # Security guidelines
│
└── test.js                 # Test file
```

---

## 🔧 Development Commands

### Core Commands
```bash
# Start development server with auto-reload
bun run dev
npm run dev

# Start production server
bun start
npm start

# Format code with Prettier
bun run lint
npm run lint

# Run tests (when available)
bun test
npm test
```

### Useful Development Scripts

Add these to your `package.json` scripts for enhanced development:

```json
{
  "scripts": {
    "dev": "bun --watch index.js",
    "start": "bun index.js",
    "lint": "prettier --write *.js src/**/*.js",
    "lint:check": "prettier --check *.js src/**/*.js",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "dev:debug": "node --inspect index.js",
    "check": "bun run lint && bun test"
  }
}
```

---

## 🧪 Testing Strategy

### Unit Testing
Create tests for individual functions and utilities:

```javascript
// test/utils/validate.test.js
import { describe, it, expect } from 'bun:test'
import { validateEmail } from '../src/utils/validate.js'

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
```

### Integration Testing
Test API endpoints:

```javascript
// test/routes/upload.test.js
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import request from 'supertest'
import app from '../index.js'

describe('Upload Endpoint', () => {
  it('should upload PDF files successfully', async () => {
    const response = await request(app)
      .post('/api/v1/upload')
      .attach('file', 'test/fixtures/sample.pdf')
      .expect(200)
    
    expect(response.body.success).toBe(true)
  })
})
```

### Manual Testing
Use these curl commands for quick API testing:

```bash
# Health check
curl http://localhost:3000/z

# Upload file
curl -X POST \
  http://localhost:3000/api/v1/upload \
  -F "file=@test.pdf"

# Send chat message
curl -X POST \
  http://localhost:3000/api/v1/send \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

---

## 🐛 Debugging

### VS Code Debug Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug ChatPDF",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "bun"
    }
  ]
}
```

### Console Debugging
The application includes enhanced logging. Use these log levels:

```javascript
// In your code
console.log('ℹ️ Info message')
console.warn('⚠️ Warning message')
console.error('❌ Error message')
console.debug('🐛 Debug message')
```

### Environment-specific Debugging
```javascript
if (process.env.NODE_ENV === 'development') {
  console.debug('Development-only debug info')
}
```

---

## 🎨 Code Style Guidelines

### Prettier Configuration
The project uses Prettier for consistent formatting. Configuration in `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### JavaScript Style Guide

1. **Use ES6+ features**
   ```javascript
   // Good
   const { question, sessionId } = req.body
   const response = await chain.invoke({ question })
   
   // Avoid
   var question = req.body.question
   var sessionId = req.body.sessionId
   ```

2. **Descriptive variable names**
   ```javascript
   // Good
   const processingTime = Date.now() - startTime
   const userMessage = req.body.question
   
   // Avoid
   const t = Date.now() - s
   const msg = req.body.question
   ```

3. **Error handling**
   ```javascript
   // Good
   try {
     const result = await processDocument(file)
     return res.json({ success: true, result })
   } catch (error) {
     console.error('Document processing failed:', error)
     return res.status(500).json({
       error: 'Processing failed',
       message: 'Please try again or contact support'
     })
   }
   ```

4. **Async/await over Promises**
   ```javascript
   // Good
   const result = await fetchData()
   
   // Avoid
   fetchData().then(result => { /* ... */ })
   ```

---

## 🚀 Performance Optimization

### Memory Management
```javascript
// Monitor memory usage
const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`
const memoryData = process.memoryUsage()

console.log({
  rss: formatMemoryUsage(memoryData.rss),
  heapTotal: formatMemoryUsage(memoryData.heapTotal),
  heapUsed: formatMemoryUsage(memoryData.heapUsed)
})
```

### File Processing Optimization
```javascript
// Stream large files instead of loading into memory
import { createReadStream } from 'fs'

const processLargeFile = async (filePath) => {
  const stream = createReadStream(filePath)
  // Process in chunks
}
```

### Database Query Optimization
```javascript
// Use connection pooling
// Implement query caching
// Add database indexes for frequently queried fields
```

---

## 🔍 Code Quality Tools

### Pre-commit Hooks
Install husky for pre-commit hooks:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "bun run lint && bun test"
```

### Code Analysis
```bash
# Check for potential issues
npm audit

# Check bundle size (if applicable)
npm run build:analyze
```

---

## 📦 Dependency Management

### Adding Dependencies
```bash
# Production dependency
bun add package-name

# Development dependency
bun add -D package-name

# Update dependencies
bun update
```

### Security Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

---

## 🌍 Environment Management

### Development Environment
```env
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_CORS=true
```

### Staging Environment
```env
NODE_ENV=staging
LOG_LEVEL=info
ENABLE_CORS=false
```

### Production Environment
```env
NODE_ENV=production
LOG_LEVEL=error
ENABLE_CORS=false
```

---

## 📚 Learning Resources

### LangChain Documentation
- [LangChain Docs](https://docs.langchain.com/)
- [Vector Stores](https://docs.langchain.com/docs/modules/data_connection/vectorstores/)
- [Chains](https://docs.langchain.com/docs/modules/chains/)

### Cohere API
- [Cohere Documentation](https://docs.cohere.ai/)
- [Embeddings Guide](https://docs.cohere.ai/docs/embeddings)
- [Chat API](https://docs.cohere.ai/docs/chat-api)

### Express.js Best Practices
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Performance Tips](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## 🤝 Contributing Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Write code following style guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Changes**
   ```bash
   bun run lint
   bun test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   ```

---

## 📞 Development Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/oovaa/ChatPDF/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/oovaa/ChatPDF/discussions)
- **Email**: dev-support@chatpdf.example.com

---

## 🎯 Next Steps

After setting up your development environment:

1. Explore the codebase and understand the architecture
2. Set up debugging in your editor
3. Run the test suite
4. Make a small change and test it
5. Read the [API documentation](API.md)
6. Check out [open issues](https://github.com/oovaa/ChatPDF/issues) for contribution opportunities

Happy coding! 🚀