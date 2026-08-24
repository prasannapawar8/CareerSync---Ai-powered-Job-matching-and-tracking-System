import Link from 'next/link';
import { auth, signOut } from '@/src/lib/auth';
import ThemeToggle from './ThemeToggle';

export default async function Navbar() {
  const session = await auth();
  return <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path strokeLinecap="round" d="M8 12h8" /></svg></span>CareerSync</Link>
    {session?.user && <div className="hidden items-center gap-1 sm:flex"><Link href="/dashboard" className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground">Dashboard</Link><Link href="/jobs" className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground">Jobs</Link></div>}
    <div className="flex items-center gap-2"><ThemeToggle />{session?.user ? <><span className="hidden max-w-40 truncate px-2 text-sm text-muted md:block">{session.user.name ?? session.user.email}</span><form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}><button type="submit" className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted">Sign out</button></form></> : <Link href="/login" className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85">Sign in</Link>}</div>
  </div></nav>;
}
