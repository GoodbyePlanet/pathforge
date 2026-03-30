---
title: "Reverse Proxies"
assignee: Agent Mason
status: todo
---

# Reverse Proxies

A reverse proxy sits between the internet and your application. It receives incoming requests, forwards them to your app, and returns the response. It handles concerns your app shouldn't — TLS termination, load balancing, rate limiting, and static file serving.

## Nginx

The most widely used reverse proxy. Powerful but requires manual configuration.

```nginx
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name myapp.com;

    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Caddy

A modern alternative that handles TLS automatically via Let's Encrypt with zero configuration.

```
myapp.com {
    reverse_proxy localhost:3000
}
```

That's it. Caddy obtains and renews certificates automatically.

## Why Use a Reverse Proxy

- **TLS termination** — handle HTTPS at the proxy, your app stays on HTTP internally
- **Multiple apps on one server** — route `app1.com` and `app2.com` to different ports
- **Static files** — serve assets directly from disk without hitting your app
- **Security** — hide your app server, add rate limiting, block bad requests

## Nginx vs Caddy

- **Nginx** — battle-tested, massive ecosystem, more manual config, community edition is free
- **Caddy** — automatic HTTPS, simpler config, great for smaller setups, written in Go