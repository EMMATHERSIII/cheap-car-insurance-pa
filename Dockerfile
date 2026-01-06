FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
