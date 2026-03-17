'use client';

type GraphSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function GraphSearch({ value, onChange }: GraphSearchProps) {
  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm flex items-center gap-1.5 px-2.5 py-1.5'>
      <svg
        className='w-3 h-3 text-gray-400 shrink-0'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        />
      </svg>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search nodes…'
        className='text-xs text-gray-700 bg-transparent outline-none w-36 placeholder:text-gray-400'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='text-gray-400 hover:text-gray-600 leading-none'
          aria-label='Clear search'
        >
          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </div>
  );
}