import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, company, location, description, applyUrl, matchScore, resumeId } = data;

    if (!title || !company || !applyUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        title,
        company,
        location,
        description,
        applyUrl,
        matchScore,
        userId: session.user.id,
        resumeId,
        status: 'SAVED',
      },
    });

    return NextResponse.json({ success: true, savedJob }, { status: 201 });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the job' },
      { status: 500 }
    );
  }
}
