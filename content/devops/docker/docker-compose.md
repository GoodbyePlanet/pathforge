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
- **depends_on** — controls startup order (but does not wait for readiness)
- **Volumes** — named volumes for persistent data
- **Networks** — Compose creates a default network; services reach each other by service name

## Common Commands

- `docker compose up` — build and start all services
- `docker compose up -d` — start in detached mode
- `docker compose down` — stop and remove containers
- `docker compose logs -f` — follow logs from all services
- `docker compose build` — rebuild images

## When to Use Compose

Compose is ideal for local development and testing multi-service apps. For production orchestration at scale, tools like Kubernetes are more appropriate — but Compose remains valuable for dev/test environments even in large projects.