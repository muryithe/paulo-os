import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import FileModel from '@/models/File';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const folder = req.nextUrl.searchParams.get('folder');
    const query = folder && folder !== 'all' ? { folder } : {};
    const files = await FileModel.find(query).sort({ uploadedAt: -1 });
    return NextResponse.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const file = await FileModel.create(body);
    return NextResponse.json(file, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 });
  }
}
