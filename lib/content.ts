import { promises as fs } from 'fs';
import path from 'path';

import matter from 'gray-matter';

export type NodeStatus = 'done' | 'in-progress' | 'todo';

const validStatuses = new Set<NodeStatus>(['done', 'in-progress', 'todo']);

export type FileEntry = {
  slug: string;
  title: string;
  path: string;
  assignee?: string;
  status?: NodeStatus;
};

export type FolderGroup = {
  hub: FileEntry;
  children: FileEntry[];
};

export type HierarchicalFiles = {
  groups: FolderGroup[];
  standalone: FileEntry[];
};

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
      const status = validStatuses.has(frontmatter.status)
        ? frontmatter.status as NodeStatus
        : undefined;
      return { slug, title, path: filePath, assignee, status };
    }),
  );

  return fileEntries;
}

async function buildFileEntry(filePath: string): Promise<FileEntry> {
  const slug = path.basename(filePath, '.md');
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const title = extractH1Title(content) ?? slug;
  const assignee = typeof frontmatter.assignee === 'string'
    ? frontmatter.assignee
    : undefined;
  const status = validStatuses.has(frontmatter.status)
    ? frontmatter.status as NodeStatus
    : undefined;
  return { slug, title, path: filePath, assignee, status };
}

export async function getHierarchicalFiles(folder: string): Promise<HierarchicalFiles> {
  const folderPath = path.join(contentDir, folder);
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  const subfolderNames = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const rootMdFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => path.join(folderPath, e.name));

  const groups: FolderGroup[] = [];
  const standalone: FileEntry[] = [];

  for (const filePath of rootMdFiles) {
    const slug = path.basename(filePath, '.md');
    const hub = await buildFileEntry(filePath);

    if (subfolderNames.includes(slug)) {
      const childPaths = await collectMarkdownFiles(path.join(folderPath, slug));
      const children = await Promise.all(childPaths.map(buildFileEntry));
      groups.push({ hub, children });
    } else {
      standalone.push(hub);
    }
  }

  return { groups, standalone };
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