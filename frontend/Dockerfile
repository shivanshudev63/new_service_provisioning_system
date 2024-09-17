# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Disable strict SSL checking (to handle self-signed certificates)
RUN npm config set strict-ssl false

# Set NODE_TLS_REJECT_UNAUTHORIZED to 0 to bypass SSL validation
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
