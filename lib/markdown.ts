import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkWikiLink from 'remark-wiki-link';
import type { Node } from '@xyflow/react';
import type { Edge } from '@xyflow/react';

import { getFilesInFolder } from './content';

type LinkContext = {
  slug: string;
  heading?: string;
};

type WikiLinkNode = {
  type: 'wikiLink';
  value: string;
};

type LinkNode = {
  type: 'link';
  url: string;
};

type AstNode = {
  type: string;
  children?: AstNode[];
  value?: string;
  url?: string;
};

function getHeadingText(node: AstNode): string {
  if (node.value) return node.value;
  if (node.children) return node.children.map(getHeadingText).join('');
  return '';
}

function walkAst(
  node: AstNode,
  slugs: Set<string>,
  linksWithContext: LinkContext[],
  currentHeading?: string,
): void {
  let heading = currentHeading;

  if (node.type === 'heading') {
    heading = getHeadingText(node);
  }

  if (node.type === 'wikiLink') {
    const wikiNode = node as unknown as WikiLinkNode;
    if (wikiNode.value) {
      slugs.add(wikiNode.value);
      linksWithContext.push({ slug: wikiNode.value, heading });
    }
    return;
  }

  if (node.type === 'link') {
    const linkNode = node as unknown as LinkNode;
    if (linkNode.url && linkNode.url.endsWith('.md')) {
      const filename = linkNode.url.split('/').pop() ?? '';
      const slug = filename.replace(/\.md$/, '');
      if (slug) {
        slugs.add(slug);
        linksWithContext.push({ slug, heading });
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      walkAst(child, slugs, linksWithContext, heading);
    }
  }
}

export function extractLinks(markdown: string): string[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkWikiLink, { aliasDivider: '|' });

  const tree = processor.parse(markdown);
  const slugs = new Set<string>();
  walkAst(tree as unknown as AstNode, slugs, []);
  return Array.from(slugs);
}

export function extractLinksWithContext(markdown: string): LinkContext[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkWikiLink, { aliasDivider: '|' });

  const tree = processor.parse(markdown);
  const slugs = new Set<string>();
  const links: LinkContext[] = [];
  walkAst(tree as unknown as AstNode, slugs, links);
  return links;
}

export async function buildGraphData(
  folder: string,
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const files = await getFilesInFolder(folder);

  const nodes: Node[] = files.map((file) => ({
    id: file.slug,
    type: 'graphNode',
    data: { label: file.title, assignee: file.assignee },
    position: { x: 0, y: 0 },
  }));

  const slugSet = new Set(files.map((f) => f.slug));
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  for (const file of files) {
    const { promises: fs } = await import('fs');
    const content = await fs.readFile(file.path, 'utf-8');
    const links = extractLinksWithContext(content);

    for (const link of links) {
      if (slugSet.has(link.slug) && link.slug !== file.slug) {
        const edgeId = [file.slug, link.slug].sort().join('-');
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);
          const relationship = link.heading
            ? `Referenced in "${link.heading}"`
            : 'Related';
          edges.push({
            id: edgeId,
            source: file.slug,
            target: link.slug,
            data: { relationship },
          });
        }
      }
    }
  }

  // Calculate degree (connection count) for each node
  const degreeCounts = new Map<string, number>();
  for (const edge of edges) {
    degreeCounts.set(edge.source, (degreeCounts.get(edge.source) ?? 0) + 1);
    degreeCounts.set(edge.target, (degreeCounts.get(edge.target) ?? 0) + 1);
  }

  // Assign cluster indices via BFS from highest-degree nodes
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  }

  const clusterMap = new Map<string, number>();
  const sortedByDegree = [...nodes]
    .sort((a, b) => (degreeCounts.get(b.id) ?? 0) - (degreeCounts.get(a.id) ?? 0));

  let clusterIndex = 0;
  for (const seed of sortedByDegree) {
    if (clusterMap.has(seed.id)) continue;

    const queue = [seed.id];
    clusterMap.set(seed.id, clusterIndex);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!clusterMap.has(neighbor)) {
          clusterMap.set(neighbor, clusterIndex);
          queue.push(neighbor);
        }
      }
    }

    clusterIndex++;
  }

  const enrichedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      degree: degreeCounts.get(node.id) ?? 0,
      clusterIndex: clusterMap.get(node.id) ?? 0,
    },
  }));

  return { nodes: enrichedNodes, edges };
}