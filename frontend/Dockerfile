# Use an official Node.js runtime as a base image to build the React app
FROM node:14 AS build

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

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Use a lightweight web server to serve the frontend
FROM nginx:alpine

# Create a non-root user and switch to it
RUN addgroup -S nginx && adduser -S nginx -G nginx
USER nginx

# Copy the build files from the previous stage to the Nginx web server directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port that Nginx will run on
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
