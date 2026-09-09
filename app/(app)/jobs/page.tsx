import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertTriangle, Building2, ExternalLink, FileText, MapPin, SearchX, Sparkles } from 'lucide-react';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { extractResumeSkills, findJobsForResume, type JobMatch } from '@/src/services/scraper/jobSearch';
import SaveJobButton from '@/src/components/ui/SaveJobButton';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { MatchRing } from '@/src/components/ui/MatchRing';

export const metadata = { title: 'Job matches' };

export default async function JobsPage() {
  // The layout also guards this route, but layouts and pages render in
  // parallel, so the page has to establish the session for itself.
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  const resume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
    select: { id: true, rawText: true },
  });

  if (!resume) {
    return (
      <JobsShell>
        <EmptyState
          icon={<FileText className="size-6" />}
          title="Upload a resume first"
          description="Matching starts from the skills in your latest resume. Add one and this page fills itself in."
          action={
            <Link href="/dashboard#resume">
              <Button>Go to resume upload</Button>
            </Link>
          }
        />
      </JobsShell>
    );
  }

  const skills = await extractResumeSkills(resume.rawText);

  let jobs: JobMatch[] = [];
  let searchError = '';
  try {
    jobs = await findJobsForResume(resume.rawText);
  } catch (error) {
    searchError = error instanceof Error ? error.message : 'Unable to load job matches.';
  }

  if (searchError) {
    return (
      <JobsShell skills={skills}>
        <EmptyState
          icon={<AlertTriangle className="size-6" />}
          title="Job search needs setup"
          description={searchError}
        />
      </JobsShell>
    );
  }

  if (!jobs.length) {
    return (
      <JobsShell skills={skills}>
        <EmptyState
          icon={<SearchX className="size-6" />}
          title="No strong matches right now"
          description="Try a resume with more role-specific skills and tools, then come back — the index refreshes constantly."
        />
      </JobsShell>
    );
  }

  return (
    <JobsShell skills={skills} count={jobs.length}>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobResultCard key={job.id} job={job} resumeId={resume.id} />
        ))}
      </div>
    </JobsShell>
  );
}

function JobsShell({
  skills,
  count,
  children,
}: {
  skills?: string[];
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Personalized jobs</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Roles chosen from your resume.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Live openings are compared against the skills in your latest resume and ranked with the closest fit first.
        </p>
      </header>

      {skills && skills.length > 0 && (
        <div className="mt-6 rounded-panel border border-border bg-surface p-4 elevation-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <Sparkles className="size-3.5 text-primary" />
            Matching on your top skills
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} tone="brand">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {typeof count === 'number' && (
        <p className="mt-8 text-sm text-muted">
          <span className="font-medium text-foreground">{count}</span> {count === 1 ? 'role' : 'roles'} found
        </p>
      )}

      <section className="mt-4">{children}</section>
    </div>
  );
}

function JobResultCard({ job, resumeId }: { job: JobMatch; resumeId: string }) {
  return (
    <article className="group rounded-panel border border-border bg-surface p-5 elevation-sm transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:elevation-md sm:p-6">
      <div className="flex gap-5">
        <MatchRing score={job.matchScore} className="hidden sm:block" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-6 tracking-tight text-foreground">{job.title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-subtle" />
                  {job.company}
                </span>
                {job.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-subtle" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <MatchRing score={job.matchScore} size={44} className="sm:hidden" />
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{job.description}</p>

          {job.matchedSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs text-subtle">Matched</span>
              {job.matchedSkills.map((skill) => (
                <Badge key={skill} tone="success">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href={job.applyUrl} target="_blank" rel="noreferrer">
              <Button trailingIcon={<ExternalLink className="size-4" />}>View job</Button>
            </a>
            <SaveJobButton job={job} resumeId={resumeId} />
          </div>
        </div>
      </div>
    </article>
  );
}
