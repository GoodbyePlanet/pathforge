# PathForge

An interactive graph viewer for markdown-based learning paths. Reads markdown files from the local filesystem,
parses references between them, and renders an interactive node graph. Clicking a node opens the
rendered Markdown content.

Markdown files live in `/content/<folder>/` — folders are learning paths, files are graph nodes.
No built-in editor; manage files in your IDE.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
