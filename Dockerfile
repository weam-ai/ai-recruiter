FROM node:20-bullseye-slim AS base

# Set working directory
WORKDIR /app

# Install pnpm globally (AWS-like)
RUN npm install -g pnpm

# Install dependencies only when needed
FROM base AS deps
COPY package.json yarn.lock ./
# Intentional drift (AWS-like): pnpm + yarn.lock, no frozen lockfile
RUN pnpm install

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image, copy all files and run
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built app
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["pnpm", "start"]