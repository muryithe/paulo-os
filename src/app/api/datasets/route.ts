import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DatasetModel from '@/models/Dataset';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const datasets = await DatasetModel.find().sort({ uploadedAt: -1 });
    return NextResponse.json(datasets);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch datasets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const dataset = await DatasetModel.create(body);
    return NextResponse.json(dataset, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create dataset' }, { status: 500 });
  }
}
