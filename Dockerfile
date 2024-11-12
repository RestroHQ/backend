# Use Node.js LTS slim image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy pnpm specific files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install --prod --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodeuser && \
    chown -R nodeuser:nodejs /usr/src/app

# Switch to non-root user
USER nodeuser

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
