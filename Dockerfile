# Use Ubuntu as the base image
FROM ubuntu:latest

# Install Node.js, npm, xterm, Xvfb, and necessary X keyboard configuration files
RUN apt-get update && apt-get install -y \
    curl \
    xterm \
    xvfb \
    x11-xkb-utils \
    xkb-data \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install gosu
RUN apt-get update && apt-get install -y gosu

# Create a non-root user
RUN useradd -m appuser

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

RUN ^C

# Set permissions for the application directory
RUN chown -R appuser:appuser /app

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
