import { redirect } from 'next/navigation';
import { auth, signOut } from '@/src/lib/auth';
import AppShell from '@/src/components/ui/AppShell';

/**
 * Shell for authenticated pages: persistent sidebar on desktop, drawer on
 * mobile. Auth is checked once here rather than in each page.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <AppShell
      user={{ name: session.user.name, email: session.user.email }}
      signOutAction={handleSignOut}
    >
      {children}
    </AppShell>
  );
}
