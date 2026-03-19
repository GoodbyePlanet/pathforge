'use client';

import { useState } from 'react';

import Link from 'next/link';

import { NodeStatus } from '@/lib/content';

type FileItem = {
  slug: string;
  title: string;
  status?: NodeStatus;
  assignee?: string;
};

type Group = {
  hub: FileItem;
  children: FileItem[];
};

type FolderAccordionProps = {
  folder: string;
  groups: Group[];
  standalone: FileItem[];
};

function StatusDot({ status }: { status?: NodeStatus }) {
  if (status === 'done') {
    return <span className='w-2.5 h-2.5 rounded-full bg-green-500 shrink-0' />;
  }
  if (status === 'in-progress') {
    return <span className='w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0' />;
  }
  if (status === 'todo') {
    return <span className='w-2.5 h-2.5 rounded-full border-2 border-gray-300 shrink-0' />;
  }
  return <span className='w-2.5 h-2.5 shrink-0' />;
}

function groupProgress(children: FileItem[]) {
  const done = children.filter((c) => c.status === 'done').length;
  return { done, total: children.length };
}

function ProgressBar({ done, inProgress, total }: { done: number; inProgress: number; total: number }) {
  const donePct = total > 0 ? (done / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;

  return (
    <div className='w-full h-1 bg-gray-100 rounded-full overflow-hidden flex'>
      <div className='h-full bg-green-500 transition-all' style={{ width: `${donePct}%` }} />
      <div className='h-full bg-amber-400 transition-all' style={{ width: `${inProgressPct}%` }} />
    </div>
  );
}

export function FolderAccordion({ folder, groups, standalone }: FolderAccordionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const toggle = (slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  };

  const allItems = [
    ...standalone,
    ...groups.flatMap(({ hub, children }) => [hub, ...children]),
  ];
  const totalDone = allItems.filter((i) => i.status === 'done').length;
  const totalInProgress = allItems.filter((i) => i.status === 'in-progress').length;
  const totalTodo = allItems.filter((i) => i.status === 'todo').length;
  const total = allItems.length;

  return (
    <div>
      <div className='mb-6 space-y-2'>
        <p className='text-sm text-gray-500'>
          <span className='text-gray-800 font-medium'>{totalDone} / {total} done</span>
          {totalInProgress > 0 && (
            <span className='text-amber-500'> &nbsp;•&nbsp; {totalInProgress} in progress</span>
          )}
          {totalTodo > 0 && (
            <span className='text-gray-400'> &nbsp;•&nbsp; {totalTodo} todo</span>
          )}
        </p>
        <ProgressBar done={totalDone} inProgress={totalInProgress} total={total} />
      </div>

      <ul className='space-y-2'>
        {standalone.map((file) => (
          <li key={file.slug}>
            <Link
              href={`/${folder}/${file.slug}`}
              className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
            >
              <StatusDot status={file.status} />
              <span className='text-gray-700 group-hover:text-gray-900 font-medium'>
                {file.title}
              </span>
              {file.assignee && (
                <span className='ml-auto text-xs text-gray-400'>
                  {file.assignee}
                </span>
              )}
            </Link>
          </li>
        ))}

        {groups.map(({ hub, children }) => {
          const isOpen = openSlug === hub.slug;
          const { done, total: groupTotal } = groupProgress(children);
          const groupInProgress = children.filter((c) => c.status === 'in-progress').length;

          return (
            <li key={hub.slug}>
              <div>
                <button
                  onClick={() => toggle(hub.slug)}
                  className='flex items-center w-full p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors text-left cursor-pointer group'
                >
                  <span
                    className='mr-3 text-gray-400 transition-transform duration-200'
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    ▶
                  </span>
                  <StatusDot status={hub.status} />
                  <span className='ml-3 text-gray-700 group-hover:text-gray-900 font-medium'>
                    {hub.title}
                  </span>
                  <span className='ml-auto text-xs text-gray-400 group-hover:text-gray-500'>
                    {done} / {groupTotal} done
                  </span>
                </button>
                <div className='px-4'>
                  <ProgressBar done={done} inProgress={groupInProgress} total={groupTotal} />
                </div>
              </div>

              <div
                className='overflow-hidden transition-all duration-200'
                style={{
                  maxHeight: isOpen ? `${(children.length + 1) * 56 + 8}px` : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <ul className='ml-8 mt-1 space-y-1'>
                  <li>
                    <Link
                      href={`/${folder}/${hub.slug}`}
                      className='flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors group'
                    >
                      <StatusDot status={hub.status} />
                      <span className='text-gray-500 group-hover:text-gray-700 text-sm font-medium'>
                        Overview
                      </span>
                      {hub.assignee && (
                        <span className='ml-auto text-xs text-gray-400'>
                          {hub.assignee}
                        </span>
                      )}
                    </Link>
                  </li>
                  {children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={`/${folder}/${child.slug}`}
                        className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors group'
                      >
                        <StatusDot status={child.status} />
                        <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium'>
                          {child.title}
                        </span>
                        {child.assignee && (
                          <span className='ml-auto text-xs text-gray-400'>
                            {child.assignee}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
