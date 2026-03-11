# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PathForge is a Next.js app that reads markdown files from the local filesystem (organized in folders as learning paths), parses references between them, and displays an interactive graph visualization. No editor — users manage markdown files in their IDE. Clicking a graph node opens rendered markdown content.

## Tech Stack
- TypeScript
- Next.js
- Tailwind

## Commands

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Architecture

**Content** lives in `/content/<folder>/<file>.md`. Folders = learning paths, files = nodes in the graph.

**Server/client split** — Next.js App Router:
- Server components handle all filesystem I/O (`lib/content.ts`, `lib/markdown.ts`)
- React Flow graph must be a client component (`'use client'`)

**Key modules:**
- `lib/content.ts` — `getFolders()`, `getFilesInFolder(folder)`, `getFileContent(folder, slug)`
- `lib/markdown.ts` — `extractLinks(markdown)`, `buildGraphData(folder)`, `renderMarkdown(markdown)`
- `components/GraphNode.tsx` — custom React Flow node (dot + label, Obsidian-style aesthetic)

**Routing:**
- `/` — home, lists learning path folders
- `/[folder]` — lists markdown files in a folder + link to graph
- `/[folder]/[slug]` — renders a single markdown file
- `/[folder]/graph` — server component passes graph data to `GraphView.tsx` client component

**Link formats supported:** both `[[wiki-links]]` (via `remark-wiki-link`) and standard `[label](./file.md)`.

**Graph positions:** hybrid — d3-force auto-layout on first load; manual drag positions persist in `localStorage` keyed by folder.

**Graph scope:** per-folder (one learning path at a time, fully isolated).
