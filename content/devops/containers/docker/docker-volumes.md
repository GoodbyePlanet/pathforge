---
title: "Docker Volumes"
assignee: Nemanja Vasic
status: done
---

# Docker Volumes

Containers are ephemeral — when a container is removed, its filesystem is gone. Docker volumes solve this by providing
persistent storage that survives container restarts and removals.

## Types of Storage

### Named Volumes

Managed by Docker. Best for production data that needs to persist.

```bash
docker volume create pgdata
docker run -v pgdata:/var/lib/postgresql/data postgres:16
```

### Bind Mounts

Map a host directory into the container. Best for development — edit files on the host, see changes inside the container
immediately.

```bash
docker run -v $(pwd)/src:/app/src my-app
```

### tmpfs Mounts

Stored in memory only. Good for sensitive data that should never be written to disk.

```bash
docker run --tmpfs /app/tmp my-app
```

## Volume Lifecycle

- Volumes persist until explicitly removed with `docker volume rm`
- `docker compose down` does **not** remove volumes by default; use `docker compose down -v` to include them
- Orphaned volumes accumulate over time — clean up with `docker volume prune`

## Gotchas

- **Bind mounts obscure image files.** When you bind mount a directory to a path inside the container, it completely
  hides whatever was at that path in the image. The image files still exist in the layer — they're just covered by the
  mount.
- **Named volumes seed from the image.** If you mount an empty named volume to a path that already has files in the
  image, Docker copies those image files into the volume on first use. This is how database images like Postgres
  initialize their data directory. It only happens once — after that, the volume's contents take over.

## Best Practices

- Use named volumes for databases and stateful services
- Use bind mounts for local development workflows
- Never store application state inside the container's writable layer
- Back up important volumes regularly — they're just directories on the host under `/var/lib/docker/volumes/`