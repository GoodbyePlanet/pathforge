---
title: "Docker"
assignee: Nemanja Vasic
status: done
---

# Docker

Docker is the most widely used container platform. It provides tooling to build, ship, and run containers using
a client-server architecture — the Docker CLI talks to the Docker daemon, which manages images, containers, networks,
and volumes.

## Containers Are Not VMs

A container is not a separate operating system — it's a regular process running with isolation features turned on.
On Linux, the kernel uses **namespaces** (isolated view of process trees, network interfaces, filesystem root)
**Process tree** — the container sees only its own processes. Inside, your app might be PID 1, even though the host sees
it as PID 48372. It can't see or kill processes from other containers or the host.
**Network interfaces** — the container gets its own virtual network stack (its own IP, its own ports).
That's why port 3000 inside a container doesn't clash with port 3000 on your host — they're separate network namespaces.
**Filesystem root** — the container sees its own / directory, built from the image layers. It has no access to the
host filesystem unless you explicitly give it one via volumes or bind mounts. 

Another isolation feature that Kernel gives is **cgroups** which are used to limit CPU and memory.
Having these two is why containers start in seconds — they're not booting an OS, just starting a process with boundaries.

On macOS and Windows, Docker runs a lightweight Linux VM in the background to provide the Linux kernel that containers
require. Docker itself isn't a VM, but on non-Linux systems it needs one under the hood. That's also why Docker feels faster
on Linux.

## Key Topics

- **[[dockerfiles]]** — defining how to build container images
- **[[docker-compose]]** — running multi-container applications
- **[[docker-networking]]** — how containers communicate with each other and the outside world
- **[[docker-volumes]]** — persisting data beyond a container's lifecycle

## Core Concepts

- **Image** — a read-only, immutable template with your app and its dependencies, built from a Dockerfile.
- **Container** — a running instance of an image with its own thin writable layer. When you run a container, Docker 
takes the image (which is read-only, stacked layers) and adds a thin writable layer on top. Changes inside a container
only exist in that layer — they don't modify the image. When the container is stopped or restarted, it survives if the
container is removed, the writable layer is gone.
- **Docker Engine** — the daemon that builds images and runs containers
- **Registry** — a place to store and pull images (Docker Hub, ECR, GCR)

## Why Docker

"Works on my machine" stops being an excuse. Docker guarantees environment consistency from local development to
production, simplifies dependency management, and makes deployments reproducible.