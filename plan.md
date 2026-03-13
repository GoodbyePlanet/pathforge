# PathForge v1 — Implementation Plan

## Context

Build a Next.js app that reads markdown files from the local filesystem (organized in folders representing learning paths), parses references between them, and displays an interactive graph visualization. No editor — users create/edit markdown files in their IDE. Clicking a graph node opens the rendered markdown content.

## Decisions

- **Storage**: Local filesystem (`/content/<folder>/<file>.md`)
- **Link format**: Both `[[wiki-links]]` and standard `[label](./file.md)`
- **Graph scope**: Per-folder (one learning path at a time)
- **Graph positions**: Hybrid (auto-layout by default, persist on manual drag via localStorage)
- **Styling**: Tailwind CSS
- **Graph library**: React Flow (`@xyflow/react`) — native React, built-in drag, custom JSX nodes
- **Markdown parsing**: unified/remark stack + `remark-wiki-link` for `[[link]]` support

## Project Structure

```
pathforge/
├── content/                      # Markdown files (user-managed)
│   └── ai-learning-graph/
│       ├── rag.md
│       ├── context-window.md
│       └── mcps.md
├── app/
│   ├── layout.tsx                # Root layout with nav
│   ├── page.tsx                  # Home — list of learning paths (folders)
│   ├── [folder]/
│   │   ├── page.tsx              # Folder view — list files + link to graph
│   │   └── [slug]/
│   │       └── page.tsx          # Render single markdown file
│   └── [folder]/graph/
│       ├── page.tsx              # Server component — reads files, builds graph data
│       └── GraphView.tsx         # Client component — React Flow graph
├── lib/
│   ├── content.ts                # Read folders/files from /content
│   └── markdown.ts               # Parse markdown, extract links, render to HTML
├── components/
│   └── GraphNode.tsx             # Custom React Flow node (dot + label)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Steps

### Step 1: Initialize Next.js project
- `npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false`
- Verify it runs with `npm run dev`

### Step 2: Install dependencies
```bash
npm install @xyflow/react react-markdown unified remark-parse remark-wiki-link remark-rehype rehype-stringify remark-gfm
```

### Step 3: Create sample content
Create `/content/ai-learning-graph/` with 3 sample markdown files that reference each other using `[[wiki-links]]`:
- `rag.md` — references `[[context-window]]`
- `context-window.md` — references `[[rag]]` and `[[mcps]]`
- `mcps.md` — references `[[context-window]]`

### Step 4: Build content reading utilities (`lib/content.ts`)
- `getFolders()` — reads directory names from `/content`
- `getFilesInFolder(folder)` — reads `.md` files in a folder, returns `{ slug, title, path }`
- `getFileContent(folder, slug)` — reads raw markdown content of a file

### Step 5: Build markdown parsing utilities (`lib/markdown.ts`)
- `extractLinks(markdown)` — parse markdown AST with remark + remark-wiki-link, walk tree to find all `wikiLink` nodes and standard `[](link)` nodes, return array of referenced slugs
- `buildGraphData(folder)` — for all files in a folder, extract links and build `{ nodes: [...], edges: [...] }` structure compatible with React Flow
- `renderMarkdown(markdown)` — render markdown to React elements using `react-markdown` with wiki-link plugin (convert `[[links]]` to clickable `<a>` tags)

### Step 6: Home page (`app/page.tsx`)
- Server component
- Call `getFolders()`, display list of learning path folders as cards/links
- Each card links to `/[folder]`

### Step 7: Folder page (`app/[folder]/page.tsx`)
- Server component
- Call `getFilesInFolder(folder)`, display list of markdown files
- Link to view each file at `/[folder]/[slug]`
- Link to view graph at `/[folder]/graph`

### Step 8: Markdown viewer page (`app/[folder]/[slug]/page.tsx`)
- Server component
- Call `getFileContent(folder, slug)`, render with `renderMarkdown()`
- Wiki-links in the rendered content should link to `/[folder]/[referenced-slug]`
- Back link to folder page and graph

### Step 9: Graph page — server component (`app/[folder]/graph/page.tsx`)
- Call `buildGraphData(folder)` to get nodes and edges
- Pass data as props to `<GraphView>` client component

### Step 10: Custom graph node (`components/GraphNode.tsx`)
- `'use client'` component
- Renders a dark circle (dot) with the file title as a label below
- Styled to match the Obsidian aesthetic from the reference image

### Step 11: Graph view — client component (`app/[folder]/graph/GraphView.tsx`)
- `'use client'` component wrapping `<ReactFlow>`
- Register custom node type (`GraphNode`)
- Implement d3-force layout hook for initial auto-positioning
- `onNodeDragStop` handler saves updated positions to `localStorage` (keyed by folder)
- On mount: check localStorage for persisted positions, apply them; otherwise run force layout
- `onNodeClick` handler navigates to `/[folder]/[slug]`
- Minimal UI: zoom controls, dark background, thin edge lines

### Step 12: Navigation & polish
- Add consistent nav bar with breadcrumbs (Home > Folder > File/Graph)
- Style pages with Tailwind for a clean, minimal look
- Ensure all links between pages work correctly

## Key Files to Modify/Create

| File | Purpose |
|---|---|
| `lib/content.ts` | Filesystem reading utilities |
| `lib/markdown.ts` | Markdown parsing + link extraction |
| `app/page.tsx` | Home — list learning paths |
| `app/[folder]/page.tsx` | Folder — list files |
| `app/[folder]/[slug]/page.tsx` | Render markdown file |
| `app/[folder]/graph/page.tsx` | Graph page (server) |
| `app/[folder]/graph/GraphView.tsx` | React Flow graph (client) |
| `components/GraphNode.tsx` | Custom node component |

## Packages

| Package | Purpose |
|---|---|
| `@xyflow/react` | Interactive graph with drag, zoom, custom nodes |
| `react-markdown` | Render markdown as React components |
| `unified` + `remark-parse` | Parse markdown to AST |
| `remark-wiki-link` | Parse `[[wiki-links]]` in markdown |
| `remark-rehype` + `rehype-stringify` | AST to HTML conversion |
| `remark-gfm` | GitHub Flavored Markdown (tables, etc.) |

## Verification

1. Create sample markdown files in `/content/ai-learning-graph/` with cross-references
2. Run `npm run dev` and verify:
   - Home page lists the `ai-learning-graph` folder
   - Folder page lists all markdown files
   - Clicking a file renders the markdown with clickable wiki-links
   - Graph page shows nodes for each file with edges for references
   - Nodes are draggable and positions persist on page reload
   - Clicking a node navigates to the markdown viewer
3. Add a second folder to verify per-folder graph isolation
