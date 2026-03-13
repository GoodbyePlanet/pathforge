import Link from 'next/link';

import { buildGraphData } from '@/lib/markdown';
import { GraphView } from './GraphView';

function formatFolderName(folder: string): string {
  return folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Props = {
  params: Promise<{ folder: string }>;
};

export default async function GraphPage({ params }: Props) {
  const { folder } = await params;
  const { nodes, edges } = await buildGraphData(folder);
  const folderLabel = formatFolderName(folder);

  return (
    <div className='flex flex-col h-screen bg-white'>
      <header className='flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white shrink-0'>
        <nav className='text-sm text-gray-400'>
          <Link href='/' className='hover:text-gray-600 transition-colors'>
            PathForge
          </Link>
          <span className='mx-2'>/</span>
          <Link href={`/${folder}`} className='hover:text-gray-600 transition-colors'>
            {folderLabel}
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-gray-600'>Graph</span>
        </nav>
      </header>
      <div className='flex-1'>
        <GraphView folder={folder} nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}