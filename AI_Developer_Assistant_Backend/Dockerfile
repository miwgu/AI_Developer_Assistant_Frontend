FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run index.ts in root (not inside src)
CMD ["npx", "ts-node", "index.ts"]