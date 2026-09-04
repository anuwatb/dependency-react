FROM node:24.20.0-bullseye AS base

WORKDIR /dependency-app

COPY package*.json ./

RUN npm ci

# Copy source code
COPY . .

RUN --mount=type=secret,id=jwt,required=true,target=/dependency-app/.env \
    npm run build

# Production environment
FROM node:24.20.0-bullseye AS production

WORKDIR /dependency-app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=base /dependency-app/.next ./.next
COPY --from=base /dependency-app/public ./public

# Create non-root user for security
RUN addgroup --gid 1001 --system nodejs && \
    adduser --system --uid 1001 nodejs

# Change ownership of the directory
RUN chown -R nodejs:nodejs /dependency-app
USER nodejs

# Expose the port the app runs in
EXPOSE 3000

CMD ["npm", "start"]