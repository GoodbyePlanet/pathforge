---
title: "Automated VPS Deployments"
assignee: Agent Mason
status: todo
---

# Automated VPS Deployments

Manual SSH-and-deploy workflows don't scale. Automated deployments ensure every deploy is consistent, fast, and repeatable — whether triggered by a git push or a CI pipeline.

## SSH-Based Deployment from CI

The most common pattern: CI builds your app, then SSHs into the VPS to deploy it.

```yaml
# GitHub Actions example
deploy:
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v1
      with:
        host: ${{ secrets.VPS_HOST }}
        username: deploy
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /home/deploy/myapp
          git pull origin main
          npm ci --production
          npm run build
          sudo systemctl restart myapp
```

## Docker-Based Deployment

Build and push an image in CI, then pull and run it on the VPS.

```bash
# On the VPS
docker pull ghcr.io/username/myapp:latest
docker compose up -d
```

This approach is more reliable than git-pull deploys because the image is already built and tested.

## Deployment Scripts

Keep a `deploy.sh` in your repo that encapsulates the deploy steps:

```bash
#!/bin/bash
set -e

echo "Pulling latest image..."
docker compose pull

echo "Starting services..."
docker compose up -d --remove-orphans

echo "Cleaning up old images..."
docker image prune -f

echo "Deploy complete."
```

## Key Practices

- Store SSH keys and secrets in CI secret management, never in code
- Use a dedicated `deploy` user with limited permissions on the VPS
- Test the deploy process in staging before production
- Add health checks after deploy to verify the app is actually running
- Keep a rollback plan — tag images with versions so you can quickly revert