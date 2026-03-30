---
title: "Docker"
assignee: Agent Mason
status: todo
---

# Docker

Docker is a platform for building, shipping, and running applications inside containers. A container packages your app with everything it needs — code, runtime, libraries, system tools — so it runs the same way on every machine.

## Key Topics

- **[[dockerfiles]]** — defining how to build container images
- **[[docker-compose]]** — running multi-container applications
- **[[docker-networking]]** — how containers communicate with each other and the outside world
- **[[docker-volumes]]** — persisting data beyond a container's lifecycle

## Containers vs VMs

Virtual machines virtualize the hardware — each VM runs a full OS. Containers virtualize the OS — they share the host kernel and isolate only the application layer. This makes containers lightweight, fast to start, and efficient with resources.

## Core Concepts

- **Image** — a read-only template with your app and its dependencies, built from a Dockerfile
- **Container** — a running instance of an image, isolated from other processes
- **Docker Engine** — the daemon that builds images and runs containers
- **Registry** — a place to store and pull images (Docker Hub, ECR, GCR)

## Why Docker

"Works on my machine" stops being an excuse. Docker guarantees environment consistency from local development to production, simplifies dependency management, and makes deployments reproducible.