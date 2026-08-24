import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Enable CORS for the extension
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(' ')[1];
    
    // Find user by extension token
    const user = await prisma.user.findFirst({
      where: { extensionToken: token }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid extension token' }, { status: 401, headers: corsHeaders });
    }

    const data = await request.json();
    const { title, company, applyUrl } = data;

    if (!title || !applyUrl) {
      return NextResponse.json(
        { error: 'Missing required fields (title, applyUrl)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        title,
        company: company || 'Unknown Company',
        description: 'Imported via Web Clipper', // Default since extension doesn't scrape description yet
        applyUrl,
        userId: user.id,
        status: 'SAVED',
      },
    });

    return NextResponse.json({ success: true, savedJob }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error in clipper API:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the clipped job' },
      { status: 500, headers: corsHeaders }
    );
  }
}
