'use client';

const items = [
  { label: 'Done', type: 'done' },
  { label: 'In Progress', type: 'in-progress' },
  { label: 'Todo', type: 'todo' },
] as const;

function LegendDot({ type }: { type: 'done' | 'in-progress' | 'todo' }) {
  const size = 12;

  if (type === 'done') {
    return (
      <div
        className='rounded-full border'
        style={{
          width: size,
          height: size,
          backgroundColor: 'hsl(210, 73%, 70%)',
          borderColor: 'hsl(210, 75%, 48%)',
        }}
      />
    );
  }

  if (type === 'in-progress') {
    return (
      <div className='relative' style={{ width: size, height: size }}>
        <div
          className='rounded-full border'
          style={{
            width: size,
            height: size,
            backgroundColor: 'hsl(210, 55%, 82%)',
            borderColor: 'hsl(210, 60%, 68%)',
          }}
        />
        <div
          className='absolute inset-0 rounded-full animate-pulse-ring'
          style={{ border: '1.5px solid hsl(210, 60%, 68%)' }}
        />
      </div>
    );
  }

  return (
    <div className='relative' style={{ width: size + 6, height: size + 6 }}>
      <div
        className='absolute rounded-full border'
        style={{
          top: 3,
          left: 3,
          width: size,
          height: size,
          backgroundColor: 'hsl(210, 55%, 82%)',
          borderColor: 'hsl(210, 60%, 68%)',
        }}
      />
      <div
        className='absolute inset-0 rounded-full'
        style={{ border: '1.5px dashed hsl(210, 60%, 68%)' }}
      />
    </div>
  );
}

export function StatusLegend() {
  return (
    <div
      className='bg-white/90 backdrop-blur-sm rounded-lg border
        border-gray-200 px-3 py-2 shadow-sm'
    >
      <p className='text-[10px] font-medium text-gray-500 mb-1.5'>Status</p>
      <div className='flex flex-col gap-1.5'>
        {items.map(({ label, type }) => (
          <div key={type} className='flex items-center gap-2'>
            <div className='flex items-center justify-center w-[18px]'>
              <LegendDot type={type} />
            </div>
            <span className='text-[10px] text-gray-600'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
