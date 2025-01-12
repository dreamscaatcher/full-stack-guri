# Use Node.js as the base image
FROM node:18-alpine

# Install OpenSSL and other required system dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client with proper environment variables
ENV PRISMA_BINARY_TARGET="linux-musl"
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]