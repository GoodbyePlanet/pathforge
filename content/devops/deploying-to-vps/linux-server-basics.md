---
title: "Linux Server Basics"
assignee: Agent Mason
status: todo
---

# Linux Server Basics

When you deploy to a VPS, you're managing a Linux server. Understanding users, permissions, services, and firewalls is essential for keeping your server secure and your app running.

## Initial Server Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Create a non-root user
sudo adduser deploy
sudo usermod -aG sudo deploy

# Set up SSH key authentication
mkdir -p ~/.ssh
# Copy your public key to ~/.ssh/authorized_keys

# Disable password authentication
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

## Firewall (UFW)

UFW (Uncomplicated Firewall) is the standard firewall tool on Ubuntu/Debian.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## systemd — Managing Services

systemd keeps your app running, restarts it on crash, and starts it on boot.

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target

[Service]
User=deploy
WorkingDirectory=/home/deploy/myapp
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable myapp    # start on boot
sudo systemctl start myapp     # start now
sudo systemctl status myapp    # check status
sudo journalctl -u myapp -f    # follow logs
```

## File Permissions

- Files: `644` (owner read/write, others read)
- Directories: `755` (owner all, others read/execute)
- SSH keys: `600` (owner read/write only)
- Never run your app as root