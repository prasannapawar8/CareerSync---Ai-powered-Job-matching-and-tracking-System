import { openai } from '@/src/lib/openai';

type AdzunaJob = {
  id: string;
  title: string;
  description: string;
  redirect_url: string;
  created: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  salary_min?: number;
  salary_max?: number;
};

export type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  postedAt: string;
  matchScore: number;
  matchedSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
};

export async function extractResumeSkills(resumeText: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b', // Default fast OSS model on Groq
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter. Extract the top 8 most important hard skills, tools, or frameworks from the provided resume text. Return ONLY a comma-separated list of the skills, with no other text, bullet points, or numbering.',
        },
        {
          role: 'user',
          content: resumeText.substring(0, 4000), // Limit text length for token limits
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    // Split by comma and clean up
    return content
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .slice(0, 8);
  } catch (error) {
    console.error('Error extracting skills with AI:', error);
    // Fallback to simple keyword matching if API fails or key is missing
    const SKILL_PATTERNS = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C#', 'SQL', 'AWS', 'Docker', 'Git'];
    const normalizedText = resumeText.toLocaleLowerCase();
    return SKILL_PATTERNS.filter((skill) => normalizedText.includes(skill.toLocaleLowerCase())).slice(0, 8);
  }
}

function scoreJob(job: AdzunaJob, skills: string[]) {
  const jobText = `${job.title} ${job.description}`.toLocaleLowerCase();
  const matchedSkills = skills.filter((skill) => jobText.includes(skill.toLocaleLowerCase()));
  return {
    matchedSkills,
    matchScore: skills.length ? Math.round((matchedSkills.length / skills.length) * 100) : 0,
  };
}

export async function findJobsForResume(
  resumeText: string,
  country = process.env.ADZUNA_COUNTRY ?? 'in'
): Promise<JobMatch[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error('Job search is not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to .env.');
  }

  const skills = await extractResumeSkills(resumeText);

  if (!skills.length) {
    throw new Error('We could not identify searchable skills in this resume yet.');
  }

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
  url.search = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: skills.slice(0, 3).join(' '),
    results_per_page: '50',
    'content-type': 'application/json',
    sort_by: 'date',
  }).toString();

  const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Job provider returned ${response.status}. Check your Adzuna credentials and selected country.`);
  }

  const data = (await response.json()) as { results?: AdzunaJob[] };

  return (data.results ?? [])
    .map((job) => ({ ...job, ...scoreJob(job, skills) }))
    .filter((job) => job.matchedSkills.length > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name ?? 'Company not listed',
      location: job.location?.display_name ?? 'Location not listed',
      description: job.description,
      applyUrl: job.redirect_url,
      postedAt: job.created,
      matchScore: job.matchScore,
      matchedSkills: job.matchedSkills,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
    }));
}
