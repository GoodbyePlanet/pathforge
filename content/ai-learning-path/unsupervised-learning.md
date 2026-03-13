# Unsupervised Learning

Unsupervised learning finds structure in data without labeled examples. The model discovers patterns, groupings, or representations on its own.

## Core Tasks

**Clustering** — group similar data points together.
- K-means: partition into K clusters by minimizing distance to centroids
- DBSCAN: density-based clustering, handles arbitrary shapes and noise
- Hierarchical clustering: build a tree of nested clusters

**Dimensionality Reduction** — compress high-dimensional data while preserving structure.
- PCA: find the directions of maximum variance
- t-SNE / UMAP: non-linear reduction for visualization

**Density Estimation** — model the underlying probability distribution of data.

## Why It Matters

Most data in the world is unlabeled. Unsupervised methods let you explore data, find anomalies, compress representations, and pre-train models before fine-tuning on labeled data.

## Connection to Deep Learning

Self-supervised learning (used to pre-train large language models) is a form of unsupervised learning where the model creates its own labels from the data structure — for example, predicting the next token.