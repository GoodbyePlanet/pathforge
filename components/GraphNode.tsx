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

type NodeColor = { bg: string; border: string };

function getNodeColor(
  id: string,
  clusterIndex: number,
  totalClusters: number,
  isHub: boolean,
): NodeColor {
  // Evenly space hub hues around the color wheel
  const baseHue = (clusterIndex / Math.max(totalClusters, 1)) * 360;

  if (isHub) {
    return {
      bg: `hsl(${baseHue}, 70%, 72%)`,
      border: `hsl(${baseHue}, 75%, 58%)`,
    };
  }

  // Leaf: slight hue offset based on id, softer saturation, lighter
  const hueOffset = (hashString(id) % 30) - 15; // -15 to +15 degrees
  const leafHue = (baseHue + hueOffset + 360) % 360;

  return {
    bg: `hsl(${leafHue}, 55%, 82%)`,
    border: `hsl(${leafHue}, 60%, 68%)`,
  };
}

export function GraphNode({ id, data }: NodeProps) {
  const isSelected = data.isSelected as boolean | undefined;
  const isHighlighted = data.isHighlighted as boolean | undefined;
  const isDimmed = data.isDimmed as boolean | undefined;
  const degree = (data.degree as number) ?? 0;
  const clusterIndex = (data.clusterIndex as number) ?? 0;
  const totalClusters = (data.totalClusters as number) ?? 1;
  const isHub = (data.isHub as boolean) ?? false;
  const zoom = (data.zoom as number) ?? 1;
  const [showTooltip, setShowTooltip] = useState(false);

  const size = useMemo(() => getNodeSize(degree), [degree]);

  const color = useMemo(
    () => getNodeColor(id, clusterIndex, totalClusters, isHub),
    [id, clusterIndex, totalClusters, isHub],
  );

  const dotStyle = useMemo(() => {
    const base = {
      backgroundColor: color.bg,
      borderColor: color.border,
      width: size,
      height: size,
      transition: 'all 0.3s ease',
    };

    if (isSelected) {
      return {
        ...base,
        boxShadow: `0 0 12px 4px ${color.border}`,
        transform: 'scale(1.15)',
      };
    }

    if (isHighlighted) {
      return {
        ...base,
        boxShadow: `0 0 8px 2px ${color.border}80`,
      };
    }

    return base;
  }, [isSelected, isHighlighted, color, size]);

  const label = String(data.label);

  const labelOpacity = useMemo(() => {
    if (zoom < 0.4) return 0;
    if (zoom < 0.7) return (isSelected || isHighlighted) ? 1 : 0;
    return 1;
  }, [zoom, isSelected, isHighlighted]);

  return (
    <div
      className={clsx(
        'flex flex-col items-center cursor-pointer transition-opacity duration-300',
        isDimmed && 'opacity-20',
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className='relative' style={{ width: size, height: size }}>
        <div
          className='rounded-full border'
          style={dotStyle}
        />
        <Handle type='target' position={Position.Top} style={centerHandleStyle} />
        <Handle type='source' position={Position.Bottom} style={centerHandleStyle} />
      </div>
      <span
        className={clsx(
          'mt-1.5 whitespace-nowrap max-w-28 truncate text-center transition-colors duration-300',
          isSelected ? 'text-gray-900 font-semibold' :
            isHighlighted ? 'text-gray-700 font-medium' : 'text-gray-500',
        )}
        style={{ fontSize: '8px', opacity: labelOpacity, transition: 'opacity 0.3s ease, color 0.3s ease' }}
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
