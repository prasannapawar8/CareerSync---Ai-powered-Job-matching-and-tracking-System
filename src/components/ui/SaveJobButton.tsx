'use client';

import { useState } from 'react';
import type { JobMatch } from '@/src/services/scraper/jobSearch';

export default function SaveJobButton({
  job,
  resumeId,
}: {
  job: JobMatch;
  resumeId: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          applyUrl: job.applyUrl,
          matchScore: job.matchScore,
          resumeId: resumeId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save job');
      }

      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setError('Failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <span className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-lg border border-success/30 bg-success-surface text-success text-sm font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 border border-border bg-transparent hover:bg-surface-muted text-foreground h-10 px-4 py-2 text-sm shrink-0"
      >
        {isSaving ? 'Saving...' : 'Save Job'}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
