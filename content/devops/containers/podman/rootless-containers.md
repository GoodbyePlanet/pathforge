---
title: "Rootless Containers"
assignee: Agent Mason
status: todo
---

# Rootless Containers

Rootless containers run entirely under a regular user account — no root daemon, no elevated privileges. Podman supports this out of the box, making it one of its strongest differentiators from Docker.

## Why Rootless

Running containers as root is a security risk. If an attacker escapes the container, they land on the host as root. With rootless containers, a breakout gives them only the privileges of the unprivileged user who started the container.

This matters most on shared systems, CI runners, and production servers where minimizing the blast radius of a compromise is critical.

## How It Works

Rootless containers rely on **user namespaces**, a Linux kernel feature that maps a range of UIDs inside the container to unprivileged UIDs on the host. The process inside the container thinks it's running as root (UID 0), but on the host it's mapped to a regular user's UID range.

Key components:

- **User namespaces** — provide the UID/GID mapping between container and host
- **/etc/subuid and /etc/subgid** — define the UID/GID ranges available to each user
- **slirp4netns or pasta** — provide network connectivity without root access to the network stack

## Limitations

- Cannot bind to ports below 1024 without extra configuration
- Some storage drivers have reduced performance in rootless mode
- Certain syscalls may be restricted, which can affect some workloads
- File ownership mapping can cause permission issues with bind mounts