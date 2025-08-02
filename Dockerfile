# Use Node.js 20 instead of 18
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install root dependencies
RUN yarn install

# Copy the entire project into the container
COPY . .

# Install server dependencies separately
WORKDIR /app/server
RUN yarn install

# Return to root directory
WORKDIR /app

# Expose necessary ports
EXPOSE 3000 5001 5002

# Start both frontend and backend servers
CMD ["yarn", "start"]

