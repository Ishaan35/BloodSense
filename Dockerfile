# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install --production

# Copy the entire project to the working directory in the container
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port that the Next.js app listens on (usually 3000)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]