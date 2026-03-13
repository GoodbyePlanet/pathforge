'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { GraphNode } from '@/components/GraphNode';

const nodeTypes = { graphNode: GraphNode };

function applyRadialLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;

  const adj: Record<string, string[]> = {};
  for (const node of nodes) adj[node.id] = [];
  for (const edge of edges) {
    adj[edge.source].push(edge.target);
  }

  const inDegree: Record<string, number> = {};
  for (const node of nodes) inDegree[node.id] = 0;
  for (const edge of edges) inDegree[edge.target]++;

  const root =
    nodes.find((n) => n.id === 'ai')?.id ??
    nodes.find((n) => inDegree[n.id] === 0)?.id ??
    nodes[0].id;

  const visited = new Set<string>([root]);
  const nodeParent: Record<string, string | null> = { [root]: null };
  const queue = [root];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const child of adj[current]) {
      if (!visited.has(child)) {
        visited.add(child);
        nodeParent[child] = current;
        queue.push(child);
      }
    }
  }

  const childrenOf: Record<string, string[]> = {};
  for (const [nodeId, parentId] of Object.entries(nodeParent)) {
    if (parentId !== null) {
      if (!childrenOf[parentId]) childrenOf[parentId] = [];
      childrenOf[parentId].push(nodeId);
    }
  }

  const positions: Record<string, { x: number; y: number }> = {};
  const CENTER = { x: 0, y: 0 };
  const R1 = 240;
  const R2 = 460;

  positions[root] = CENTER;

  const level1 = childrenOf[root] ?? [];
  level1.forEach((nodeId, i) => {
    const angle = (2 * Math.PI * i) / level1.length - Math.PI / 2;
    positions[nodeId] = {
      x: CENTER.x + R1 * Math.cos(angle),
      y: CENTER.y + R1 * Math.sin(angle),
    };
  });

  for (const l1Node of level1) {
    const l2Nodes = childrenOf[l1Node] ?? [];
    if (l2Nodes.length === 0) continue;

    const parentPos = positions[l1Node];
    const parentAngle = Math.atan2(parentPos.y - CENTER.y, parentPos.x - CENTER.x);
    const spread = Math.PI / 4.5;

    l2Nodes.forEach((nodeId, i) => {
      const offset = spread * (i - (l2Nodes.length - 1) / 2);
      const angle = parentAngle + offset;
      positions[nodeId] = {
        x: CENTER.x + R2 * Math.cos(angle),
        y: CENTER.y + R2 * Math.sin(angle),
      };
    });
  }

  return nodes.map((node) => ({
    ...node,
    position: positions[node.id] ?? { x: 0, y: 0 },
  }));
}

type GraphViewProps = {
  folder: string;
  nodes: Node[];
  edges: Edge[];
};

export function GraphView({ folder, nodes: rawNodes, edges: rawEdges }: GraphViewProps) {
  const router = useRouter();

  const layoutedNodes = applyRadialLayout(rawNodes, rawEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/${folder}/${node.id}`);
    },
    [folder, router],
  );

  return (
    <div className='w-full h-full'>
      <ReactFlow
        defaultNodes={layoutedNodes}
        defaultEdges={rawEdges}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: 'straight',
          style: { stroke: '#93c5fd', strokeWidth: 1 },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ backgroundColor: '#f8fafc' }}
      />
    </div>
  );
}