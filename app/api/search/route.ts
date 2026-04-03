import { NextRequest, NextResponse } from 'next/server';

import { searchFiles } from '@/lib/content';

export async function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get('folder');
  const query = request.nextUrl.searchParams.get('q');

  if (!folder || !query?.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchFiles(folder, query);
  return NextResponse.json({ results });
}
