import Link from 'next/link';

import { getFolders, getHierarchicalFiles, NodeStatus } from '@/lib/content';
import { formatFolderName } from '@/lib/format';

type FolderStats = {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
};

function computeStats(items: { status?: NodeStatus }[]): FolderStats {
  const done = items.filter((i) => i.status === 'done').length;
  const inProgress = items.filter((i) => i.status === 'in-progress').length;
  const todo = items.filter((i) => i.status === 'todo').length;
  return { total: items.length, done, inProgress, todo };
}

async function getFolderStats(folder: string): Promise<FolderStats> {
  const { groups, standalone } = await getHierarchicalFiles(folder);
  const allItems = [
    ...standalone,
    ...groups.flatMap(({ hub, children }) => [hub, ...children]),
  ];
  return computeStats(allItems);
}

export default async function Home() {
  const folders = await getFolders();
  const folderData = await Promise.all(
    folders.map(async (folder) => ({
      folder,
      label: formatFolderName(folder),
      stats: await getFolderStats(folder),
    })),
  );

  const globalDone = folderData.reduce((sum, { stats }) => sum + stats.done, 0);
  const globalTotal = folderData.reduce((sum, { stats }) => sum + stats.total, 0);
  const globalInProgress = folderData.reduce((sum, { stats }) => sum + stats.inProgress, 0);

  return (
    <main className='p-8 max-w-4xl mx-auto'>
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-gray-900 mb-1'>PathForge</h1>
        <p className='text-gray-500 mb-4'>Choose a learning path to explore</p>
        <div className='space-y-1.5'>
          <p className='text-sm text-gray-500'>
            <span className='text-gray-800 font-medium'>{globalDone} / {globalTotal} done</span>
            {globalInProgress > 0 && (
              <span className='text-amber-500'> &nbsp;•&nbsp; {globalInProgress} in progress</span>
            )}
          </p>
          <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex'>
            <div
              className='h-full bg-green-500 transition-all'
              style={{ width: globalTotal > 0 ? `${(globalDone / globalTotal) * 100}%` : '0%' }}
            />
            <div
              className='h-full bg-amber-400 transition-all'
              style={{ width: globalTotal > 0 ? `${(globalInProgress / globalTotal) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {folderData.map(({ folder, label, stats }) => {
          const donePct = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
          const inProgressPct = stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

          return (
            <Link
              key={folder}
              href={`/${folder}`}
              className='flex flex-col gap-3 p-5 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
            >
              <div>
                <h2 className='text-base font-semibold text-gray-800 group-hover:text-gray-900'>
                  {label}
                </h2>
                <p className='mt-0.5 text-xs text-gray-400'>
                  {stats.done} / {stats.total} done
                  {stats.inProgress > 0 && (
                    <span className='text-amber-500'> &nbsp;•&nbsp; {stats.inProgress} in progress</span>
                  )}
                </p>
              </div>
              <div className='w-full h-1 bg-gray-200 rounded-full overflow-hidden flex'>
                <div className='h-full bg-green-500 transition-all' style={{ width: `${donePct}%` }} />
                <div className='h-full bg-amber-400 transition-all' style={{ width: `${inProgressPct}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
