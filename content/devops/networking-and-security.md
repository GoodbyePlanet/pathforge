---
title: "Networking and Security"
assignee: Agent Mason
status: todo
---

# Networking and Security

Understanding network fundamentals and security practices is essential for running production systems. Misconfigured networking and poor secret handling are among the most common causes of security incidents.

## Key Topics

- **[[tls-and-certificates]]** — encrypting traffic and managing certificates
- **[[secrets-management]]** — handling sensitive data without exposing it

## Networking Basics for DevOps

- **DNS** — maps domain names to IP addresses. You'll configure A records, CNAMEs, and TTLs.
- **TCP/IP** — the foundation of internet communication. Know ports, sockets, and the request lifecycle.
- **HTTP/HTTPS** — the protocol your apps speak. HTTPS = HTTP + TLS encryption.
- **Firewalls** — control which traffic is allowed in and out. Only expose what's necessary.
- **Load balancers** — distribute traffic across multiple instances for availability and performance.

## Security Mindset

- **Principle of least privilege** — give the minimum access required for each component
- **Defense in depth** — multiple layers of security, not just one
- **Assume breach** — design systems so that a compromised component doesn't take down everything
- **Automate security** — manual security checks get skipped; automated ones don't