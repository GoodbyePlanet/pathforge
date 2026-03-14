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

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getFilesInFolder(folder: string): Promise<FileEntry[]> {
  const folderPath = path.join(contentDir, folder);
  const mdFilePaths = await collectMarkdownFiles(folderPath);

  const fileEntries = await Promise.all(
    mdFilePaths.map(async (filePath) => {
      const slug = path.basename(filePath, '.md');
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
  const folderPath = path.join(contentDir, folder);
  const allFiles = await collectMarkdownFiles(folderPath);
  const match = allFiles.find((f) => path.basename(f, '.md') === slug);

  if (!match) {
    throw new Error(`File not found: ${slug}.md in ${folder}`);
  }

  return fs.readFile(match, 'utf-8');
}