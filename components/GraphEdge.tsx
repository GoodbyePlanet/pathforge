'use client';

import { useState } from 'react';
import {
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

import clsx from 'clsx';

export function GraphEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const isConnected = (data?.isConnected as boolean) ?? false;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const relationship = (data?.relationship as string) ?? 'Related';

  const pathStyle = {
    ...style,
    transition: 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease',
  };

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Invisible wider path for easier hover target */}
      <path
        d={edgePath}
        fill='none'
        stroke='transparent'
        strokeWidth={16}
      />
      <path
        id={id}
        className={clsx(
          'react-flow__edge-path',
          isConnected && 'react-flow__edge-path--active',
        )}
        d={edgePath}
        fill='none'
        style={pathStyle}
      />
      {hovered && (
        <foreignObject
          x={labelX - 60}
          y={labelY - 14}
          width={120}
          height={28}
          className='pointer-events-none overflow-visible'
        >
          <div className='flex items-center justify-center'>
            <span
              className='bg-gray-900 text-white text-xs px-2 py-0.5 rounded shadow-lg
                whitespace-nowrap'
            >
              {relationship}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
