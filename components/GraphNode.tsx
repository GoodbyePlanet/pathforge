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
  status?: string,
): NodeColor {
  const baseHue = (clusterIndex / Math.max(totalClusters, 1)) * 360;

  if (isHub) {
    return getDoneAdjusted(baseHue, 70, 72, 75, 58, status);
  }

  const hueOffset = (hashString(id) % 30) - 15;
  const leafHue = (baseHue + hueOffset + 360) % 360;
  return getDoneAdjusted(leafHue, 55, 82, 60, 68, status);
}

function getDoneAdjusted(
  hue: number,
  sat: number,
  light: number,
  borderSat: number,
  borderLight: number,
  status?: string,
): NodeColor {
  if (status === 'todo') {
    return {
      bg: `hsl(${hue}, 20%, 94%)`,
      border: `hsl(${hue}, 65%, 52%)`,
    };
  }

  if (status === 'done') {
    sat = Math.min(sat + 20, 100);
    light = Math.max(light - 12, 0);
    borderSat = Math.min(borderSat + 18, 100);
    borderLight = Math.max(borderLight - 10, 0);
  }

  return {
    bg: `hsl(${hue}, ${sat}%, ${light}%)`,
    border: `hsl(${hue}, ${borderSat}%, ${borderLight}%)`,
  };
}

// Shape definitions — polygon points normalized to a 100x100 viewBox
type ShapeDef =
  | { type: 'circle' }
  | { type: 'polygon'; points: string };

const SHAPES: ShapeDef[] = [
  { type: 'circle' },
  { type: 'polygon', points: '50,2 81,13 97,42 92,74 66,95 34,95 8,74 3,42 19,13' },
  { type: 'polygon', points: '50,2 79,9 97,31 97,69 79,91 50,98 21,91 3,69 3,31 21,9' },
];

function getShape(clusterIndex: number): ShapeDef {
  return SHAPES[clusterIndex % SHAPES.length];
}

function renderShapeSvg(
  shape: ShapeDef,
  fill: string,
  stroke: string,
  strokeWidth: number,
  strokeDasharray?: string,
  className?: string,
) {
  const common = { fill, stroke, strokeWidth, strokeDasharray };

  if (shape.type === 'circle') {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r={50 - strokeWidth / 2} {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <polygon points={shape.points} {...common} />
    </svg>
  );
}

export function GraphNode({ id, data }: NodeProps) {
  const isSelected = data.isSelected as boolean | undefined;
  const isHighlighted = data.isHighlighted as boolean | undefined;
  const isDimmed = data.isDimmed as boolean | undefined;
  const degree = (data.degree as number) ?? 0;
  const clusterIndex = (data.clusterIndex as number) ?? 0;
  const totalClusters = (data.totalClusters as number) ?? 1;
  const isHub = (data.isHub as boolean) ?? false;
  const status = data.status as string | undefined;
  const zoom = (data.zoom as number) ?? 1;
  const [showTooltip, setShowTooltip] = useState(false);

  const size = useMemo(() => getNodeSize(degree), [degree]);

  const color = useMemo(
    () => getNodeColor(id, clusterIndex, totalClusters, isHub, status),
    [id, clusterIndex, totalClusters, isHub, status],
  );

  const shape = useMemo(() => getShape(clusterIndex), [clusterIndex]);

  const svgFilter = useMemo(() => {
    if (isSelected) {
      return `drop-shadow(0 0 6px ${color.border}) drop-shadow(0 0 12px ${color.border})`;
    }
    if (isHighlighted) {
      return `drop-shadow(0 0 4px ${color.border}80)`;
    }
    return undefined;
  }, [isSelected, isHighlighted, color]);

  const svgStyle = useMemo(() => ({
    width: size,
    height: size,
    transition: 'all 0.3s ease',
    filter: svgFilter,
    transform: isSelected ? 'scale(1.15)' : undefined,
  }), [size, svgFilter, isSelected]);

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
        <div style={svgStyle}>
          {renderShapeSvg(shape, color.bg, color.border, 4)}
        </div>
        {status === 'in-progress' && (
          <div
            className='absolute inset-0 animate-pulse-ring'
            style={{ width: size, height: size }}
          >
            {renderShapeSvg(shape, 'none', color.border, 4)}
          </div>
        )}
        {status === 'todo' && (
          <div
            className='absolute'
            style={{
              inset: -6,
              width: size + 12,
              height: size + 12,
            }}
          >
            {renderShapeSvg(shape, 'none', color.border, 3, '7 4')}
          </div>
        )}
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
