---
title: "Terraform"
assignee: Agent Mason
status: todo
---

# Terraform

Terraform is an open-source IaC tool by HashiCorp. It uses a declarative language (HCL) to define infrastructure across any cloud provider — AWS, GCP, Azure, DigitalOcean, and hundreds more via providers.

## Core Concepts

- **Provider** — a plugin that interacts with a cloud API (e.g., `aws`, `google`, `digitalocean`)
- **Resource** — a piece of infrastructure (e.g., a VM, database, DNS record)
- **State** — Terraform tracks what it has created in a state file (`terraform.tfstate`)
- **Module** — a reusable group of resources, like a function for infrastructure

## Basic Example

```hcl
provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  image  = "ubuntu-24-04-x64"
  name   = "web-server"
  region = "fra1"
  size   = "s-1vcpu-1gb"
}
```

## Workflow

1. `terraform init` — download providers and initialize the working directory
2. `terraform plan` — preview what changes will be made
3. `terraform apply` — create or update infrastructure to match the config
4. `terraform destroy` — tear everything down

## State Management

Terraform state maps your config to real-world resources. In a team, store state remotely (S3, Terraform Cloud) with locking to prevent concurrent modifications.

## Best Practices

- Never edit state files manually
- Use variables and modules to keep configs DRY
- Store state remotely with locking enabled
- Review `terraform plan` output before applying
- Use workspaces or separate state files per environment