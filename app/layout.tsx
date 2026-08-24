import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'CareerSync — AI-Powered Job Matching', description: 'A focused workspace for finding and managing your next opportunity.' };
const themeScript = `try { const theme = localStorage.getItem('careersync-theme'); document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'; } catch { document.documentElement.dataset.theme = 'light'; }`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body className="min-h-full flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>{children}</body></html>;
}
