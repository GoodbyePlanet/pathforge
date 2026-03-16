import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

type RouteParams = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { path: segments } = await params;
  const filePath = path.join(contentDir, ...segments);
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(contentDir)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const file = await fs.readFile(resolved);
    return new NextResponse(file, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}