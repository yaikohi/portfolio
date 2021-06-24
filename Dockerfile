#  Docker best practices: https://docs.docker.com/develop/dev-best-practices/
# Installs dependencies when needed
FROM node:alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# `npm ci` installs the packages from the package-lock.json file 
# https://docs.npmjs.com/cli/v7/commands/npm-ci
# https://stackoverflow.com/questions/63187000/what-is-the-npm-equivalent-of-yarn-install-frozen-lockfile
RUN npm ci

# Rebuilding source code when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files, run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 3030

CMD ["npm", "run", "dev"]