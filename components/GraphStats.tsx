'use client';

import { useMemo } from 'react';

import type { Node, Edge } from '@xyflow/react';

type GraphStatsProps = {
  nodes: Node[];
  edges: Edge[];
};

export function GraphStats({ nodes, edges }: GraphStatsProps) {
  const { total, done, pct } = useMemo(() => {
    const total = nodes.length;
    const done = nodes.filter((n) => n.data.status === 'done').length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pct };
  }, [nodes]);

  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-3 py-2 shadow-sm'>
      <p className='text-[10px] font-bold text-gray-500 mb-1.5'>Statistics</p>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-6'>
          <span className='text-[10px] text-gray-600'>Nodes</span>
          <span className='text-[10px] font-medium text-gray-800'>{total}</span>
        </div>
        <div className='flex items-center justify-between gap-6'>
          <span className='text-[10px] text-gray-600'>Edges</span>
          <span className='text-[10px] font-medium text-gray-800'>{edges.length}</span>
        </div>
        <div className='flex items-center justify-between gap-6'>
          <span className='text-[10px] text-gray-600'>Done</span>
          <span className='text-[10px] font-medium text-gray-800'>
            {done}/{total}
            <span className='text-gray-500 font-normal ml-0.5'>({pct}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}