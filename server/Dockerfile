# Use Node.js base image
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

# Copy the application source code
COPY . .

# Expose the port the app runs on (assuming the server runs on port 8081)
EXPOSE 8081

# Command to start the app
CMD ["npm", "start"]
