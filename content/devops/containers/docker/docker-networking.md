---
title: "Docker Networking"
assignee: Agent Mason
status: todo
---

# Docker Networking

Docker networking controls how containers communicate with each other, the host, and external networks. Docker creates isolated network namespaces for each container and provides several network drivers for different use cases.

## Network Drivers

- **bridge** — the default. Containers on the same bridge network can reach each other by name. Isolated from the host network.
- **host** — removes network isolation; the container shares the host's network stack. Good for performance-sensitive workloads.
- **none** — disables networking entirely. Useful for batch jobs that don't need network access.
- **overlay** — spans multiple Docker hosts. Used in Docker Swarm and some Kubernetes setups for cross-host container communication.

## DNS and Service Discovery

On user-defined bridge networks, Docker runs an embedded DNS server. Containers can resolve each other by container name — no need for IP addresses. The default bridge network does not support this; you must create a custom one.

```bash
docker network create my-network
docker run --network my-network --name api my-api-image
docker run --network my-network --name db postgres:16
# "api" can reach "db" by hostname "db"
```

## Port Mapping

Containers are isolated by default. To expose a service to the host, map a host port to a container port:

```bash
docker run -p 8080:3000 my-app
# host:8080 → container:3000
```

## Network Isolation

Networks also isolate groups of containers from each other. Your front-end containers don't need direct access to the database — put them on separate networks. The front-end talks to the back-end, the back-end talks to the database, and the front-end can't reach the database at all.

## Best Practices

- Always use custom bridge networks instead of the default bridge
- Only expose ports that need to be reachable from outside
- Use Docker Compose networking — it creates a dedicated network per project automatically