---
title: "Secrets Management"
assignee: Agent Mason
status: todo
---

# Secrets Management

Secrets are sensitive values your application needs at runtime — API keys, database passwords, TLS certificates, tokens. How you store and deliver secrets determines whether they stay secret.

## The Anti-Patterns

- Hardcoding secrets in source code
- Committing `.env` files to git
- Passing secrets as plain-text command-line arguments (visible in `ps`)
- Sharing secrets via Slack or email
- Using the same secret across all environments

## Environment Variables

The simplest approach. Pass secrets via environment variables, loaded from a `.env` file that's in `.gitignore`.

```bash
# .env (never committed)
DATABASE_URL=postgres://user:pass@db:5432/mydb
API_KEY=sk-abc123
```

This works for small projects but doesn't scale — there's no versioning, rotation, or access control.

## CI/CD Secrets

All major CI platforms have built-in secret storage:

- **GitHub Actions** — repository or organization secrets, accessible as `${{ secrets.NAME }}`
- **GitLab CI** — CI/CD variables, can be masked and protected
- Secrets are injected at runtime and masked in logs

## Dedicated Secret Managers

For larger systems, use a dedicated tool:

- **HashiCorp Vault** — dynamic secrets, leasing, rotation, fine-grained access policies
- **AWS Secrets Manager / SSM Parameter Store** — managed, integrates with IAM
- **Doppler** — developer-friendly, syncs secrets across environments

## Kubernetes Secrets

Kubernetes has a built-in `Secret` resource, but it's only base64-encoded — not encrypted at rest by default. For real security, combine with:

- **Sealed Secrets** — encrypt secrets in git, decrypted only in-cluster
- **External Secrets Operator** — syncs secrets from Vault, AWS, or GCP into K8s

## Best Practices

- Rotate secrets regularly
- Use different secrets per environment
- Audit who accessed what and when
- Never log secrets — sanitize logs and error messages