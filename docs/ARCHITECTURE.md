# Architecture Overview

ChatPDF is designed for scalable, secure, and efficient document-based conversational AI. Below is an overview of its main architectural components and their interactions.

---

## High-Level Diagram

```
User
  |
  v
[Express Server]
  |
  +--[Authentication Middleware (Clerk/JWT)]
  |
  +--[Routes]
        |
        +-- /upload  --> [Multer Middleware] --> [File Processing] --> [Vector DB]
        |
        +-- /send    --> [LangChain Chains]  --> [Vector Search] --> [LLM]
        |
        +-- /signin, /signup --> [Supabase DB]
```

---

## Components

### 1. Express Server
- Handles HTTP requests, routing, and middleware.
- Entry point: `index.js`

### 2. Authentication
- Clerk for session management and JWT for API security.
- Middleware in `src/middleware/`.

### 3. File Upload & Processing
- Multer for in-memory file uploads.
- Supported formats: PDF, DOCX, PPTX, TXT.
- File parsing and chunking via LangChain loaders and text splitters.

### 4. Vector Database
- HNSWLib for fast semantic search.
- Cohere embeddings for document representation.
- Vector DB initialized and updated in `src/db/hnsw.js`.

### 5. Chat Engine
- LangChain chains for conversational Q&A.
- Context/history-aware responses.
- Main logic in `src/utils/chains.js` and `src/Routes/messaging.js`.

### 6. Database
- Supabase for user data and persistence.
- User management in `src/db/index.js`.

---

## Directory Structure

```
index.js
├── src/
│   ├── db/           # Vector DB, Supabase integration
│   ├── middleware/   # Auth, logging, file upload
│   ├── models/       # Cohere LLM and embeddings
│   ├── Routes/       # API endpoints
│   └── utils/        # Auth, chunking, file processing, validation
```

---

## Data Flow Example

1. **User uploads a file** via `/api/v1/upload`.
2. **Multer** processes the file in memory.
3. **File is parsed and chunked** using LangChain loaders and splitters.
4. **Chunks are embedded** with Cohere and stored in HNSWLib vector DB.
5. **User sends a chat message** via `/api/v1/send`.
6. **LangChain chains** retrieve relevant chunks and generate a response using the LLM.

---

## Extensibility
- Modular design allows easy addition of new file types, models, or endpoints.
- Environment variables for configuration.
- Prettier and strict linting for code quality.

---

For more details, see the source code and [README.md].
