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
- `EXPOSE` — documents which port the app listens on. Does **not** actually open the port — you still need `-p` at runtime to publish it.
- `CMD` — default command (or default arguments to `ENTRYPOINT`) when the container starts
- `ENTRYPOINT` — the executable the container always runs

## CMD vs ENTRYPOINT

`ENTRYPOINT` defines the program. `CMD` provides default arguments. When someone overrides the command at runtime with `docker run myapp worker.js`, they replace `CMD`, not `ENTRYPOINT`.

If your entrypoint is `node` and your command is `server.js`, then `docker run myapp worker.js` runs `node worker.js`. The entrypoint stays, the arguments change. Use `ENTRYPOINT` when the container should always run the same program. Use `CMD` for the default arguments someone might want to swap.

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

## Build Context

When you run `docker build .`, the dot is the **build context** — the set of files available to `COPY` instructions. If your project has large directories you don't need in the image, a broad `COPY . .` pulls them all in. Use `.dockerignore` to exclude unnecessary files and keep builds fast.

## Best Practices

- Use specific base image tags, not `latest`
- Combine `RUN` commands to reduce layers
- Use `.dockerignore` to exclude unnecessary files from the build context
- Prefer `COPY` over `ADD` unless you need tar extraction or URL fetching