---
title: "Dockerfiles"
assignee: Agent Mason
status: todo
---

# Dockerfiles

A Dockerfile is a text file with instructions for building a Docker image. Each instruction creates a layer in the image, and Docker caches layers to speed up rebuilds.

## Key Instructions

- `FROM` — base image to build on (e.g., `node:20-alpine`)
- `WORKDIR` — sets the working directory inside the container
- `COPY` / `ADD` — copy files from host into the image
- `RUN` — execute a command during build (e.g., `npm install`)
- `EXPOSE` — document which port the app listens on
- `CMD` / `ENTRYPOINT` — define the default command when the container starts

## Layer Caching

Docker caches each layer. If a layer's instruction and inputs haven't changed, Docker reuses the cached version. Order matters — put instructions that change less frequently (like installing dependencies) before those that change often (like copying source code).

## Multi-Stage Builds

Multi-stage builds use multiple `FROM` instructions to separate build-time dependencies from the final runtime image. This keeps production images small and free of build tools.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

## Best Practices

- Use specific base image tags, not `latest`
- Combine `RUN` commands to reduce layers
- Use `.dockerignore` to exclude unnecessary files from the build context
- Prefer `COPY` over `ADD` unless you need tar extraction or URL fetching