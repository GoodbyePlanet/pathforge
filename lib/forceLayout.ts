'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import { type Node, type Edge } from '@xyflow/react';

type SimNode = SimulationNodeDatum & { id: string };
type SimLink = SimulationLinkDatum<SimNode>;

type UseForceLayoutReturn = {
  onNodeDragStart: (nodeId: string) => void;
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
  onNodeDragStop: (nodeId: string) => void;
};

export function useForceLayout(
  rawNodes: Node[],
  edges: Edge[],
  setNodes: (updater: (nodes: Node[]) => Node[]) => void,
): UseForceLayoutReturn {
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);

  useEffect(() => {
    const simNodes: SimNode[] = rawNodes.map((n) => ({ id: n.id }));
    const simLinks: SimLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    simNodesRef.current = simNodes;

    const simulation = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(100),
      )
      .force('charge', forceManyBody<SimNode>().strength(-300))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide<SimNode>(50))
      .alphaDecay(0.02);

    // Run simulation synchronously to get final positions immediately
    simulation.stop();
    const totalTicks = Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
    );
    for (let i = 0; i < totalTicks; i++) {
      simulation.tick();
    }

    // Apply final positions in one batch
    const positions = new Map(
      simNodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]),
    );
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        position: positions.get(node.id) ?? node.position,
      })),
    );

    // Set up live tick handler for drag interactions
    simulation
      .on('tick', () => {
        const pos = new Map(
          simNodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]),
        );
        setNodes((currentNodes) =>
          currentNodes.map((node) => ({
            ...node,
            position: pos.get(node.id) ?? node.position,
          })),
        );
      });

    simRef.current = simulation;

    return () => {
      simulation.stop();
      simRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNodeDragStart = useCallback((nodeId: string) => {
    const sim = simRef.current;
    if (!sim) return;

    sim.alphaTarget(0.3).restart();

    const simNode = simNodesRef.current.find((n) => n.id === nodeId);
    if (simNode) {
      simNode.fx = simNode.x;
      simNode.fy = simNode.y;
    }
  }, []);

  const onNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    const simNode = simNodesRef.current.find((n) => n.id === nodeId);
    if (simNode) {
      simNode.fx = x;
      simNode.fy = y;
    }
  }, []);

  const onNodeDragStop = useCallback((nodeId: string) => {
    const sim = simRef.current;
    if (!sim) return;

    sim.alphaTarget(0);

    const simNode = simNodesRef.current.find((n) => n.id === nodeId);
    if (simNode) {
      simNode.fx = null;
      simNode.fy = null;
    }
  }, []);

  return { onNodeDragStart, onNodeDrag, onNodeDragStop };
}
