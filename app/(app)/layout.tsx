import Navbar from '@/src/components/ui/Navbar';

/**
 * Layout for authenticated app pages (dashboard, jobs, etc.)
 * Includes the persistent Navbar.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
