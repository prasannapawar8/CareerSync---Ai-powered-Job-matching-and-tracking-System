import Link from 'next/link';
import { Check } from 'lucide-react';
import { LogoMark } from './Logo';
import ThemeToggle from './ThemeToggle';

const HIGHLIGHTS = [
  'Resume parsed and skill-tagged automatically',
  'Live roles scored 0–100 against your profile',
  'Cover letters drafted from the actual job description',
  'Every application tracked on one board',
];

/**
 * Two-panel auth frame: brand story on the left (desktop only), form on the
 * right. Shared by sign-in and registration.
 */
export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      {/* Brand panel */}
      <aside className="relative isolate hidden w-[46%] shrink-0 overflow-hidden border-r border-border bg-surface px-12 py-14 lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute -left-20 -top-20 -z-10 size-[460px] rounded-full bg-primary/20 blur-[130px]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-field opacity-70" aria-hidden="true" />

        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
          <LogoMark />
          CareerSync
        </Link>

        <div className="my-auto max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground">
            The job search deserves better than twenty open tabs.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-surface text-success">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-subtle">Resume text and tokens stay scoped to your account.</p>
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-1 flex-col px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground lg:invisible">
            <LogoMark />
            CareerSync
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-center text-sm text-muted">{footer}</div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
