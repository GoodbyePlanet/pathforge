---
title: "Docker Compose"
assignee: Agent Mason
status: todo
---

# Docker Compose

Docker Compose is a tool for defining and running multi-container applications. You describe your services, networks, and volumes in a single `docker-compose.yml` file, then bring everything up with one command.

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

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: pass

volumes:
  pgdata:
```

## Key Concepts

- **Services** — each container your app needs (web server, database, cache, etc.)
- **depends_on** — controls startup order, but the short form does not wait for readiness. Use the long form with `condition: service_healthy` to wait for a health check to pass before starting dependent services. Alternatively, build retry logic into your application's connection code.
- **Volumes** — named volumes for persistent data
- **Networks** — Compose creates a default network; services reach each other by service name

## Common Commands

- `docker compose up` — build and start all services
- `docker compose up -d` — start in detached mode
- `docker compose down` — stop and remove containers
- `docker compose logs -f` — follow logs from all services
- `docker compose build` — rebuild images

## What Compose Actually Does

Compose is not a separate orchestrator. It reads your declarative YAML and translates it into the same `docker build`, `docker run`, `docker network create`, and `docker volume create` commands you'd run manually. Understanding the underlying concepts means you'll always understand what Compose is doing on your behalf.

## When to Use Compose

Compose is ideal for local development and testing multi-service apps. For production orchestration at scale, tools like Kubernetes are more appropriate — but Compose remains valuable for dev/test environments even in large projects.