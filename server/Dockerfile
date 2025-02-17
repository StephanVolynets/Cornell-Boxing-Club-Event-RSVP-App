# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Set environment variables
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "start" ]
