
# ChatPDF

ChatPDF is a modern, secure, and scalable platform for interacting with documents (PDF, DOCX, PPTX, TXT) via a conversational chat interface. Built with Bun, Express, LangChain, Cohere, Supabase, and Clerk authentication, it enables users to upload files, extract information, and chat with document content using advanced language models and vector search.

---

## Table of Contents

- [ChatPDF](#chatpdf)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [Authentication](#authentication)
    - [File Upload](#file-upload)
    - [Chat](#chat)
    - [Health Check](#health-check)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Acknowledgements](#acknowledgements)
  - [Endpoints](#endpoints)
    - [Authentication](#authentication-1)
    - [File Upload](#file-upload-1)
    - [Chat](#chat-1)
    - [Health Check](#health-check-1)
  - [Contributing](#contributing-1)
  - [Contact](#contact-1)
  - [Acknowledgements](#acknowledgements-1)

---

## Features

- **Conversational Document Search:** Chat with your documents using natural language.
- **Multi-format Support:** Upload and process PDF, DOCX, PPTX, and TXT files.
- **Vector Database:** Fast semantic search using HNSWLib and Cohere embeddings.
- **User Authentication:** Secure JWT-based authentication and Clerk integration.
- **RESTful API:** Well-structured endpoints for authentication, file upload, and chat.
- **Scalable Backend:** Built with Bun and Express for performance and reliability.
- **Extensible:** Modular codebase for easy feature addition and maintenance.

---

## Architecture

- **Express Server:** Handles routing, middleware, and API endpoints.
- **Authentication:** JWT and Clerk for user management and security.
- **File Upload:** Multer middleware for in-memory file uploads.
- **Document Processing:** LangChain loaders for parsing and chunking documents.
- **Vector Search:** HNSWLib and Cohere for semantic search and retrieval.
- **Database:** Supabase for user data and persistence.
- **Chat Engine:** LangChain chains for conversational Q&A with context/history.

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

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oovaa/ChatPDF.git
   cd ChatPDF
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and set:
   ```
   COHERE_API_KEY=your_cohere_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   ```

---

## Usage

Start the server:
```bash
bun start
# or
npm start
```
The API will be available at `http://localhost:3000/api/v1/`.

---

## API Reference

### Authentication

- **POST `/api/v1/signin`**
  - Sign in with username or email and password.
  - Request: `{ "login": "user@example.com", "password": "password123" }`
  - Response: `{ "user": { ... }, "token": "jwt_token" }`

- **POST `/api/v1/signup`**
  - Register a new user.
  - Request: `{ "username": "user", "email": "user@example.com", "password": "password123" }`
  - Response: `{ "user": { ... }, "token": "jwt_token" }`

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

### Health Check

- **GET `/z`**
  - Response: `all good`

---

## Environment Variables

- `COHERE_API_KEY`: API key for Cohere embeddings and LLM.
- `SUPABASE_URL`, `SUPABASE_KEY`: Supabase database credentials.
- `JWT_SECRET`: Secret for JWT authentication.

---

## Contributing

See [Contributing.md](Contributing.md) for guidelines. We welcome bug reports, feature requests, code, and documentation contributions.

---

## License

MIT License. See [LICENSE](LICENSE).

---

## Contact

For inquiries, contact the maintainers via [email@example.com](mailto:email@example.com).

---

## Acknowledgements

- Bun, LangChain, Cohere, Supabase, Clerk, and all contributors.


## Endpoints

### Authentication

- **POST /signin**
    - Description: Sign in a user.
    - Request Body: `{ "login": "user@example.com", "password": "password123" }`
    - Response: `{ "user": { "username": "user", "email": "user@example.com" }, "token": "jwt_token" }`
    - Error Response: `{ "error": "no user with this data" }` or `{ "error": "invalid credentials" }`

- **POST /signup**
    - Description: Sign up a new user.
    - Request Body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`
    - Response: `{ "token": "jwt_token" }`
    - Error Response: `{ "error": "user already exists" }`

### File Upload

- **POST /upload**
    - Description: Upload a file to be processed.
    - Request Body: Form-data with a file field named `file`.
    - Response: `{ "file": "<filename>", "sucessMsg": "file <filename> stored in the vector db" }`
    - Error Response: `{ "error": "An error occurred while uploading the file: <error_message>" }`


### Chat

- **POST /send**
    - Description: Send a question to the chat interface.
    - Request Body: `{ "question": "What is the content of the PDF?", "noDoc": true }`
    - Response: `{ "answer": "The content of the PDF is..." }`

### Health Check

- **GET /z**
    - Description: Check if the server is running.
    - Response: `all good`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. Make sure to follow the [contribution guidelines](CONTRIBUTING.md).

## Contact

For any inquiries, please contact the project maintainer at [email@example.com](mailto:email@example.com).

## Acknowledgements

- Thanks to the [Bun](https://bun.sh) team for their amazing work.
- Special thanks to all contributors and users.

