'use client';

import Link from 'next/link';

type NodePopupProps = {
  label: string;
  assignee?: string;
  href: string;
  position: { x: number; y: number };
  placement?: 'left' | 'right';
  onClose: () => void;
};

export function NodePopup({
  label,
  assignee,
  href,
  position,
  placement = 'right',
  onClose,
}: NodePopupProps) {
  const transform = placement === 'right'
    ? 'translate(24px, -50%)'
    : 'translate(calc(-100% - 24px), -50%)';

  return (
    <>
      <div className='fixed inset-0 z-40' onClick={onClose} />
      <div
        className='absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-48'
        style={{ left: position.x, top: position.y, transform }}
      >
        <p className='text-sm font-medium text-gray-900'>{label}</p>
        {assignee && (
          <p className='mt-1 text-xs text-gray-500'>
            Assignee: <span className='text-gray-700'>{assignee}</span>
          </p>
        )}
        <Link
          href={href}
          className='mt-2 inline-block text-xs text-blue-600 hover:text-blue-800 hover:underline'
        >
          Open page
        </Link>
      </div>
    </>
  );
}
