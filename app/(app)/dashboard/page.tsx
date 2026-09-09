import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Briefcase, CalendarCheck, FileText, Puzzle, Sparkles, Trophy } from 'lucide-react';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { JobStatus } from '@/app/generated/prisma/enums';
import { FileUpload } from '@/src/components/ui/FileUpload';
import KanbanBoard from '@/src/components/ui/KanbanBoard';
import TokenManager from '@/src/components/ui/TokenManager';
import { Card, CardBody, CardHeader } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

export const metadata = { title: 'Dashboard' };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default async function DashboardPage() {
  // The layout also guards this route, but layouts and pages render in
  // parallel, so the page has to establish the session for itself.
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  const [user, resume, savedJobs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { extensionToken: true } }),
    prisma.resume.findFirst({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
      select: { fileName: true, uploadedAt: true },
    }),
    prisma.savedJob.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        status: true,
        applyUrl: true,
        matchScore: true,
      },
    }),
  ]);

  const countOf = (status: JobStatus) => savedJobs.filter((job) => job.status === status).length;

  const stats = [
    { label: 'Tracked roles', value: savedJobs.length, icon: Briefcase, tone: 'text-primary bg-primary-soft' },
    { label: 'Applied', value: countOf(JobStatus.APPLIED), icon: FileText, tone: 'text-info bg-info-surface' },
    {
      label: 'Interviewing',
      value: countOf(JobStatus.INTERVIEWING),
      icon: CalendarCheck,
      tone: 'text-warning bg-warning-surface',
    },
    { label: 'Offers', value: countOf(JobStatus.OFFERED), icon: Trophy, tone: 'text-success bg-success-surface' },
  ];

  const firstName = session.user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Page header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            {resume
              ? 'Your resume is on file — review new matches or move a card forward.'
              : 'Upload a resume to unlock scored job matches and cover letters.'}
          </p>
        </div>
        <Link href="/jobs">
          <Button leadingIcon={<Sparkles className="size-4" />} trailingIcon={<ArrowRight className="size-4" />}>
            Find matches
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-card border border-border bg-surface p-5 elevation-sm transition-colors hover:border-border-strong"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{stat.label}</span>
                <span className={`grid size-8 place-items-center rounded-lg ${stat.tone}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </section>

      {/* Setup panels */}
      <section className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Card id="resume" className="scroll-mt-24">
          <CardHeader
            icon={<FileText className="size-5" />}
            title="Resume"
            description="PDF only. The text is parsed and skill-tagged right after upload."
            action={
              resume ? (
                <Badge tone="success" dot>
                  On file
                </Badge>
              ) : (
                <Badge tone="warning" dot>
                  Not uploaded
                </Badge>
              )
            }
          />
          <CardBody>
            {resume && (
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <FileText className="size-4 shrink-0 text-subtle" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{resume.fileName}</p>
                  <p className="text-xs text-subtle">Uploaded {formatDate(resume.uploadedAt)}</p>
                </div>
              </div>
            )}
            <FileUpload />
          </CardBody>
        </Card>

        <Card id="clipper" className="scroll-mt-24">
          <CardHeader
            icon={<Puzzle className="size-5" />}
            title="Web clipper"
            description="Generate a token to connect the Chrome extension to this account."
            action={
              user?.extensionToken ? (
                <Badge tone="success" dot>
                  Connected
                </Badge>
              ) : (
                <Badge dot>Inactive</Badge>
              )
            }
          />
          <CardBody>
            <TokenManager initialToken={user?.extensionToken ?? null} />
          </CardBody>
        </Card>
      </section>

      {/* Pipeline */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Application pipeline</h2>
            <p className="mt-1 text-sm text-muted">Drag a card between columns — the change saves automatically.</p>
          </div>
          <Badge>{savedJobs.length} total</Badge>
        </div>

        <div className="mt-5">
          <KanbanBoard initialJobs={savedJobs} />
        </div>
      </section>
    </div>
  );
}
