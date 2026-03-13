import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkWikiLink from 'remark-wiki-link';
import type { Node } from '@xyflow/react';
import type { Edge } from '@xyflow/react';

import { getFilesInFolder } from './content';

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

function walkAst(node: AstNode, slugs: Set<string>): void {
  if (node.type === 'wikiLink') {
    const wikiNode = node as unknown as WikiLinkNode;
    if (wikiNode.value) {
      slugs.add(wikiNode.value);
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
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      walkAst(child, slugs);
    }
  }
}

export function extractLinks(markdown: string): string[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkWikiLink, { aliasDivider: '|' });

  const tree = processor.parse(markdown);
  const slugs = new Set<string>();
  walkAst(tree as unknown as AstNode, slugs);
  return Array.from(slugs);
}

export async function buildGraphData(
  folder: string,
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const files = await getFilesInFolder(folder);

  const nodes: Node[] = files.map((file) => ({
    id: file.slug,
    type: 'graphNode',
    data: { label: file.title },
    position: { x: 0, y: 0 },
  }));

  const slugSet = new Set(files.map((f) => f.slug));
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  for (const file of files) {
    const { promises: fs } = await import('fs');
    const content = await fs.readFile(file.path, 'utf-8');
    const links = extractLinks(content);

    for (const target of links) {
      if (slugSet.has(target) && target !== file.slug) {
        const edgeId = [file.slug, target].sort().join('-');
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);
          edges.push({ id: edgeId, source: file.slug, target });
        }
      }
    }
  }

  return { nodes, edges };
}