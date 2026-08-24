import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { extractResumeSkills, findJobsForResume, type JobMatch } from '@/src/services/scraper/jobSearch';
import SaveJobButton from '@/src/components/ui/SaveJobButton';

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const resume = await prisma.resume.findFirst({ where: { userId: session.user.id }, orderBy: { uploadedAt: 'desc' }, select: { id: true, rawText: true } });
  if (!resume) return <JobsPageShell><EmptyState title="Upload a resume first" description="We use the skills in your latest resume to find relevant opportunities." /></JobsPageShell>;
  const skills = await extractResumeSkills(resume.rawText);
  let jobs: JobMatch[] = [];
  let searchError = '';
  try { jobs = await findJobsForResume(resume.rawText); } catch (error) { searchError = error instanceof Error ? error.message : 'Unable to load job matches.'; }
  if (searchError) return <JobsPageShell><EmptyState title="Job search needs setup" description={searchError} /></JobsPageShell>;
  return <JobsPageShell><div className="mb-7 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">{skill}</span>)}</div>{jobs.length ? <div className="space-y-3">{jobs.map((job) => <article key={job.id} className="rounded-xl border border-border bg-surface p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex items-center gap-3"><h2 className="font-semibold text-foreground">{job.title}</h2><span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground">{job.matchScore}% match</span></div><p className="mt-1 text-sm text-muted">{job.company} · {job.location}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{job.description}</p><p className="mt-3 text-xs text-subtle">Matched: {job.matchedSkills.join(', ')}</p></div><div className="flex flex-col gap-2 shrink-0"><a href={job.applyUrl} target="_blank" rel="noreferrer" className="h-fit rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85">View job</a><SaveJobButton job={job} resumeId={resume.id} /></div></div></article>)}</div> : <EmptyState title="No strong matches yet" description="Try uploading a resume with more role-specific skills, then return here." />}</JobsPageShell>;
}
function JobsPageShell({ children }: { children: React.ReactNode }) { return <div className="flex-1 py-12 sm:py-16"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="text-sm font-medium text-muted">PERSONALIZED JOBS</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Roles chosen from your resume.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-muted">We compare the skills in your latest resume against current job descriptions and rank the closest matches first.</p><section className="mt-9">{children}</section></div></div>; }
function EmptyState({ title, description }: { title: string; description: string }) { return <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center"><div><h2 className="font-semibold text-foreground">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p></div></div>; }
