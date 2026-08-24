import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth';
import { FileUpload } from '@/src/components/ui/FileUpload';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return <div className="flex-1 py-12 sm:py-16"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="text-sm font-medium text-muted">DASHBOARD</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Welcome back, {session.user.name?.split(' ')[0] ?? 'there'}.</h1><p className="mt-3 max-w-xl text-base leading-7 text-muted">Start with your latest resume. We&apos;ll use it to help shape your search.</p><section className="mt-10 rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-8"><div className="flex items-start gap-4 border-b border-border pb-6"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-foreground"><svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" /></svg></span><div><h2 className="font-semibold text-foreground">Resume</h2><p className="mt-1 text-sm text-muted">PDF files only. Your resume is parsed after upload.</p></div></div><FileUpload /></section></div></div>;
}
