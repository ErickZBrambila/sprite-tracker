FROM node:22-alpine

WORKDIR /app

# Install server dependencies first (layer-cached until package.json changes)
COPY server/package*.json ./server/
RUN cd server && npm ci --production

# Copy all app files.
# Run `node scripts/download-images.js` locally before building so images/ is populated.
COPY . .

# Ensure the data directory exists (mount a volume here in production)
RUN mkdir -p data

ENV NODE_ENV=production \
    PORT=3000 \
    DB_PATH=/app/data/sprite-tracker.db

EXPOSE 3000
CMD ["node", "server/index.js"]
