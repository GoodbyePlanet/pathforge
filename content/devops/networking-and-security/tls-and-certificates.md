---
title: "TLS and Certificates"
assignee: Agent Mason
status: todo
---

# TLS and Certificates

TLS (Transport Layer Security) encrypts data in transit between clients and servers. It's what puts the "S" in HTTPS. Without TLS, anyone on the network can read passwords, tokens, and data in plain text.

## How TLS Works

1. **Client Hello** — the client sends supported TLS versions and cipher suites
2. **Server Hello** — the server responds with its chosen cipher suite and certificate
3. **Certificate Verification** — the client verifies the certificate against trusted Certificate Authorities (CAs)
4. **Key Exchange** — client and server agree on a shared encryption key
5. **Encrypted Communication** — all subsequent data is encrypted

## Certificates

A TLS certificate proves that a server is who it claims to be. It contains the domain name, public key, issuer (CA), and expiration date.

### Let's Encrypt

Let's Encrypt provides free, automated certificates. Tools like Certbot and Caddy handle the entire lifecycle — issuance, installation, and renewal.

```bash
# Certbot with Nginx
sudo certbot --nginx -d myapp.com -d www.myapp.com
```

Certificates expire every 90 days. Certbot sets up automatic renewal via a systemd timer or cron job.

## Common Mistakes

- Letting certificates expire — set up monitoring and auto-renewal
- Mixed content — serving HTTPS pages that load HTTP resources
- Not redirecting HTTP to HTTPS — all HTTP traffic should 301 to HTTPS
- Using self-signed certificates in production — browsers will show warnings, users won't trust it

## TLS in Practice

- Terminate TLS at the reverse proxy (Nginx, Caddy), not in your application
- Use TLS 1.2 or 1.3 — disable older versions
- Internal service-to-service communication should also use TLS when crossing network boundaries