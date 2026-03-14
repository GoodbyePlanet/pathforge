'use client';

import { useState } from 'react';

import Link from 'next/link';

type FileItem = {
  slug: string;
  title: string;
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

export function FolderAccordion({ folder, groups, standalone }: FolderAccordionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const toggle = (slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <ul className='space-y-2'>
      {groups.map(({ hub, children }) => {
        const isOpen = openSlug === hub.slug;

        return (
          <li key={hub.slug}>
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
              <span className='text-gray-700 group-hover:text-gray-900 font-medium'>
                {hub.title}
              </span>
              <span className='ml-auto text-xs text-gray-400 group-hover:text-gray-500'>
                {children.length} topics
              </span>
            </button>

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
                    className='flex items-center p-3 rounded-lg border border-dashed border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors group'
                  >
                    <span className='text-gray-500 group-hover:text-gray-700 text-sm font-medium'>
                      Overview
                    </span>
                    <span className='ml-auto text-xs text-gray-400 group-hover:text-gray-500'>
                      {hub.slug}
                    </span>
                  </Link>
                </li>
                {children.map((child) => (
                  <li key={child.slug}>
                    <Link
                      href={`/${folder}/${child.slug}`}
                      className='flex items-center p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors group'
                    >
                      <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium'>
                        {child.title}
                      </span>
                      <span className='ml-auto text-xs text-gray-400 group-hover:text-gray-500'>
                        {child.slug}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}

      {standalone.map((file) => (
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
  );
}
