import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Check,
  FileText,
  KanbanSquare,
  PenLine,
  Puzzle,
  Sparkles,
  Target,
} from 'lucide-react';
import Navbar from '@/src/components/ui/Navbar';
import { TiltCard } from '@/src/components/ui/3d-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/src/components/ui/motion-wrapper';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { LogoMark } from '@/src/components/ui/Logo';

const FEATURES = [
  {
    icon: FileText,
    tone: 'text-primary bg-primary-soft',
    title: 'Resume, parsed',
    body: 'Drop in a PDF and CareerSync extracts the text, tags your strongest skills, and keeps that profile ready for every search.',
  },
  {
    icon: Target,
    tone: 'text-success bg-success-surface',
    title: 'Scored matches',
    body: 'Live listings are ranked 0–100 against your actual skills, so the roles worth your afternoon sit at the top of the list.',
  },
  {
    icon: PenLine,
    tone: 'text-info bg-info-surface',
    title: 'Tailored cover letters',
    body: 'Generate a letter grounded in your resume and the specific job description — a first draft in seconds, not an evening.',
  },
  {
    icon: KanbanSquare,
    tone: 'text-warning bg-warning-surface',
    title: 'One honest pipeline',
    body: 'Saved, applied, interviewing, offered, rejected. Drag a card and the board remembers — no spreadsheet to maintain.',
  },
  {
    icon: Puzzle,
    tone: 'text-primary bg-primary-soft',
    title: 'Clip from anywhere',
    body: 'A Chrome extension pulls a posting off any careers page straight into your board, with a token you control.',
  },
  {
    icon: Brain,
    tone: 'text-success bg-success-surface',
    title: 'Fast inference',
    body: 'Skill extraction and writing run on high-speed LLM inference, so the workspace responds while you are still thinking.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Upload your resume',
    body: 'One PDF. We parse the text and pull out the eight skills that define your profile.',
  },
  {
    step: '02',
    title: 'Review scored roles',
    body: 'Live openings arrive ranked by fit, each showing exactly which of your skills matched.',
  },
  {
    step: '03',
    title: 'Apply and track',
    body: 'Save a role, generate a cover letter, and move the card as the conversation progresses.',
  },
];

const CLIPPER_POINTS = [
  'Works on any job posting, not a fixed list of boards',
  'Authenticated with a token you can regenerate at will',
  'Clipped roles land in Saved, ready to score and track',
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative isolate overflow-hidden px-5 pb-24 pt-20 sm:px-8 lg:pb-32 lg:pt-28">
          <div className="pointer-events-none absolute inset-0 -z-10 grid-field" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] animate-drift"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-3xl text-center">
            <FadeIn direction="up">
              <Badge tone="brand" className="mb-7 px-3 py-1.5">
                <Sparkles className="size-3.5" />
                Your job search, finally organised
              </Badge>
            </FadeIn>

            <FadeIn direction="up" delay={0.06}>
              <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
                A clearer path to your <span className="text-gradient-brand">next role</span>.
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
                CareerSync turns your resume into a working job-search system. Upload once, see roles scored against
                your real skills, and keep every application on a single board.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" trailingIcon={<ArrowRight className="size-4" />}>
                    Create your account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign in
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-subtle">Free to set up · No credit card · Your resume stays yours</p>
            </FadeIn>
          </div>

          {/* Product preview */}
          <FadeIn direction="up" delay={0.26} className="mx-auto mt-16 max-w-5xl lg:mt-20">
            <div className="relative rounded-panel border border-border bg-surface p-2 elevation-lg ring-hairline">
              <div className="overflow-hidden rounded-[0.75rem] border border-border bg-background">
                <BoardPreview />
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ------------------------------------------------------------ Features */}
        <section id="features" className="border-t border-border bg-surface/40 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FadeIn direction="up" className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">What you get</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Every step of the search, in one place.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Six pieces that replace the tab sprawl, the half-filled spreadsheet, and the blank-page cover letter.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title} className="h-full">
                    <article className="group h-full rounded-panel border border-border bg-surface p-6 elevation-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-border-strong hover:elevation-md">
                      <span className={`mb-5 grid size-11 place-items-center rounded-xl ${feature.tone}`}>
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-semibold tracking-tight text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{feature.body}</p>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ------------------------------------------------------------ Workflow */}
        <section id="workflow" className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FadeIn direction="up" className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Three steps, then you are running.
              </h2>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-5 lg:grid-cols-3">
              {STEPS.map((item) => (
                <StaggerItem key={item.step} className="h-full">
                  <TiltCard className="h-full w-full p-7" containerClassName="h-full w-full">
                    <span className="font-mono text-sm font-medium text-primary">{item.step}</span>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ------------------------------------------------------------- Clipper */}
        <section id="clipper" className="border-y border-border bg-surface/40 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <FadeIn direction="right">
              <Badge tone="brand" className="mb-5">
                <Puzzle className="size-3.5" />
                Chrome extension
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Found a role elsewhere? Clip it.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                The web clipper reads the posting you are looking at and files it into your board with the title,
                company, and description intact — so your pipeline stays complete even when the role never came from a
                search.
              </p>
              <ul className="mt-7 space-y-3">
                {CLIPPER_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-surface text-success">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn direction="left" delay={0.1}>
              <div className="rounded-panel border border-border bg-surface p-6 elevation-md ring-hairline">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <span className="size-2.5 rounded-full bg-danger/70" />
                  <span className="size-2.5 rounded-full bg-warning/70" />
                  <span className="size-2.5 rounded-full bg-success/70" />
                  <span className="ml-3 truncate font-mono text-xs text-subtle">careers.example.com/senior-engineer</span>
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary-soft p-4">
                  <LogoMark className="size-8" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Clip this job to CareerSync</p>
                    <p className="mt-1 text-xs text-muted">Senior Frontend Engineer · Northwind</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-muted px-4 py-3">
                  <span className="text-xs text-muted">Saved to your board</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <Check className="size-3.5" strokeWidth={3} /> Done
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------------------------------- CTA */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <FadeIn direction="up" className="mx-auto max-w-4xl">
            <div className="relative isolate overflow-hidden rounded-panel border border-border bg-surface px-6 py-14 text-center elevation-md sm:px-12">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
                aria-hidden="true"
              />
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Start with the resume you already have.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted">
                Set up your workspace in a couple of minutes and see what a scored, tracked job search feels like.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" trailingIcon={<ArrowRight className="size-4" />}>
                    Create your account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="ghost">
                    I already have one
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* -------------------------------------------------------------- Footer */}
        <footer className="border-t border-border px-5 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-8" />
              <span className="text-sm font-semibold tracking-tight text-foreground">CareerSync</span>
            </div>
            <p className="text-xs text-subtle">AI-powered job matching, resume parsing, and application tracking.</p>
            <div className="flex items-center gap-5 text-xs text-muted">
              <Link href="/login" className="transition-colors hover:text-foreground">
                Sign in
              </Link>
              <Link href="/register" className="transition-colors hover:text-foreground">
                Create account
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

/** Static, non-interactive mock of the tracker board used in the hero. */
function BoardPreview() {
  const columns = [
    {
      title: 'Saved',
      tone: 'bg-subtle',
      cards: [
        { title: 'Senior Frontend Engineer', company: 'Northwind', score: 92 },
        { title: 'Product Engineer', company: 'Lumen Labs', score: 78 },
      ],
    },
    {
      title: 'Applied',
      tone: 'bg-info',
      cards: [{ title: 'Full-Stack Developer', company: 'Kestrel', score: 84 }],
    },
    {
      title: 'Interviewing',
      tone: 'bg-warning',
      cards: [{ title: 'React Engineer', company: 'Fieldnote', score: 88 }],
    },
    {
      title: 'Offered',
      tone: 'bg-success',
      cards: [{ title: 'Platform Engineer', company: 'Arcadia', score: 95 }],
    },
  ];

  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto p-4 sm:p-6">
      {columns.map((column) => (
        <div key={column.title} className="w-56 shrink-0 rounded-xl border border-border bg-surface-muted/60 p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${column.tone}`} />
            <span className="text-xs font-semibold text-foreground">{column.title}</span>
            <span className="ml-auto text-xs text-subtle">{column.cards.length}</span>
          </div>
          <div className="space-y-2.5">
            {column.cards.map((card) => (
              <div key={card.title} className="rounded-lg border border-border bg-surface p-3 elevation-xs">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium leading-5 text-foreground">{card.title}</p>
                  <span className="shrink-0 rounded-full bg-primary-soft px-1.5 py-0.5 text-[0.625rem] font-semibold text-primary">
                    {card.score}
                  </span>
                </div>
                <p className="mt-1 text-[0.7rem] text-subtle">{card.company}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
