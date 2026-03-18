'use client';

import clsx from 'clsx';

export type StatusFilterValue = 'all' | 'done' | 'in-progress' | 'todo';

type StatusFilterProps = {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
};

const FILTERS: { value: StatusFilterValue; label: string; activeClass: string }[] = [
  { value: 'all', label: 'All', activeClass: 'bg-gray-700 text-white' },
  { value: 'done', label: 'Done', activeClass: 'bg-blue-500 text-white' },
  { value: 'in-progress', label: 'Active', activeClass: 'bg-sky-400 text-white' },
  { value: 'todo', label: 'Todo', activeClass: 'bg-gray-400 text-white' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-3 py-2 shadow-sm'>
      <p className='text-[10px] font-bold text-gray-500 mb-1.5'>Filter</p>
      <div className='flex flex-wrap gap-1'>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={clsx(
              'text-[9px] px-2 py-0.5 rounded font-medium transition-colors duration-150',
              value === f.value
                ? f.activeClass
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}