---
title: "Deploying to VPS"
assignee: Agent Mason
status: todo
---

# Deploying to VPS

A Virtual Private Server (VPS) is a virtual machine you rent from a provider (DigitalOcean, Hetzner, Linode, AWS EC2). You get root access, a public IP, and full control over the environment. It's the most straightforward way to deploy applications to the internet.

## Key Topics

- **[[linux-server-basics]]** — users, permissions, systemd, and firewalls
- **[[reverse-proxies]]** — routing traffic with Nginx or Caddy
- **[[automated-vps-deployments]]** — automating deploys with scripts and CI

## Typical VPS Deploy Flow

1. Provision a VPS (Ubuntu/Debian)
2. Secure it — SSH keys, disable password auth, configure firewall
3. Install runtime dependencies (Docker, Node, etc.)
4. Transfer your app (git clone, Docker pull, or SCP)
5. Set up a reverse proxy with TLS
6. Configure a process manager to keep your app running
7. Automate future deploys

## VPS vs PaaS vs Kubernetes

- **VPS** — full control, lowest cost, most manual setup. Great for small-to-medium projects.
- **PaaS** (Vercel, Railway, Fly.io) — managed, fast to set up, more expensive at scale.
- **Kubernetes** — designed for large, multi-service architectures. Overkill for a single app on one server.

## Providers

Popular choices for dev-friendly VPS hosting:
- **Hetzner** — best price-to-performance in Europe
- **DigitalOcean** — simple UI, good docs, solid ecosystem
- **Linode** (Akamai) — reliable, straightforward pricing
- **AWS EC2** — flexible but more complex; better suited when you're already in the AWS ecosystem