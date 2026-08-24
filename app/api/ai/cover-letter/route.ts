import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { openai } from '@/src/lib/openai';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    // Fetch the job and the user's latest resume
    const [job, resume] = await Promise.all([
      prisma.savedJob.findUnique({
        where: { id: jobId, userId: session.user.id },
      }),
      prisma.resume.findFirst({
        where: { userId: session.user.id },
        orderBy: { uploadedAt: 'desc' },
      }),
    ]);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!resume) {
      return NextResponse.json({ error: 'No resume found. Please upload a resume first.' }, { status: 400 });
    }

    // Call the LLM to generate the cover letter
    const systemPrompt = `You are an expert career coach and professional copywriter. 
Your task is to write a compelling, tailored cover letter for a job application.
Use the provided Job Description to understand the company's needs, and use the provided Resume to highlight relevant experiences and skills.
The cover letter should be concise (3-4 paragraphs max), professional, engaging, and directly address the specific requirements of the job.
Do NOT use generic placeholders like [Company Name] or [Your Name]. Fill them in using the provided context. If a hiring manager's name is not in the job description, address it to "Hiring Manager" or the specific team (e.g., "Engineering Team").
Output ONLY the cover letter text, with no introductory or concluding chat remarks.`;

    const userPrompt = `JOB TITLE: ${job.title}
COMPANY: ${job.company}

JOB DESCRIPTION:
${job.description}

MY RESUME:
${resume.rawText}`;

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const coverLetter = completion.choices[0]?.message?.content?.trim();

    if (!coverLetter) {
      throw new Error('LLM returned empty response');
    }

    return NextResponse.json({ success: true, coverLetter }, { status: 200 });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the cover letter.' },
      { status: 500 }
    );
  }
}
