'use client';

import { useState } from 'react';
import { Button } from './Button';

export default function TokenManager({ initialToken }: { initialToken: string | null }) {
  const [token, setToken] = useState(initialToken);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateToken = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/extension/token', { method: 'POST' });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {token ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={token}
            className="w-full sm:w-80 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none font-mono"
          />
          <Button variant="outline" onClick={copyToken}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="ghost" onClick={generateToken} disabled={isGenerating}>
            {isGenerating ? '...' : 'Regenerate'}
          </Button>
        </div>
      ) : (
        <Button onClick={generateToken} disabled={isGenerating} className="w-fit">
          {isGenerating ? 'Generating...' : 'Generate API Token'}
        </Button>
      )}
    </div>
  );
}
