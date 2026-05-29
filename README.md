
# ChatPDF

ChatPDF is a modern, secure, and scalable platform for interacting with documents (PDF, DOCX, PPTX, TXT) via a conversational chat interface. Built with Bun, Express, LangChain, Cohere, and Supabase, it enables users to upload files, extract information, and chat with document content using advanced language models and vector search.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Conversational Document Search:** Chat with your documents using natural language.
- **Multi-format Support:** Upload and process PDF, DOCX, PPTX, and TXT files.
- **Vector Database:** Fast semantic search using HNSWLib and Cohere embeddings.
- **RESTful API:** Well-structured endpoints for file upload and chat.
- **Scalable Backend:** Built with Bun and Express for performance and reliability.
- **Extensible:** Modular codebase for easy feature addition and maintenance.

---

## Architecture

- **Express Server:** Handles routing, middleware, and API endpoints.
- **File Upload:** Multer middleware for in-memory file uploads.
- **Document Processing:** LangChain loaders for parsing and chunking documents.
- **Vector Search:** HNSWLib and Cohere for semantic search and retrieval.
- **Database:** Supabase for user data and persistence.
- **Chat Engine:** LangChain chains for conversational Q&A with context/history.

```
index.js
├── src/
│   ├── db/           # Vector DB, Supabase integration
│   ├── middleware/   # Logging, file upload
│   ├── models/       # Cohere LLM and embeddings
│   ├── Routes/       # API endpoints
│   └── utils/        # Chunking, file processing, chains
```

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oovaa/ChatPDF.git
   cd ChatPDF
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and set:
   ```
   COHERE_API_KEY=your_cohere_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

---

## Usage

Start the server:
```bash
bun start
```
The API will be available at `http://localhost:3000/api/v1/`.

---

## API Reference

### File Upload

- **POST `/api/v1/upload`**
  - Upload a document (PDF, DOCX, PPTX, TXT).
  - Form-data: `file` field.
  - Response: `{ "file": "<filename>", "sucessMsg": "file <filename> stored in the vector db" }`

### Chat

- **POST `/api/v1/send`**
  - Ask questions about uploaded documents.
  - Request: `{ "question": "What is the content of the PDF?", "noDoc": true }`
  - Response: `{ "answer": "..." }`
  - Set `noDoc: true` to chat without document context.

### Health Check

- **GET `/z`**
  - Response: `all good`

---

## Environment Variables

- `COHERE_API_KEY`: API key for Cohere embeddings and LLM (required).
- `SUPABASE_URL`: Supabase project URL (required).
- `SUPABASE_KEY`: Supabase anon key (required).

---

## Models

| Component | Model | Provider |
|-----------|-------|----------|
| LLM | `command-a-03-2025` | Cohere |
| Embeddings | `embed-english-v3.0` | Cohere |

---

## Contributing

See [Contributing.md](Contributing.md) for guidelines. We welcome bug reports, feature requests, code, and documentation contributions.

---

## License

MIT License. See [LICENSE](LICENSE).
