import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import crypto from 'crypto';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(24).toString('hex');

    await prisma.user.update({
      where: { id: session.user.id },
      data: { extensionToken: token },
    });

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the token' },
      { status: 500 }
    );
  }
}
