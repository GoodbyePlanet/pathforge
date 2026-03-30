---
title: "Services and Ingress"
assignee: Agent Mason
status: todo
---

# Services and Ingress

Pods get new IP addresses every time they're recreated. Services provide a stable endpoint for reaching a set of pods, and Ingress manages external HTTP access to your cluster.

## Services

A Service is an abstraction that defines a logical set of pods (via label selectors) and a policy for accessing them.

### Service Types

- **ClusterIP** (default) — internal-only. Other pods in the cluster can reach it, but nothing outside can.
- **NodePort** — exposes the service on a static port on every node. Accessible via `<node-ip>:<node-port>`.
- **LoadBalancer** — provisions an external load balancer (on cloud providers). The standard way to expose services to the internet.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
```

## Ingress

Ingress is a Kubernetes resource that manages HTTP/HTTPS routing from outside the cluster to internal services. It requires an Ingress Controller (e.g., nginx-ingress, Traefik) to be installed.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

## When to Use What

- **ClusterIP** — service-to-service communication within the cluster
- **LoadBalancer** — exposing a single service directly to the internet
- **Ingress** — routing multiple domains or paths to different services through a single entry point