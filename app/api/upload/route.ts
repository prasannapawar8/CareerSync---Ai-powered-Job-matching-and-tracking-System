import { NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/src/services/resume-parser/parsePDF';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF text
    const extractedText = await extractTextFromPDF(buffer);

    // TODO: Save to database via Prisma here

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      fileName: file.name,
      textPreview: extractedText.substring(0, 500) + '...', // Send a preview back for testing
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
