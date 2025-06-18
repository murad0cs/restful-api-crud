# Use Node.js alpine image for minimal size
FROM node:20-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (for layer caching)
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy rest of the app code
COPY . .

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port for API
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
