'use client';

import { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import type { JobMatch } from '@/src/services/scraper/jobSearch';
import { Button } from './Button';

export default function SaveJobButton({ job, resumeId }: { job: JobMatch; resumeId: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          applyUrl: job.applyUrl,
          matchScore: job.matchScore,
          resumeId,
        }),
      });

      if (!response.ok) throw new Error('Failed to save job');
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setError('Could not save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-success/30 bg-success-surface px-4 text-sm font-medium text-success">
        <Check className="size-4" strokeWidth={2.5} />
        Saved
      </span>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-1">
      <Button
        variant="outline"
        onClick={handleSave}
        loading={isSaving}
        leadingIcon={<Bookmark className="size-4" />}
      >
        {isSaving ? 'Saving…' : 'Save to board'}
      </Button>
      {error && <span className="text-center text-xs text-danger">{error}</span>}
    </div>
  );
}
