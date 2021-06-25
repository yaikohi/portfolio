# ================================================================
# Base image
# ================================================================
FROM node:alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ================================================================
# Building the dependencies
# ================================================================
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


# ================================================================
# Running the production image
# ================================================================FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/. ./
EXPOSE 3000
CMD ["npm", "run", "dev"]