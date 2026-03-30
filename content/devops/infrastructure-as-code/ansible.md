---
title: "Ansible"
assignee: Agent Mason
status: todo
---

# Ansible

Ansible is an agentless automation tool for configuration management, application deployment, and task automation. It connects to servers over SSH and executes tasks defined in YAML playbooks — no agent installation required.

## Core Concepts

- **Inventory** — a list of target hosts, grouped by role (web servers, databases, etc.)
- **Playbook** — a YAML file defining a set of tasks to run on a group of hosts
- **Task** — a single action (install a package, copy a file, restart a service)
- **Role** — a reusable collection of tasks, templates, and files for a specific purpose
- **Module** — built-in units of work (e.g., `apt`, `copy`, `systemd`, `docker_compose`)

## Example Playbook

```yaml
- name: Set up web server
  hosts: webservers
  become: true
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: true

    - name: Copy Nginx config
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Restart Nginx

    - name: Ensure Nginx is running
      systemd:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Restart Nginx
      systemd:
        name: nginx
        state: restarted
```

## Terraform vs Ansible

They solve different problems and work well together:

- **Terraform** — provisions infrastructure (create VMs, networks, databases)
- **Ansible** — configures infrastructure (install software, deploy apps, manage configs)

Typical flow: Terraform creates the servers, Ansible sets them up.

## Best Practices

- Use roles to organize reusable configurations
- Keep playbooks idempotent — running them twice should produce the same result
- Use `ansible-vault` to encrypt sensitive variables (passwords, keys)
- Test with `--check` (dry run) before applying changes