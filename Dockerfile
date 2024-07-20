# Use Ubuntu as the base image
FROM ubuntu:latest

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

# Create a non-root user and group
RUN groupadd -r appgroup && useradd -m -r -g appgroup appuser

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

# Set permissions for the application directory
RUN chown -R appuser:appgroup /app

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
