---
title: "Docker Compose"
assignee: Nemanja Vasic
status: done
---

# Docker Compose

Docker Compose is a tool for defining and running multi-container applications. You describe your services, networks,
and volumes in a single `docker-compose.yml` file, then bring everything up with one command.

## Compose File Structure

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    networks:
      - app-net

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: pass
    networks:
      - app-net

volumes:
  pgdata:

networks:
  app-net:
    driver: bridge
```

## Key Concepts

- **Services** — each container your app needs (web server, database, cache, etc.)
- **depends_on** — controls startup order, but the short form does not wait for readiness. Use the long form with
  `condition: service_healthy` to wait for a health check to pass before starting dependent services. Alternatively,
  build retry logic into your application's connection code.
- **Volumes** — named volumes for persistent data
- **Networks** — Compose creates a user-defined bridge network; this provides DNS-based service discovery; 
services reach each other by service name

## Environment Variables

Hardcoding values like passwords directly in the Compose file is fine for local examples, but for anything shared or
sensitive, use `.env` files and variable interpolation instead.

Compose automatically reads a `.env` file in the same directory as your `docker-compose.yml`:

```env
# .env
POSTGRES_PASSWORD=supersecret
POSTGRES_USER=admin
```

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
```

You can also point to a different env file per service using `env_file`:

```yaml
services:
  web:
    build: .
    env_file:
      - ./web.env
```

## Profiles

Profiles let you define optional services that only start when explicitly requested. This is useful for debug tools,
admin dashboards, or seed scripts that you don't need running all the time:

```yaml
services:
  web:
    build: .

  db:
    image: postgres:16-alpine

  adminer:
    image: adminer
    profiles:
      - debug
    ports:
      - "8080:8080"
```

```bash
# Only starts web and db
docker compose up

# Also starts adminer
docker compose --profile debug up
```

## Watch Mode

`docker compose watch` monitors your source files and automatically syncs changes into running containers or rebuilds
them — no manual restart needed:

```yaml
services:
  web:
    build: .
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: ./package.json
```

- **sync** — copies changed files into the container without rebuilding (fast, good for source code)
- **rebuild** — triggers a full image rebuild when the watched file changes (for dependency changes)

```bash
docker compose watch
```

## Override Files

Compose automatically merges `docker-compose.override.yml` on top of `docker-compose.yml` when you run
`docker compose up`. This lets you keep production-like defaults in the base file and layer local dev
customizations on top without editing the shared file:

```yaml
# docker-compose.yml (shared/base)
services:
  web:
    image: my-app:latest
    ports:
      - "3000:3000"
```

```yaml
# docker-compose.override.yml (local dev)
services:
  web:
    build: .
    volumes:
      - .:/app
    environment:
      DEBUG: "true"
```

The override file takes precedence — in this case, `build: .` replaces `image: my-app:latest`, and the volume mount
and environment variable are added.

## Common Commands

- `docker compose up` — build and start all services
- `docker compose up -d` — start in detached mode
- `docker compose down` — stop and remove containers (does not remove networks and volumes)
- `docker compose logs -f` — follow logs from all services
- `docker compose build` — rebuild images

## What Compose Actually Does

Compose is not a separate orchestrator. It reads your declarative YAML and translates it into the same `docker build`,
`docker run`, `docker network create`, and `docker volume create` commands you'd run manually. Understanding the
underlying concepts means you'll always understand what Compose is doing on your behalf.

## When to Use Compose

Compose is ideal for local development and testing multi-service apps. For production orchestration at scale, tools like
Kubernetes are more appropriate — but compose remains valuable for dev/test environments even in large projects.