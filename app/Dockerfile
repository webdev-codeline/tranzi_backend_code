# Use the official Node.js 18 image as a base image
FROM node:18

# Set the working directory in the docker
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

RUN npm install -g nodemon

# Install dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run the application
CMD [ "nodemon" ]