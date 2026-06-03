import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { formatFolderName } from '@/lib/format';
import { getFolders, getHierarchicalFiles } from '@/lib/content';
import { computeStats } from '@/app/page';
import Home from '@/app/page';

vi.mock('@/lib/content', () => ({
  getFolders: vi.fn(),
  getHierarchicalFiles: vi.fn(),
}));

describe('formatFolderName', () => {
  it('capitalises a single lowercase word — "docker" → "Docker"', () => {
    expect(formatFolderName('docker')).toBe('Docker');
  });
  it('capitalises each word in a hyphen-separated slug — "docker-compose" → "Docker Compose"', () => {
    expect(formatFolderName('docker-compose')).toBe('Docker Compose');
  });
  it('uppercases known acronym "ai" → "AI"', () => {
    expect(formatFolderName('ai')).toBe('AI');
  });
  it('uppercases known acronym inside a multi-word slug — "learn-ai" → "Learn AI"', () => {
    expect(formatFolderName('learn-ai')).toBe('Learn AI');
  });
  it('handles multiple consecutive acronyms — "ai-ml-api" → "AI ML API"', () => {
    expect(formatFolderName('ai-ml-api')).toBe('AI ML API');
  });
});

describe('computeStats', () => {
  it('counts zero items when list is empty — total 0, done 0, inProgress 0, todo 0', () => {
    expect(computeStats([])).toEqual({ total: 0, done: 0, inProgress: 0, todo: 0 });
  });
  it('counts a single done item — total 1, done 1', () => {
    expect(computeStats([{ status: 'done' }])).toEqual({ total: 1, done: 1, inProgress: 0, todo: 0 });
  });
  it('counts a single in-progress item — total 1, inProgress 1', () => {
    expect(computeStats([{ status: 'in-progress' }])).toEqual({ total: 1, done: 0, inProgress: 1, todo: 0 });
  });
  it('counts a single todo item — total 1, todo 1', () => {
    expect(computeStats([{ status: 'todo' }])).toEqual({ total: 1, done: 0, inProgress: 0, todo: 1 });
  });
  it('counts an item with no status — included in total but not in done/inProgress/todo', () => {
    expect(computeStats([{}])).toEqual({ total: 1, done: 0, inProgress: 0, todo: 0 });
  });
  it('counts mixed statuses correctly across multiple items', () => {
    const items = [
      { status: 'done' as const },
      { status: 'done' as const },
      { status: 'in-progress' as const },
      { status: 'todo' as const },
      {},
    ];
    expect(computeStats(items)).toEqual({ total: 5, done: 2, inProgress: 1, todo: 1 });
  });
  it('total always equals the full array length regardless of status values', () => {
    const items = [
      { status: 'done' as const },
      { status: 'in-progress' as const },
      {},
    ];
    expect(computeStats(items).total).toBe(3);
  });
});

describe('Home page', () => {
  // --- global header stats ---
  it('shows "0 / 0 done" when there are no folders', async () => {
    vi.mocked(getFolders).mockResolvedValue([]);
    const component = await Home();
    render(component);
    expect(screen.getByText(/0 \/ 0 done/)).toBeInTheDocument();
  });
  it('shows correct global done / total count across all folders', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker', 'networking']);
    vi.mocked(getHierarchicalFiles)
      .mockResolvedValueOnce({ groups: [], standalone: [
        { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
        { slug: 'b', title: 'B', path: '/b.md', status: 'done' },
      ] })
      .mockResolvedValueOnce({ groups: [], standalone: [
        { slug: 'c', title: 'C', path: '/c.md', status: 'done' },
      ] });
    render(await Home());
    expect(screen.getByText(/3 \/ 3 done/)).toBeInTheDocument();
  });

  it('hides the global in-progress count when it is zero', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
    ] });
    render(await Home());
    expect(screen.queryByText(/in progress/)).not.toBeInTheDocument();
  });

  it('shows the global in-progress count when it is greater than zero', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'in-progress' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'done' },
    ] });
    render(await Home());
    expect(screen.getAllByText(/1 in progress/).length).toBeGreaterThan(0);
  });

  // --- global progress bar ---
  it('global done bar has width 0% when total is zero', async () => {
    vi.mocked(getFolders).mockResolvedValue([]);
    const { container } = render(await Home());
    const [globalGreenBar] = container.querySelectorAll<HTMLElement>('.h-1\\.5 .bg-green-500');
    expect(globalGreenBar.style.width).toBe('0%');
  });

  it('global done bar width reflects done / total percentage', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'todo' },
      { slug: 'c', title: 'C', path: '/c.md', status: 'todo' },
      { slug: 'd', title: 'D', path: '/d.md', status: 'todo' },
    ] });
    const { container } = render(await Home());
    const [globalGreenBar] = container.querySelectorAll<HTMLElement>('.h-1\\.5 .bg-green-500');
    expect(globalGreenBar.style.width).toBe('25%');
  });

  it('global in-progress bar width reflects inProgress / total percentage', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'in-progress' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'in-progress' },
      { slug: 'c', title: 'C', path: '/c.md', status: 'todo' },
      { slug: 'd', title: 'D', path: '/d.md', status: 'todo' },
    ] });
    const { container } = render(await Home());
    const [globalAmberBar] = container.querySelectorAll<HTMLElement>('.h-1\\.5 .bg-amber-400');
    expect(globalAmberBar.style.width).toBe('50%');
  });

  it('global done bar is 100% wide when all items are done', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'done' },
    ] });
    const { container } = render(await Home());
    const [globalGreenBar] = container.querySelectorAll<HTMLElement>('.h-1\\.5 .bg-green-500');
    expect(globalGreenBar.style.width).toBe('100%');
  });

  // --- folder card rendering ---
  it('renders a card for each folder returned by getFolders', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker', 'networking']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [] });
    render(await Home());
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Networking')).toBeInTheDocument();
  });

  it('renders the formatted folder name as the card heading', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker-compose']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [] });
    render(await Home());
    expect(screen.getByRole('heading', { name: 'Docker Compose' })).toBeInTheDocument();
  });

  it('shows done / total count on each folder card', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'todo' },
    ] });
    render(await Home());
    expect(screen.getAllByText(/1 \/ 2 done/).length).toBeGreaterThan(0);
  });

  it('hides in-progress count on a folder card when that folder has zero in-progress items', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
    ] });
    render(await Home());
    expect(screen.queryByText(/in progress/)).not.toBeInTheDocument();
  });

  it('shows in-progress count on a folder card when that folder has in-progress items', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'in-progress' },
    ] });
    render(await Home());
    expect(screen.getAllByText(/1 in progress/).length).toBeGreaterThan(0);
  });

  // --- per-folder progress bar ---
  it('folder card done bar has width 0% when folder total is zero', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [] });
    const { container } = render(await Home());
    const [cardGreenBar] = container.querySelectorAll<HTMLElement>('.h-1 .bg-green-500');
    expect(cardGreenBar.style.width).toBe('0%');
  });

  it('folder card done bar width reflects folder done / total percentage', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'todo' },
    ] });
    const { container } = render(await Home());
    const [cardGreenBar] = container.querySelectorAll<HTMLElement>('.h-1 .bg-green-500');
    expect(cardGreenBar.style.width).toBe('50%');
  });

  it('folder card in-progress bar width reflects folder inProgress / total percentage', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'in-progress' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'todo' },
      { slug: 'c', title: 'C', path: '/c.md', status: 'todo' },
      { slug: 'd', title: 'D', path: '/d.md', status: 'todo' },
    ] });
    const { container } = render(await Home());
    const [cardAmberBar] = container.querySelectorAll<HTMLElement>('.h-1 .bg-amber-400');
    expect(cardAmberBar.style.width).toBe('25%');
  });

  // --- links ---
  it('each folder card links to /<folder>', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker', 'networking']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [] });
    render(await Home());
    expect(screen.getByRole('link', { name: /docker/i })).toHaveAttribute('href', '/docker');
    expect(screen.getByRole('link', { name: /networking/i })).toHaveAttribute('href', '/networking');
  });

  // --- edge cases ---
  it('handles an empty folder (0 items) — card shows "0 / 0 done"', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [] });
    render(await Home());
    expect(screen.getAllByText(/0 \/ 0 done/).length).toBeGreaterThan(0);
  });

  it('amber segment is hidden when no folder has any in-progress items', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
    ] });
    const { container } = render(await Home());
    const amberBars = container.querySelectorAll<HTMLElement>('.bg-amber-400');
    amberBars.forEach((bar) => expect(bar.style.width).toBe('0%'));
  });

  it('green segment is full-width when all items across all folders are done', async () => {
    vi.mocked(getFolders).mockResolvedValue(['docker']);
    vi.mocked(getHierarchicalFiles).mockResolvedValue({ groups: [], standalone: [
      { slug: 'a', title: 'A', path: '/a.md', status: 'done' },
      { slug: 'b', title: 'B', path: '/b.md', status: 'done' },
    ] });
    const { container } = render(await Home());
    const greenBars = container.querySelectorAll<HTMLElement>('.bg-green-500');
    greenBars.forEach((bar) => expect(bar.style.width).toBe('100%'));
  });
});
