import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'PathForge',
  description: 'Interactive learning path graph viewer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-white text-gray-900 min-h-screen'>
        <nav className='px-6 py-3 border-b border-gray-200 bg-white'>
          <Link href='/' className='text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors'>
            PathForge
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}