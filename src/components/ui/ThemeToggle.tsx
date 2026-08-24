'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);
  const toggleTheme = () => { const nextTheme = isDark ? 'light' : 'dark'; document.documentElement.dataset.theme = nextTheme; localStorage.setItem('careersync-theme', nextTheme); setIsDark(!isDark); };
  return <button type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} title={`Switch to ${isDark ? 'light' : 'dark'} theme`} className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">{isDark ? <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> : <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.4 15.2A8.5 8.5 0 018.8 3.6 8.5 8.5 0 1020.4 15.2z" /></svg>}</button>;
}
