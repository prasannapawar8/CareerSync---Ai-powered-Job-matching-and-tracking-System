import Link from 'next/link';
import { auth } from '@/src/lib/auth';
import ThemeToggle from './ThemeToggle';
import { Logo } from './Logo';
import { Button } from './Button';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#workflow', label: 'How it works' },
  { href: '#clipper', label: 'Web clipper' },
];

/** Marketing header for the public landing page. */
export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Link href="/dashboard">
              <Button size="md">Open dashboard</Button>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link href="/register">
                <Button size="md">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
