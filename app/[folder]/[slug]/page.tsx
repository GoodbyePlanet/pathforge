import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';

import { getFileContent } from '@/lib/content';

function formatFolderName(folder: string): string {
  return folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function preprocessWikiLinks(markdown: string, folder: string): string {
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (_, slug) => {
    return `[${slug}](/${folder}/${slug})`;
  });
}

type Props = {
  params: Promise<{ folder: string; slug: string }>;
};

export default async function SlugPage({ params }: Props) {
  const { folder, slug } = await params;
  const fileContent = await getFileContent(folder, slug);
  const { content: rawContent, contentSubpath, title, assignee, status } = fileContent;
  const content = preprocessWikiLinks(rawContent, folder);
  const folderLabel = formatFolderName(folder);

  return (
    <main className='p-8 max-w-3xl mx-auto'>
      <nav className='mb-6 text-sm text-gray-400'>
        <Link href='/' className='hover:text-gray-600 transition-colors'>
          PathForge
        </Link>
        <span className='mx-2'>/</span>
        <Link href={`/${folder}`} className='hover:text-gray-600 transition-colors'>
          {folderLabel}
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-gray-600'>{slug}</span>
      </nav>

      <div className='flex gap-3 mb-8'>
        <Link
          href={`/${folder}`}
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
        >
          ← Back to {folderLabel}
        </Link>
        <span className='text-gray-300'>|</span>
        <Link
          href={`/${folder}/graph`}
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
        >
          View Graph
        </Link>
      </div>

      <header className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h1>
        <div className='text-sm text-gray-500'>
          {assignee && <p>Assignee: {assignee}</p>}
          {status && <p>Status: {status}</p>}
        </div>
      </header>

      <article className='prose prose-gray max-w-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...rest }) => (
              <a
                href={href}
                className='text-blue-600 hover:text-blue-700 underline'
                {...rest}
              >
                {children}
              </a>
            ),
            h1: () => null,
            h2: ({ children }) => (
              <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-3'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-lg font-semibold text-gray-700 mt-4 mb-2'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='text-gray-700 leading-relaxed mb-4'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc list-inside text-gray-700 space-y-1 mb-4'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal list-inside text-gray-700 space-y-1 mb-4'>{children}</ol>
            ),
            li: ({ children }) => <li className='text-gray-700'>{children}</li>,
            code: ({ children, className }) => {
              const isBlock = className?.includes('language-');
              if (isBlock) {
                return (
                  <code className='block bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-800 overflow-x-auto mb-4'>
                    {children}
                  </code>
                );
              }
              return (
                <code className='bg-gray-100 rounded px-1.5 py-0.5 text-sm text-gray-800'>
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className='border-l-4 border-gray-300 pl-4 text-gray-500 italic mb-4'>
                {children}
              </blockquote>
            ),
            img: ({ src, alt, ...rest }) => {
              const imgSrc = typeof src === 'string' ? src : undefined;
              const resolvedSrc = imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')
                ? `/api/content-image/${contentSubpath}/${imgSrc}`
                : imgSrc;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedSrc}
                  alt={alt ?? ''}
                  className='rounded-md my-4 max-w-full'
                  {...rest}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}