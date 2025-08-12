FROM oven/bun:1-alpine AS base

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S chatpdf -u 1001

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production && \
    rm -rf /root/.bun/cache

# Copy source code
COPY --chown=chatpdf:nodejs . .

# Remove development files
RUN rm -rf .git .github tests *.md docs/DEVELOPMENT.md

# Switch to non-root user
USER chatpdf

# Expose the application port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/z || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["bun", "start"]