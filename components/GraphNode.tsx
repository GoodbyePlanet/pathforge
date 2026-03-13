'use client';

import { useMemo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import clsx from 'clsx';

const centerHandleStyle = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

const CLUSTER_COLORS = [
  { bg: '#fca5a5', border: '#f87171' }, // red
  { bg: '#fdba74', border: '#fb923c' }, // orange
  { bg: '#fde047', border: '#facc15' }, // yellow
  { bg: '#86efac', border: '#4ade80' }, // green
  { bg: '#67e8f9', border: '#22d3ee' }, // cyan
  { bg: '#93c5fd', border: '#60a5fa' }, // blue
  { bg: '#c4b5fd', border: '#a78bfa' }, // violet
  { bg: '#f0abfc', border: '#e879f9' }, // fuchsia
  { bg: '#fda4af', border: '#fb7185' }, // rose
  { bg: '#a5f3fc', border: '#67e8f9' }, // teal
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getNodeSize(degree: number): number {
  const base = 20;
  const scale = 4;
  return base + Math.min(degree, 8) * scale;
}

export function GraphNode({ id, data }: NodeProps) {
  const isSelected = data.isSelected as boolean | undefined;
  const isHighlighted = data.isHighlighted as boolean | undefined;
  const isDimmed = data.isDimmed as boolean | undefined;
  const degree = (data.degree as number) ?? 0;
  const clusterIndex = (data.clusterIndex as number) ?? 0;
  const [showTooltip, setShowTooltip] = useState(false);

  const size = useMemo(() => getNodeSize(degree), [degree]);

  const color = useMemo(() => {
    const index = hashString(id) % CLUSTER_COLORS.length;
    return CLUSTER_COLORS[index];
  }, [id]);

  const dotStyle = useMemo(() => {
    if (isSelected || isHighlighted) {
      return {
        backgroundColor: '#9ca3af',
        borderColor: '#6b7280',
        width: size,
        height: size,
      };
    }
    return {
      backgroundColor: color.bg,
      borderColor: color.border,
      width: size,
      height: size,
    };
  }, [isSelected, isHighlighted, color, size]);

  const label = String(data.label);

  return (
    <div
      className={clsx(
        'flex flex-col items-center cursor-pointer transition-opacity duration-200',
        isDimmed && 'opacity-20',
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className='relative' style={{ width: size, height: size }}>
        <div
          className={clsx(
            'rounded-full border transition-colors duration-200',
            isSelected && 'ring-2 ring-gray-400',
          )}
          style={dotStyle}
        />
        <Handle type='target' position={Position.Top} style={centerHandleStyle} />
        <Handle type='source' position={Position.Bottom} style={centerHandleStyle} />
      </div>
      <span
        className={clsx(
          'mt-1.5 whitespace-nowrap max-w-28 truncate text-center',
          isSelected || isHighlighted ? 'text-gray-800 font-medium' : 'text-gray-500',
        )}
        style={{ fontSize: '8px' }}
      >
        {label}
      </span>
      {showTooltip && label.length > 18 && (
        <div
          className='absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white
            text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50'
        >
          {label}
        </div>
      )}
    </div>
  );
}
