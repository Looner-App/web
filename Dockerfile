# BASE IMAGE
FROM node:18.17-alpine AS base
WORKDIR /app


## Dependecies
FROM base AS deps
RUN npm install -g husky
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn


## Builder
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build


## Runtime Image
FROM base AS runner
LABEL org.opencontainers.image.source=https://github.com/looner-app/web
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp
RUN npm install -g sharp
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

RUN mkdir -p /app/.next/cache/images

EXPOSE 3000
CMD ["node", "server.js"]
