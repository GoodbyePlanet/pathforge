import { promises as fs } from 'fs';
import path from 'path';

import matter from 'gray-matter';

export type FileEntry = { slug: string; title: string; path: string; assignee?: string };

const contentDir = path.join(process.cwd(), 'content');

export async function getFolders(): Promise<string[]> {
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function extractH1Title(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export async function getFilesInFolder(folder: string): Promise<FileEntry[]> {
  const folderPath = path.join(contentDir, folder);
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  const mdFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith('.md'),
  );

  const fileEntries = await Promise.all(
    mdFiles.map(async (entry) => {
      const slug = entry.name.replace(/\.md$/, '');
      const filePath = path.join(folderPath, entry.name);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(raw);
      const title = extractH1Title(content) ?? slug;
      const assignee = typeof frontmatter.assignee === 'string'
        ? frontmatter.assignee
        : undefined;
      return { slug, title, path: filePath, assignee };
    }),
  );

  return fileEntries;
}

export async function getFileContent(folder: string, slug: string): Promise<string> {
  const filePath = path.join(contentDir, folder, `${slug}.md`);
  return fs.readFile(filePath, 'utf-8');
}