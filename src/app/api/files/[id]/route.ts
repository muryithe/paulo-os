import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import FileModel from '@/models/File';
import { deleteFromBlob } from '@/lib/blob';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const file = await FileModel.findById(id);
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(file);
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const file = await FileModel.findById(id);
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    try { await deleteFromBlob(file.blobUrl); } catch { /* ok */ }
    await FileModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
