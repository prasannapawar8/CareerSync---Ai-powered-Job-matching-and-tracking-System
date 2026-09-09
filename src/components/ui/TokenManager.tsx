'use client';

import { useState } from 'react';
import { Check, Copy, Eye, EyeOff, KeyRound, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { inputClasses } from './Field';
import { cn } from '@/src/lib/utils';

export default function TokenManager({ initialToken }: { initialToken: string | null }) {
  const [token, setToken] = useState(initialToken);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');

  const generateToken = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch('/api/extension/token', { method: 'POST' });
      const data = await response.json();
      if (!response.ok || !data.token) throw new Error(data.error || 'Could not generate a token.');
      setToken(data.token);
      setRevealed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a token.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard access was blocked — reveal the token and copy it manually.');
    }
  };

  if (!token) {
    return (
      <div className="space-y-3">
        <p className="text-sm leading-6 text-muted">
          No token yet. Generate one, then paste it into the extension&apos;s options page to link this account.
        </p>
        <Button onClick={generateToken} loading={isGenerating} leadingIcon={<KeyRound className="size-4" />}>
          {isGenerating ? 'Generating…' : 'Generate API token'}
        </Button>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            type={revealed ? 'text' : 'password'}
            readOnly
            value={token}
            aria-label="Extension API token"
            className={cn(inputClasses, 'pr-11 font-mono text-xs')}
          />
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Hide token' : 'Reveal token'}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <Button variant="outline" onClick={copyToken} leadingIcon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button
          variant="ghost"
          onClick={generateToken}
          loading={isGenerating}
          leadingIcon={<RefreshCw className="size-4" />}
          title="Replace the current token"
        >
          Regenerate
        </Button>
      </div>

      <p className="text-xs leading-5 text-subtle">
        Regenerating invalidates the previous token — any extension still using it will need the new value.
      </p>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
