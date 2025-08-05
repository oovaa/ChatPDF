# Contribution Guide

Thank you for your interest in contributing to ChatPDF! We welcome all forms of contributions, including bug reports, feature requests, code improvements, documentation, and testing.

## How to Contribute

- **Bug Reports & Feature Requests:**
  - Open an issue on [GitHub](https://github.com/oovaa/ChatPDF/issues) with a clear description and steps to reproduce (if applicable).

- **Code Contributions:**
  1. Fork the repository and create your branch from `main`.
  2. Write clear, well-documented code following the project's style (see `.prettierrc`).
  3. Add tests for new features or bug fixes if possible.
  4. Submit a pull request with a descriptive title and summary.

- **Documentation:**
  - Improve or expand documentation in `README.md`, `docs/`, or code comments.

- **Testing & Review:**
  - Run tests and review code for reliability and performance.

## Development Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/oovaa/ChatPDF.git
   cd ChatPDF
   ```
2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```
3. Set up environment variables in `.env.local`.
4. Start the server:
   ```bash
   bun start
   # or
   npm start
   ```

## Code Style

- Use 2 spaces for indentation.
- Prefer ES modules and modern JavaScript.
- Write clear comments and documentation for public APIs.
- Use Prettier for formatting (`bun run lint`).

## Pull Request Checklist

- Reference related issues in your PR.
- Ensure your code passes all tests and lint checks.
- Provide a clear description of your changes.
- Target the `main` branch unless otherwise specified.

## Code of Conduct

All contributors are expected to follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Thank you for helping make ChatPDF better!
