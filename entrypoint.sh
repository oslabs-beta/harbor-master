#!/bin/bash

# Ensure /tmp/.X11-unix directory exists and has the correct permissions
mkdir -p /tmp/.X11-unix
chmod 1777 /tmp/.X11-unix
chown root:root /tmp/.X11-unix

# Start Xvfb in the background
Xvfb :99 -screen 0 1024x768x24 &

# Wait a few seconds to ensure Xvfb is fully started
sleep 2

# Start xterm in the background and suppress xkbcomp warnings
xterm -display :99 2>/dev/null &

# Wait a few seconds to ensure xterm is fully started
sleep 2

# Switch to non-root user and run the application
exec gosu appuser "$@"
