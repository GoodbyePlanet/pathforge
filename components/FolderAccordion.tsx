'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

import Link from 'next/link';

import clsx from 'clsx';

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

type FilterOption = 'all' | 'done' | 'in-progress' | 'todo';

type SearchResult = {
  slug: string;
  title: string;
  status?: NodeStatus;
  assignee?: string;
  snippet?: string;
};

function SearchIcon() {
  return (
    <svg
      className='w-4 h-4 text-gray-400 shrink-0'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z'
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      className='w-4 h-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={clsx(
        'w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0',
        open && 'rotate-90',
      )}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2.5}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className='w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
    </svg>
  );
}

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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className='bg-amber-100 text-amber-900 rounded px-0.5'>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function groupProgress(children: FileItem[]) {
  const done = children.filter((c) => c.status === 'done').length;
  return { done, total: children.length };
}

function ProgressBar({
  done,
  inProgress,
  total,
  rounded = false,
}: {
  done: number;
  inProgress: number;
  total: number;
  rounded?: boolean;
}) {
  const donePct = total > 0 ? (done / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;

  return (
    <div className={clsx('w-full h-1 bg-gray-100 overflow-hidden flex', rounded && 'rounded-full')}>
      <div className='h-full bg-green-500 transition-all' style={{ width: `${donePct}%` }} />
      <div className='h-full bg-amber-400 transition-all' style={{ width: `${inProgressPct}%` }} />
    </div>
  );
}

function StatusFilterPills({
  active,
  onChange,
}: {
  active: FilterOption;
  onChange: (f: FilterOption) => void;
}) {
  const options: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'done', label: 'Done' },
    { value: 'in-progress', label: 'Active' },
    { value: 'todo', label: 'Todo' },
  ];

  return (
    <div className='flex gap-1.5'>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer',
            active === opt.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function matchesFilter(item: FileItem, filter: FilterOption): boolean {
  if (filter === 'all') return true;
  return item.status === filter;
}

function groupMatchesFilter(group: Group, filter: FilterOption): boolean {
  if (filter === 'all') return true;
  return matchesFilter(group.hub, filter) || group.children.some((c) => matchesFilter(c, filter));
}

export function FolderAccordion({ folder, groups, standalone }: FolderAccordionProps) {
  const storageKey = `pathforge-accordion-${folder}`;

  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const persistSlugs = useCallback((slugs: Set<string>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...slugs]));
    } catch { /* quota exceeded — ignore */ }
  }, [storageKey]);

  const isSearchActive = searchQuery.trim().length > 0;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?folder=${encodeURIComponent(folder)}&q=${encodeURIComponent(searchQuery.trim())}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setSearchResults(data.results);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, folder]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const toggle = (slug: string) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      persistSlugs(next);
      return next;
    });
  };

  const expandAll = () => {
    const next = new Set(groups.map((g) => g.hub.slug));
    persistSlugs(next);
    setOpenSlugs(next);
  };

  const collapseAll = () => {
    const next = new Set<string>();
    persistSlugs(next);
    setOpenSlugs(next);
  };

  const allItems = useMemo(
    () => [...standalone, ...groups.flatMap(({ hub, children }) => [hub, ...children])],
    [standalone, groups],
  );

  const totalDone = allItems.filter((i) => i.status === 'done').length;
  const totalInProgress = allItems.filter((i) => i.status === 'in-progress').length;
  const totalTodo = allItems.filter((i) => i.status === 'todo').length;
  const total = allItems.length;

  const filteredStandalone = standalone.filter((f) => matchesFilter(f, filter));
  const filteredGroups = groups.filter((g) => groupMatchesFilter(g, filter));
  const allExpanded = filteredGroups.length > 0
    && filteredGroups.every((g) => openSlugs.has(g.hub.slug));
  const hasFilterResults = filteredStandalone.length > 0 || filteredGroups.length > 0;

  return (
    <div>
      <div className='mb-6 space-y-3'>
        <p className='text-sm text-gray-500'>
          <span className='text-gray-800 font-medium'>
            {totalDone} / {total} done
          </span>
          {totalInProgress > 0 && (
            <span className='text-amber-500'> &nbsp;&bull;&nbsp; {totalInProgress} in progress</span>
          )}
          {totalTodo > 0 && (
            <span className='text-gray-400'> &nbsp;&bull;&nbsp; {totalTodo} todo</span>
          )}
        </p>
        <ProgressBar done={totalDone} inProgress={totalInProgress} total={total} rounded />

        <div className='relative'>
          <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search titles and content...'
            className='w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-gray-200
              bg-white text-gray-700 placeholder-gray-400
              focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200
              transition-colors'
          />
          {isSearchActive && (
            <button
              onClick={clearSearch}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400
                hover:text-gray-600 transition-colors cursor-pointer'
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {!isSearchActive && (
          <div className='flex items-center justify-between'>
            <StatusFilterPills active={filter} onChange={setFilter} />
            {filteredGroups.length > 0 && (
              <button
                onClick={allExpanded ? collapseAll : expandAll}
                className='text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
              >
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            )}
          </div>
        )}
      </div>

      {isSearchActive ? (
        <div>
          {isSearching ? (
            <p className='text-sm text-gray-400 text-center py-8'>Searching...</p>
          ) : searchResults.length === 0 ? (
            <p className='text-sm text-gray-400 text-center py-8'>
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
          ) : (
            <div>
              <p className='text-xs text-gray-400 mb-3'>
                {searchResults.length} result{searchResults.length !== 1 && 's'}
              </p>
              <ul className='space-y-2'>
                {searchResults.map((result) => (
                  <li key={result.slug}>
                    <Link
                      href={`/${folder}/${result.slug}`}
                      className='flex items-start gap-3 p-4 rounded-lg border border-gray-200
                        bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
                    >
                      <span className='mt-0.5'>
                        <StatusDot status={result.status} />
                      </span>
                      <div className='min-w-0 flex-1'>
                        <span className='font-medium text-gray-700 group-hover:text-gray-900'>
                          <HighlightedText text={result.title} query={searchQuery} />
                        </span>
                        {result.snippet && (
                          <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                            <HighlightedText text={result.snippet} query={searchQuery} />
                          </p>
                        )}
                      </div>
                      {result.assignee && (
                        <span className='text-xs text-gray-400 shrink-0 mt-0.5'>
                          {result.assignee}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          {!hasFilterResults && (
            <p className='text-sm text-gray-400 text-center py-8'>
              No items match this filter.
            </p>
          )}

          <ul className='space-y-2'>
            {filteredStandalone.map((file) => (
              <li key={file.slug}>
                <Link
                  href={`/${folder}/${file.slug}`}
                  className='flex items-center gap-3 p-4 rounded-lg border border-gray-200
                    bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group'
                >
                  <StatusDot status={file.status} />
                  <span className='text-gray-700 group-hover:text-gray-900 font-medium'>
                    {file.title}
                  </span>
                  <span className='ml-auto flex items-center gap-3'>
                    {file.assignee && (
                      <span className='text-xs text-gray-400'>{file.assignee}</span>
                    )}
                    <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}

            {filteredGroups.map(({ hub, children }) => {
              const isOpen = openSlugs.has(hub.slug);
              const { done, total: groupTotal } = groupProgress(children);
              const groupInProgress = children.filter((c) => c.status === 'in-progress').length;
              const isComplete = done === groupTotal && groupTotal > 0;

              return (
                <li key={hub.slug}>
                  <div
                    className={clsx(
                      'rounded-lg border overflow-hidden transition-colors',
                      isComplete
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-gray-200 bg-gray-50',
                    )}
                  >
                    <button
                      onClick={() => toggle(hub.slug)}
                      className={clsx(
                        'flex items-center w-full p-4 transition-colors text-left cursor-pointer group',
                        isComplete ? 'hover:bg-green-100/50' : 'hover:bg-gray-100',
                      )}
                    >
                      <ChevronIcon open={isOpen} />
                      <span className='ml-3'>
                        <StatusDot status={hub.status} />
                      </span>
                      <span
                        className={clsx(
                          'ml-3 font-medium',
                          isComplete
                            ? 'text-green-700 group-hover:text-green-900'
                            : 'text-gray-700 group-hover:text-gray-900',
                        )}
                      >
                        {hub.title}
                      </span>
                      <span
                        className={clsx(
                          'ml-auto text-xs',
                          isComplete
                            ? 'text-green-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                        )}
                      >
                        {done > 0 ? `${done} / ${groupTotal} done` : `${groupTotal} topics`}
                      </span>
                    </button>
                    <ProgressBar done={done} inProgress={groupInProgress} total={groupTotal} />
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
                          className='flex items-center gap-3 p-3 rounded-lg border border-dashed
                            border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50
                            transition-colors group'
                        >
                          <StatusDot status={hub.status} />
                          <span className='text-gray-500 group-hover:text-gray-700 text-sm font-medium'>
                            Overview
                          </span>
                          {hub.assignee && (
                            <span className='ml-auto text-xs text-gray-400'>{hub.assignee}</span>
                          )}
                        </Link>
                      </li>
                      {children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={`/${folder}/${child.slug}`}
                            className='flex items-center gap-3 p-3 rounded-lg border border-gray-200
                              bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors group'
                          >
                            <StatusDot status={child.status} />
                            <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium'>
                              {child.title}
                            </span>
                            {child.assignee && (
                              <span className='ml-auto text-xs text-gray-400'>{child.assignee}</span>
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
        </>
      )}
    </div>
  );
}
