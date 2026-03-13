import Link from 'next/link';

import { getFolders } from '@/lib/content';

function formatFolderName(folder: string): string {
  return folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function Home() {
  const folders = await getFolders();

  return (
    <main className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>PathForge</h1>
      <p className='text-gray-500 mb-8'>Choose a learning path to explore</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {folders.map((folder) => (
          <Link
            key={folder}
            href={`/${folder}`}
            className='block p-6 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
          >
            <h2 className='text-lg font-semibold text-gray-800 group-hover:text-gray-900'>
              {formatFolderName(folder)}
            </h2>
            <p className='mt-1 text-sm text-gray-400 group-hover:text-gray-500'>
              {folder}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}