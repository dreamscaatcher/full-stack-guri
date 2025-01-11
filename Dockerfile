# Use Node.js as the base image - we're using Alpine for its small size
FROM node:18-alpine

# Set up the working directory in the container
WORKDIR /app

# Copy package files first - this helps with Docker caching
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all project files to the container
COPY . .

# Generate the Prisma client - this is needed for your database operations
RUN npx prisma generate

# Build your Next.js application
RUN npm run build

# The port your application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]