'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useReactFlow,
  useViewport,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type OnNodeDrag,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useForceLayout } from '@/lib/forceLayout';
import { GraphNode } from '@/components/GraphNode';
import { GraphEdge } from '@/components/GraphEdge';
import { NodePopup } from '@/components/NodePopup';
import { StatusLegend } from '@/components/StatusLegend';

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { graphEdge: GraphEdge };

type GraphViewProps = {
  folder: string;
  nodes: Node[];
  edges: Edge[];
};

function getConnectedNodeIds(nodeId: string, edges: Edge[]): Set<string> {
  const connected = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  }
  return connected;
}

type PopupState = {
  nodeId: string;
  label: string;
  assignee?: string;
  status?: string;
  position: { x: number; y: number };
  placement: 'left' | 'right';
};

function GraphViewInner({ folder, nodes: rawNodes, edges: rawEdges }: GraphViewProps) {
  const { flowToScreenPosition } = useReactFlow();
  const { zoom: rawZoom } = useViewport();
  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const quantizedZoom = useMemo(
    () => Math.round(rawZoom * 10) / 10,
    [rawZoom],
  );

  const connectedIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    return getConnectedNodeIds(selectedNodeId, rawEdges);
  }, [selectedNodeId, rawEdges]);

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useForceLayout(
    rawNodes,
    rawEdges,
    setNodes,
  );

  // Apply selection/highlight data and zoom to nodes
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.id === selectedNodeId,
          isHighlighted: connectedIds.has(node.id),
          isDimmed: selectedNodeId !== null
            && node.id !== selectedNodeId
            && !connectedIds.has(node.id),
          zoom: quantizedZoom,
        },
      })),
    );
  }, [selectedNodeId, connectedIds, quantizedZoom, setNodes]);

  const styledEdges = useMemo(() => {
    if (!selectedNodeId) return rawEdges;
    return rawEdges.map((edge) => {
      const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        ...edge,
        data: { ...edge.data, isConnected },
        style: isConnected
          ? { stroke: '#6b7280', strokeWidth: 2 }
          : { stroke: '#d1d5db', strokeWidth: 1, opacity: 0.2 },
      };
    });
  }, [rawEdges, selectedNodeId]);

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
      if (selectedNodeId === node.id) {
        setSelectedNodeId(null);
        setPopup(null);
        return;
      }

      setSelectedNodeId(node.id);

      const screenPos = flowToScreenPosition({
        x: node.position.x,
        y: node.position.y,
      });

      const container = document.querySelector('.react-flow');
      const containerRect = container?.getBoundingClientRect();
      const midX = containerRect
        ? containerRect.left + containerRect.width / 2
        : window.innerWidth / 2;

      // Place popup on the side with more space
      const placement = screenPos.x < midX ? 'right' : 'left';

      setPopup({
        nodeId: node.id,
        label: String(node.data.label),
        assignee: node.data.assignee as string | undefined,
        status: node.data.status as string | undefined,
        position: { x: screenPos.x, y: screenPos.y },
        placement,
      });
    },
    [selectedNodeId, flowToScreenPosition],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setPopup(null);
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onNodeDragStart={handleDragStart}
        onNodeDrag={handleDrag}
        onNodeDragStop={handleDragStop}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: 'graphEdge',
          style: { stroke: '#d1d5db', strokeWidth: 1 },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ backgroundColor: '#f8fafc' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color='#d1d5db' />
      </ReactFlow>
      {popup && (
        <NodePopup
          label={popup.label}
          assignee={popup.assignee}
          status={popup.status}
          href={`/${folder}/${popup.nodeId}`}
          position={popup.position}
          placement={popup.placement}
          onClose={() => {
            setSelectedNodeId(null);
            setPopup(null);
          }}
        />
      )}
    </>
  );
}

export function GraphView(props: GraphViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className='w-full h-full' />;

  return (
    <div className='relative w-full h-full'>
      <ReactFlowProvider>
        <GraphViewInner {...props} />
      </ReactFlowProvider>
      <StatusLegend />
    </div>
  );
}
