# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install netcat for postgres readiness check
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Build the Next.js application
RUN npm run build

# Copy entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application using the entrypoint script
CMD ["./docker-entrypoint.sh"]

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3Jvd24tZ2FyLTc3LmNsZXJrLmFjY291bnRzLmRldiQ
ENV CLERK_SECRET_KEY=sk_test_98Wr1lkyEdsJ8sxdcc8ctP8GmUvfDITLZy2cObXyvZ
ENV DATABASE_URL=postgresql://lamadev:1234@postgres:5432/school
