'use client';

import { useMemo } from 'react';

import type { Node } from '@xyflow/react';

type ContributorStats = {
  name: string;
  done: number;
  inProgress: number;
};

type ContributorsLegendProps = {
  nodes: Node[];
};

function computeContributorStats(nodes: Node[]): ContributorStats[] {
  const statsMap = new Map<string, { done: number; inProgress: number }>();

  for (const node of nodes) {
    const assignee = node.data.assignee as string | undefined;
    const status = node.data.status as string | undefined;
    if (!assignee) continue;

    const isActive = status === 'done' || status === 'in-progress';
    if (!isActive) continue;

    if (!statsMap.has(assignee)) {
      statsMap.set(assignee, { done: 0, inProgress: 0 });
    }

    const entry = statsMap.get(assignee)!;
    if (status === 'done') entry.done++;
    if (status === 'in-progress') entry.inProgress++;
  }

  return Array.from(statsMap.entries())
    .map(([name, counts]) => ({ name, ...counts }))
    .sort((a, b) => (b.done + b.inProgress) - (a.done + a.inProgress));
}

export function ContributorsLegend({ nodes }: ContributorsLegendProps) {
  const contributors = useMemo(() => computeContributorStats(nodes), [nodes]);

  if (contributors.length === 0) return null;

  return (
    <div
      className='bg-white/90 backdrop-blur-sm rounded-lg border
        border-gray-200 px-3 py-2 shadow-sm'
    >
      <p className='text-[10px] font-bold text-gray-500 mb-1.5'>
        Contributors
      </p>
      <div className='flex flex-col gap-1.5'>
        {contributors.map(({ name, done, inProgress }) => (
          <div key={name} className='flex items-center justify-between gap-3'>
            <span className='text-[10px] text-gray-600 truncate max-w-[100px]'>
              {name}
            </span>
            <div className='flex items-center gap-1.5'>
              <span
                className='text-[10px] font-medium text-blue-700
                  bg-blue-100 rounded px-1 py-px'
              >
                {done}
              </span>
              <span
                className='text-[10px] font-medium text-sky-600
                  bg-sky-100 rounded px-1 py-px'
              >
                {inProgress}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-gray-100'>
        <span
          className='text-[9px] font-medium text-blue-700
            bg-blue-100 rounded px-1 py-px'
        >
          done
        </span>
        <span
          className='text-[9px] font-medium text-sky-600
            bg-sky-100 rounded px-1 py-px'
        >
          in progress
        </span>
      </div>
    </div>
  );
}
