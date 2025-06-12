FROM node:18-alpine

WORKDIR /app

# Accept build arg for VITE_BACKEND_URL
ARG VITE_BACKEND_URL

# Optional: print the value during build for confirmation
RUN echo "Backend URL is: $VITE_BACKEND_URL"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# This makes sure Vite sees the var correctly
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Explicitly tell Vite to use it
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL npm run build

# Expose the port the app runs on
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview"]

