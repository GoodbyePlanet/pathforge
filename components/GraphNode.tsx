'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

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

export function GraphNode({ data }: NodeProps) {
  return (
    <div className='flex flex-col items-center cursor-pointer'>
      <div className='relative w-5 h-5'>
        <div className='w-5 h-5 rounded-full bg-blue-200 border border-blue-300' />
        <Handle type='target' position={Position.Top} style={centerHandleStyle} />
        <Handle type='source' position={Position.Bottom} style={centerHandleStyle} />
      </div>
      <span
        className='mt-1.5 text-gray-500 whitespace-nowrap max-w-28 truncate text-center'
        style={{ fontSize: '8px' }}
      >
        {String(data.label)}
      </span>
    </div>
  );
}