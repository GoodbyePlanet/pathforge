import Link from 'next/link';

import { getFilesInFolder } from '@/lib/content';

function formatFolderName(folder: string): string {
  return folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Props = {
  params: Promise<{ folder: string }>;
};

export default async function FolderPage({ params }: Props) {
  const { folder } = await params;
  const files = await getFilesInFolder(folder);
  const folderLabel = formatFolderName(folder);

  return (
    <main className='p-8 max-w-3xl mx-auto'>
      <nav className='mb-6 text-sm text-gray-400'>
        <Link href='/' className='hover:text-gray-600 transition-colors'>
          PathForge
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-gray-600'>{folderLabel}</span>
      </nav>

      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>{folderLabel}</h1>
        <Link
          href={`/${folder}/graph`}
          className='px-4 py-2 rounded-md bg-gray-100 border border-gray-200 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors'
        >
          View Graph
        </Link>
      </div>

      <ul className='space-y-2'>
        {files.map((file) => (
          <li key={file.slug}>
            <Link
              href={`/${folder}/${file.slug}`}
              className='flex items-center p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
            >
              <span className='text-gray-700 group-hover:text-gray-900 font-medium'>
                {file.title}
              </span>
              <span className='ml-auto text-xs text-gray-400 group-hover:text-gray-500'>
                {file.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
