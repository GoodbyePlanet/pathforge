---
title: "Helm Charts"
assignee: Agent Mason
status: todo
---

# Helm Charts

Helm is the package manager for Kubernetes. A Helm chart is a collection of templated Kubernetes manifests that can be configured with values and deployed as a single unit.

## Why Helm

Raw Kubernetes YAML gets repetitive fast — especially when you need the same app deployed across dev, staging, and production with slightly different configs. Helm solves this with templating and release management.

## Chart Structure

```
mychart/
  Chart.yaml          # chart metadata (name, version)
  values.yaml         # default configuration values
  templates/
    deployment.yaml   # templated K8s manifests
    service.yaml
    ingress.yaml
```

Templates use Go templating syntax:

```yaml
replicas: {{ .Values.replicaCount }}
image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
```

## Common Commands

- `helm install myrelease ./mychart` — deploy a chart
- `helm upgrade myrelease ./mychart` — update an existing release
- `helm rollback myrelease 1` — revert to a previous revision
- `helm uninstall myrelease` — remove all resources from a release
- `helm repo add bitnami https://charts.bitnami.com/bitnami` — add a chart repository

## Public Charts

The Helm ecosystem has charts for most common infrastructure — PostgreSQL, Redis, nginx, Prometheus, Grafana. Instead of writing manifests from scratch, you install a community chart and override values.

## Best Practices

- Pin chart versions in production
- Use `values.yaml` overrides per environment (`values-staging.yaml`, `values-prod.yaml`)
- Keep templates readable — extract complex logic into named templates with `_helpers.tpl`