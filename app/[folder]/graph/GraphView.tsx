'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type OnNodeDrag,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useForceLayout } from '@/lib/forceLayout';
import { GraphNode } from '@/components/GraphNode';

const nodeTypes = { graphNode: GraphNode };

type GraphViewProps = {
  folder: string;
  nodes: Node[];
  edges: Edge[];
};

function GraphViewInner({ folder, nodes: rawNodes, edges: rawEdges }: GraphViewProps) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useForceLayout(
    rawNodes,
    rawEdges,
    setNodes,
  );

  const handleDragStart: OnNodeDrag = useCallback(
    (_, node) => onNodeDragStart(node.id),
    [onNodeDragStart],
  );

  const handleDrag: OnNodeDrag = useCallback(
    (_, node) => onNodeDrag(node.id, node.position.x, node.position.y),
    [onNodeDrag],
  );

  const handleDragStop: OnNodeDrag = useCallback(
    (_, node) => onNodeDragStop(node.id),
    [onNodeDragStop],
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/${folder}/${node.id}`);
    },
    [folder, router],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={rawEdges}
      onNodesChange={onNodesChange}
      onNodeDragStart={handleDragStart}
      onNodeDrag={handleDrag}
      onNodeDragStop={handleDragStop}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={false}
      defaultEdgeOptions={{
        type: 'straight',
        style: { stroke: '#93c5fd', strokeWidth: 1 },
      }}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      style={{ backgroundColor: '#f8fafc' }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} color='#d1d5db' />
    </ReactFlow>
  );
}

export function GraphView(props: GraphViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className='w-full h-full' />;

  return (
    <div className='w-full h-full'>
      <GraphViewInner {...props} />
    </div>
  );
}
