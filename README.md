# ChatPDF

ChatPDF is a project that allows you to interact with PDF files using a chat interface.

## Features

- Chat with PDF documents to extract information quickly.
- Supports multiple PDF files.
- Easy-to-use interface.

## Installation

To install the dependencies, run the following command:

```bash
bun install
```

Or, if you prefer using Node.js, run:

```bash
npm install
```

## Usage

To run the project, use the following command:

```bash
bun start
```

Or, if you prefer using Node.js, run:

```bash
npm start
```

## About

This project was created using `bun init` with Bun v1.2.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


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

