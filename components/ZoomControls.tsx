'use client';

import { useReactFlow } from '@xyflow/react';

type ZoomButtonProps = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
};

function ZoomButton({ onClick, label, children }: ZoomButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className='flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors'
    >
      {children}
    </button>
  );
}

export function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm flex flex-col divide-y divide-gray-200 overflow-hidden'>
      <ZoomButton onClick={() => zoomIn()} label='Zoom in'>
        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
      </ZoomButton>
      <ZoomButton onClick={() => fitView({ padding: 0.2 })} label='Fit view'>
        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 8V5a1 1 0 011-1h3M4 16v3a1 1 0 001 1h3m10-14h3a1 1 0 011 1v3m0 8v3a1 1 0 01-1 1h-3'
          />
        </svg>
      </ZoomButton>
      <ZoomButton onClick={() => zoomOut()} label='Zoom out'>
        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
        </svg>
      </ZoomButton>
    </div>
  );
}