import Link from 'next/link';

import { getHierarchicalFiles } from '@/lib/content';
import { formatFolderName } from '@/lib/format';

import { FolderAccordion } from '@/components/FolderAccordion';

type Props = {
  params: Promise<{ folder: string }>;
};

export default async function FolderPage({ params }: Props) {
  const { folder } = await params;
  const { groups, standalone } = await getHierarchicalFiles(folder);
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

      <FolderAccordion
        folder={folder}
        groups={groups}
        standalone={standalone}
      />
    </main>
  );
}
