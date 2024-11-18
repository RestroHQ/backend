# Use Node.js LTS slim image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Install OpenSSL and other required dependencies for Prisma
RUN apt-get update && apt-get install -y openssl

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files first
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY .babelrc ./
COPY jsconfig.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for building)
RUN pnpm install

# Generate Prisma Client
RUN pnpm dlx prisma generate

# Copy source code
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p /usr/src/app/uploads/users && \
    mkdir -p /usr/src/app/uploads/restaurants && \
    chown -R node:node /usr/src/app/uploads

# Build using Babel
RUN pnpm run build

# Remove dev dependencies after build
RUN pnpm prune --prod

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV UPLOAD_DIR=/usr/src/app/uploads

# Expose the port the app runs on
EXPOSE 3001

# Create a script to handle startup tasks
RUN pnpm dlx prisma migrate deploy

# Switch to non-root user
USER node

# Start the application
CMD ["pnpm", "start"]
