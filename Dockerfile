# Use a lightweight Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to a new layer for dependency installation
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Expose the port that Vite's dev server will run on (typically 5173)
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "dev", "--", "--host"]
