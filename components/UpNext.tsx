'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import type { Node, Edge } from '@xyflow/react';

type UpNextProps = {
  folder: string;
  nodes: Node[];
  edges: Edge[];
};

type FrontierNode = {
  id: string;
  label: string;
  readiness: number;
};

function computeFrontier(nodes: Node[], edges: Edge[]): FrontierNode[] {
  const doneIds = new Set(
    nodes.filter((n) => n.data.status === 'done').map((n) => n.id),
  );

  if (doneIds.size === 0) return [];

  return nodes
    .filter((n) => {
      const status = n.data.status as string | undefined;
      return status === 'todo' || !status;
    })
    .map((node) => {
      const readiness = edges.filter(
        (e) =>
          (e.source === node.id && doneIds.has(e.target)) ||
          (e.target === node.id && doneIds.has(e.source)),
      ).length;
      return { id: node.id, label: String(node.data.label), readiness };
    })
    .filter((x) => x.readiness > 0)
    .sort((a, b) => b.readiness - a.readiness)
    .slice(0, 3);
}

export function UpNext({ folder, nodes, edges }: UpNextProps) {
  const frontier = useMemo(() => computeFrontier(nodes, edges), [nodes, edges]);

  if (frontier.length === 0) return null;

  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-3 py-2 shadow-sm'>
      <p className='text-[10px] font-bold text-gray-500 mb-1.5'>Up Next</p>
      <div className='flex flex-col gap-1.5'>
        {frontier.map(({ id, label, readiness }) => (
          <Link
            key={id}
            href={`/${folder}/${id}`}
            className='flex items-center justify-between gap-2 group'
          >
            <span
              className='text-[10px] text-gray-700 truncate max-w-[110px]
                group-hover:text-blue-600 transition-colors duration-150'
            >
              {label}
            </span>
            <div className='flex items-center gap-0.5 shrink-0'>
              {Array.from({ length: Math.min(readiness, 4) }).map((_, i) => (
                <div key={i} className='w-1 h-1 rounded-full bg-blue-400 opacity-60' />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
