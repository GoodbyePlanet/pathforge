---
title: "Containers"
assignee: Nemanja Vasic
status: done
---

# Containers

Containers are lightweight, isolated environments that package an application with everything it needs to run —
code, runtime, libraries, and system tools. Unlike virtual machines, containers share the host operating system's kernel,
making them fast to start and efficient with resources.

## Key Topics

- **[[docker]]** — the most widely used container platform
- **[[podman]]** — alternative to Docker

## Containers vs VMs

Virtual machines (VM) run a full OS. Containers on the other side share the host kernel and isolate only the
application layer (your app code, its runtime, libraries, dependencies, config file).
This makes containers lightweight, fast to start, and efficient with resources.

## How Containers Work

Your operating system's kernel has features that allow it to isolate groups of processes from each other. 
On Linux, these are namespaces and cgroups. Namespaces give a process its own isolated view of the system — 
its own process tree, network interfaces, and filesystem root. Cgroups limit how much CPU and memory a process can use.

A container is just a regular process on your machine running with these isolation features applied. 
There's no separate OS, no hypervisor — just kernel-level isolation around a normal process.

## Why Containers

- **Consistency** — same environment from development to production
- **Isolation** — dependencies don't conflict between applications
- **Portability** — runs on any machine with a container runtime
- **Efficiency** — lighter than VMs, faster startup, lower overhead
