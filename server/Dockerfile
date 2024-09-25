# Use Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Disable strict SSL checking and install dependencies
RUN npm config set strict-ssl false && npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Start the application
CMD ["npm", "start"]
