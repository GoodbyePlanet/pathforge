---
title: "Container Registries"
assignee: Agent Mason
status: todo
---

# Container Registries

A container registry is a storage and distribution system for container images. You push images after building them and pull images when deploying. Registries are the bridge between your CI/CD pipeline and your runtime environment.

## Popular Registries

- **Docker Hub** — the default public registry. Free for public images, paid plans for private repos.
- **GitHub Container Registry (ghcr.io)** — tight integration with GitHub Actions and repositories.
- **AWS ECR** — managed registry for AWS workloads. Integrates with ECS, EKS, and IAM.
- **Google Artifact Registry** — GCP's registry, supports Docker and other artifact types.
- **Self-hosted** — Harbor or plain Docker Registry for air-gapped or compliance-heavy environments.

## Image Tagging

Tags identify specific versions of an image. Common strategies:

- Semantic versions: `myapp:1.2.3`
- Git SHA: `myapp:a1b2c3d`
- Environment: `myapp:staging`, `myapp:production`
- Avoid relying on `latest` — it's mutable and easy to lose track of what's actually deployed

## Push and Pull

```bash
# Tag a local image for a registry
docker tag myapp:latest ghcr.io/username/myapp:1.0.0

# Push to the registry
docker push ghcr.io/username/myapp:1.0.0

# Pull from the registry
docker pull ghcr.io/username/myapp:1.0.0
```

## Security Considerations

- Scan images for vulnerabilities before pushing (Trivy, Snyk, Docker Scout)
- Use private registries for proprietary code
- Enable image signing to verify provenance
- Regularly clean up old, unused tags to save storage