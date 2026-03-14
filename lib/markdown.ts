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

  // Identify hubs: nodes with degree >= 2 (or all nodes if none qualify)
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  }

  const sortedByDegree = [...nodes]
    .sort((a, b) => (degreeCounts.get(b.id) ?? 0) - (degreeCounts.get(a.id) ?? 0));

  // Hubs are nodes with degree >= 2 (i.e. connected to multiple nodes)
  const hubs = sortedByDegree.filter((n) => (degreeCounts.get(n.id) ?? 0) >= 2);
  const hubSet = new Set(hubs.map((h) => h.id));

  // If no hubs found, treat all nodes as hubs
  if (hubSet.size === 0) {
    for (const node of nodes) {
      hubSet.add(node.id);
    }
  }

  // Assign each hub a unique color index
  const hubColorIndex = new Map<string, number>();
  let colorIdx = 0;
  for (const hub of hubs.length > 0 ? hubs : sortedByDegree) {
    if (!hubColorIndex.has(hub.id)) {
      hubColorIndex.set(hub.id, colorIdx++);
    }
  }
  const totalHubs = Math.max(colorIdx, 1);

  // Assign each non-hub node to its highest-degree neighbor (its color parent)
  const nodeHubMap = new Map<string, string>();
  for (const node of nodes) {
    if (hubSet.has(node.id)) {
      nodeHubMap.set(node.id, node.id);
      continue;
    }

    const neighbors = adjacency.get(node.id) ?? [];
    let bestHub: string | null = null;
    let bestDegree = -1;
    for (const neighbor of neighbors) {
      const deg = degreeCounts.get(neighbor) ?? 0;
      if (deg > bestDegree) {
        bestDegree = deg;
        bestHub = neighbor;
      }
    }

    // Walk up to find the nearest hub
    if (bestHub && hubSet.has(bestHub)) {
      nodeHubMap.set(node.id, bestHub);
    } else if (bestHub) {
      nodeHubMap.set(node.id, bestHub);
    } else {
      nodeHubMap.set(node.id, node.id);
    }
  }

  const enrichedNodes = nodes.map((node) => {
    const parentHub = nodeHubMap.get(node.id) ?? node.id;
    const ci = hubColorIndex.get(parentHub) ?? hubColorIndex.get(node.id) ?? 0;
    return {
      ...node,
      data: {
        ...node.data,
        degree: degreeCounts.get(node.id) ?? 0,
        clusterIndex: ci,
        totalClusters: totalHubs,
        isHub: hubSet.has(node.id),
      },
    };
  });

  return { nodes: enrichedNodes, edges };
}