import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { JobStatus } from '@/app/generated/prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!Object.values(JobStatus).includes(status as JobStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const job = await prisma.savedJob.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedJob = await prisma.savedJob.update({
      where: { id },
      data: { status: status as JobStatus },
    });

    return NextResponse.json({ success: true, updatedJob });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.savedJob.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.savedJob.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the job' },
      { status: 500 }
    );
  }
}
