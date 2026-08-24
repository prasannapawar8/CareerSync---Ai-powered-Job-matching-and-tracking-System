'use client';

import { useState } from 'react';
import type { SavedJobData } from './KanbanBoard';
import { Button } from './Button';

export default function CoverLetterModal({
  job,
  onClose,
}: {
  job: SavedJobData;
  onClose: () => void;
}) {
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-xl border border-border bg-surface p-6 shadow-xl relative max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-foreground pr-8">
          Application: {job.title} at {job.company}
        </h2>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {!coverLetter ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground">AI Cover Letter Generator</h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                Generate a highly tailored cover letter based on your latest uploaded resume and the specific description for this job.
              </p>
              
              <Button
                className="mt-6 w-full sm:w-auto"
                onClick={generateCoverLetter}
                disabled={isGenerating}
              >
                {isGenerating ? 'Analyzing & Writing...' : 'Generate Cover Letter'}
              </Button>

              {error && (
                <p className="mt-4 text-sm font-medium text-danger bg-danger/10 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Generated Cover Letter</h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
              </div>
              <textarea
                readOnly
                className="w-full flex-1 min-h-[300px] resize-none rounded-lg border border-border bg-surface-muted p-4 text-sm text-foreground outline-none focus:border-accent"
                value={coverLetter}
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setCoverLetter(null)}>
                  Discard
                </Button>
                <Button variant="default" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
