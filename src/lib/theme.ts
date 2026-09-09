'use client';

import { useSyncExternalStore } from 'react';

export const THEME_STORAGE_KEY = 'careersync-theme';

export type Theme = 'light' | 'dark';

/**
 * The document element is the single source of truth for the active theme — it
 * is set before first paint by the inline script in the root layout. This tiny
 * store lets components read it without an effect, so there is no cascading
 * render on mount and no hydration mismatch.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage can be blocked; the in-memory switch still applies */
  }
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}

/**
 * True only after hydration. Used to defer client-only widgets (drag and drop)
 * until the DOM is interactive, without a setState-in-effect round trip.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
