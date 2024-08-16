# Use Ubuntu as the base image
FROM ubuntu:latest

ARG PORT
ARG SECRET_KEY
ARG SECRET_IV
ARG ENCRYPTION_METHOD
ARG APP_CLIENT_ID
ARG APP_CLIENT_SECRET
ARG MONGO_URI

ENV PORT=${PORT}
ENV SECRET_KEY=${SECRET_KEY}
ENV SECRET_IV=${SECRET_IV}
ENV ENCRYPTION_METHOD=${ENCRYPTION_METHOD}
ENV APP_CLIENT_ID=${APP_CLIENT_ID}
ENV APP_CLIENT_SECRET=${APP_CLIENT_SECRET}
ENV MONGO_URI=${MONGO_URI}

# Install necessary packages and tools
RUN apt-get update && apt-get install -y \
    curl \
    xterm \
    xvfb \
    x11-xkb-utils \
    xkb-data \
    gnupg \
    software-properties-common \
    apt-transport-https \
    gosu \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add - \
    && apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
    && apt-get update \
    && apt-get install -y terraform \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install TypeScript globally
RUN npm install -g typescript

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Set permissions for the entrypoint script
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set environment variables
ENV DISPLAY=:99
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Use the startup script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start the application
CMD ["npm", "run", "start"]
