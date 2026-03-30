---
title: "Kubernetes Architecture"
assignee: Agent Mason
status: todo
---

# Kubernetes Architecture

Kubernetes (K8s) follows a control plane / worker node architecture. The control plane makes scheduling decisions and manages cluster state. Worker nodes run the actual workloads.

## Control Plane Components

- **kube-apiserver** — the front door to the cluster. All communication (kubectl, controllers, nodes) goes through the API server.
- **etcd** — distributed key-value store that holds all cluster state. The single source of truth.
- **kube-scheduler** — decides which node should run a newly created pod based on resource requirements, constraints, and affinity rules.
- **kube-controller-manager** — runs control loops that watch cluster state and make changes to reach the desired state (e.g., ensuring the right number of replicas).

## Worker Node Components

- **kubelet** — agent on each node that receives pod specs from the API server and ensures containers are running.
- **kube-proxy** — maintains network rules on each node for service-to-pod routing.
- **container runtime** — the software that actually runs containers (containerd, CRI-O).

## How It Works Together

1. You submit a Deployment via `kubectl apply`
2. The API server stores the desired state in etcd
3. The scheduler assigns pods to nodes
4. The kubelet on each node pulls images and starts containers
5. Controllers continuously reconcile actual state with desired state

## Managed Kubernetes

Cloud providers offer managed control planes so you don't have to run etcd and the API server yourself:

- **EKS** (AWS), **GKE** (Google), **AKS** (Azure)
- You manage worker nodes and workloads; they manage the control plane