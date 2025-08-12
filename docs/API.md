# ChatPDF API Documentation

## Overview

The ChatPDF API provides endpoints for document upload, processing, and intelligent chat interactions. This REST API allows you to upload documents in various formats and chat with them using natural language.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

ChatPDF uses JWT-based authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 🔐 Authentication

#### Register User
Creates a new user account.

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Validation error (missing fields, weak password)
- `409` - User already exists

---

#### Login User
Authenticates an existing user.

**Endpoint:** `POST /signin`

**Request Body:**
```json
{
  "login": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Invalid request format
- `401` - Invalid credentials
- `404` - User not found

---

### 📄 Document Management

#### Upload Document
Uploads and processes a document for chat interaction.

**Endpoint:** `POST /upload`

**Request:**
```http
POST /upload
Content-Type: multipart/form-data

file: <binary file data>
```

**Supported Formats:**
- PDF (`.pdf`)
- Word Documents (`.docx`)
- PowerPoint Presentations (`.pptx`)
- Text Files (`.txt`)

**File Size Limit:** 10MB

**Response (200):**
```json
{
  "success": true,
  "file": {
    "name": "document.pdf",
    "type": "PDF",
    "size": "2.5MB",
    "mimetype": "application/pdf"
  },
  "message": "File 'document.pdf' successfully processed and stored in vector database",
  "metadata": {
    "processingTime": "1250ms",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "status": "indexed"
  }
}
```

**Error Responses:**
- `400` - No file uploaded, unsupported format, or file too large
- `408` - Processing timeout
- `500` - Server processing error
- `507` - Insufficient storage space

**Example Upload using curl:**
```bash
curl -X POST \
  http://localhost:3000/api/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

---

#### Upload Health Check
Checks the status of the upload service.

**Endpoint:** `GET /upload/health`

**Response (200):**
```json
{
  "status": "healthy",
  "service": "upload",
  "supportedFormats": ["PDF", "DOCX", "PPTX", "TXT"],
  "maxFileSize": "10MB",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 💬 Chat Interface

#### Send Message
Sends a question and receives an AI-generated response based on uploaded documents.

**Endpoint:** `POST /send`

**Request Body:**
```json
{
  "question": "What is the main topic discussed in the document?",
  "sessionId": "user123_session1",
  "noDoc": false
}
```

**Parameters:**
- `question` (string, required): The question to ask
- `sessionId` (string, optional): Session identifier for conversation history
- `noDoc` (boolean, optional): If true, answers using general knowledge instead of documents

**Response (200):**
```json
{
  "answer": "The document primarily discusses the implementation of machine learning algorithms for natural language processing, focusing on transformer architectures and their applications in text generation.",
  "metadata": {
    "responseTime": "850ms",
    "sessionId": "user123_session1",
    "chainType": "document_aware",
    "timestamp": "2024-01-15T10:31:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing or invalid question
- `429` - Rate limit exceeded
- `500` - Processing error
- `503` - Service unavailable (API key issues)

**Example Chat using curl:**
```bash
curl -X POST \
  http://localhost:3000/api/v1/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "question": "What are the key findings?",
    "sessionId": "my_session"
  }'
```

---

#### Chat Health Check
Checks the status of the messaging service.

**Endpoint:** `GET /send/health`

**Response (200):**
```json
{
  "status": "healthy",
  "service": "messaging",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "activeSessions": 5
}
```

---

### 🏥 System Health

#### Global Health Check
Provides overall system status and metrics.

**Endpoint:** `GET /z`

**Response (200):**
```json
{
  "status": "healthy",
  "message": "ChatPDF API is running smoothly",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": 45.2,
    "total": 128.0,
    "unit": "MB"
  },
  "environment": "development"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Brief error description",
  "message": "Detailed user-friendly message",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "details": "Technical details (development only)",
  "suggestion": "Helpful suggestion for resolution"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `408` - Request Timeout (processing timeout)
- `413` - Payload Too Large (file size exceeded)
- `415` - Unsupported Media Type (invalid file format)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (external API issues)
- `507` - Insufficient Storage

---

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- **Authentication endpoints:** 5 requests per minute per IP
- **Upload endpoint:** 10 requests per hour per user
- **Chat endpoint:** 60 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642248600
```

---

## Best Practices

### 1. File Upload Optimization
- Compress files before upload when possible
- Use appropriate file formats (PDF preferred for text documents)
- Ensure files are not corrupted

### 2. Chat Efficiency
- Use session IDs to maintain conversation context
- Ask specific questions for better responses
- Use `noDoc: true` for general knowledge questions

### 3. Error Handling
- Always check response status codes
- Implement retry logic for 5xx errors
- Handle rate limiting gracefully

### 4. Security
- Never expose JWT tokens in client-side code
- Use HTTPS in production
- Validate file uploads on client side

---

## SDKs and Examples

### JavaScript/Node.js Example
```javascript
const ChatPDFClient = require('./chatpdf-client');

const client = new ChatPDFClient({
  baseURL: 'http://localhost:3000/api/v1',
  token: 'your_jwt_token'
});

// Upload document
const uploadResult = await client.upload('./document.pdf');
console.log('Upload successful:', uploadResult.success);

// Chat with document
const response = await client.chat({
  question: 'What is this document about?',
  sessionId: 'my_session'
});
console.log('AI Response:', response.answer);
```

### Python Example
```python
import requests

class ChatPDFClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def upload(self, file_path):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f'{self.base_url}/upload',
                files=files,
                headers=self.headers
            )
        return response.json()
    
    def chat(self, question, session_id=None):
        data = {'question': question}
        if session_id:
            data['sessionId'] = session_id
        
        response = requests.post(
            f'{self.base_url}/send',
            json=data,
            headers=self.headers
        )
        return response.json()

# Usage
client = ChatPDFClient('http://localhost:3000/api/v1', 'your_token')
result = client.chat('What are the key points in this document?')
print(result['answer'])
```

---

## Webhooks (Coming Soon)

Future versions will support webhooks for:
- Document processing completion
- Chat response notifications
- System health alerts

---

## Support

For API support and questions:
- 📧 Email: api-support@chatpdf.example.com
- 📖 Documentation: [https://docs.chatpdf.example.com](https://docs.chatpdf.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/oovaa/ChatPDF/issues)