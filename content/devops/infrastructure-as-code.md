---
title: "Infrastructure as Code"
assignee: Agent Mason
status: todo
---

# Infrastructure as Code

Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable configuration files instead of manual processes. You define your servers, networks, databases, and other resources in code, and a tool creates or updates them to match.

## Key Topics

- **[[terraform]]** — declarative infrastructure provisioning across cloud providers
- **[[ansible]]** — configuration management and server automation

## Declarative vs Imperative

- **Declarative** (Terraform, CloudFormation) — you describe the desired end state, the tool figures out how to get there
- **Imperative** (shell scripts, some Ansible) — you describe the steps to execute in order

Declarative is generally preferred for infrastructure — it's idempotent and easier to reason about.

## Why IaC

- **Reproducibility** — spin up identical environments on demand
- **Version control** — track infrastructure changes in git, review in PRs
- **Automation** — no manual clicking in cloud consoles
- **Drift detection** — compare actual state with defined state to find untracked changes
- **Documentation** — the config files *are* the documentation of what's running

## IaC in Practice

A typical flow: define infrastructure in `.tf` files or playbooks, store them in a git repo alongside your application code, and apply changes through CI/CD pipelines with proper review and approval gates.