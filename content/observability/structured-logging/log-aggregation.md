---
title: "Log Aggregation"
assignee: Nemanja Vasic
status: todo
---

# Log Aggregation

Log aggregation collects logs from all services into a centralized system for searching and analysis. Common stacks include ELK (Elasticsearch, Logstash, Kibana), Grafana Loki, and cloud-native solutions. Centralization is essential — you cannot SSH into 50 containers to grep logs.