'use client';

import { useState } from 'react';
import { AlertCircle, Check, Copy, ExternalLink, PenLine, RotateCcw } from 'lucide-react';
import type { SavedJobData } from './KanbanBoard';
import { Button } from './Button';
import { Modal } from './Modal';

export default function CoverLetterModal({ job, onClose }: { job: SavedJobData; onClose: () => void }) {
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate cover letter.');
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard access was blocked — select the text and copy manually.');
    }
  };

  return (
    <Modal
      onClose={onClose}
      title={job.title}
      description={`${job.company}${job.location ? ` · ${job.location}` : ''}`}
      footer={
        coverLetter ? (
          <>
            <Button variant="ghost" onClick={() => setCoverLetter(null)} leadingIcon={<RotateCcw className="size-4" />}>
              Start over
            </Button>
            <Button variant="outline" onClick={handleCopy} leadingIcon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button onClick={onClose}>Done</Button>
          </>
        ) : (
          <>
            <a href={job.applyUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost" trailingIcon={<ExternalLink className="size-4" />}>
                View posting
              </Button>
            </a>
            <Button onClick={generateCoverLetter} loading={isGenerating} leadingIcon={<PenLine className="size-4" />}>
              {isGenerating ? 'Writing…' : 'Generate cover letter'}
            </Button>
          </>
        )
      }
    >
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-surface px-3.5 py-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {coverLetter ? (
        <textarea
          readOnly
          value={coverLetter}
          aria-label="Generated cover letter"
          className="min-h-80 w-full resize-y rounded-card border border-border bg-surface-muted p-4 text-sm leading-6 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
        />
      ) : (
        <div className="py-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <PenLine className="size-6" />
          </span>
          <h3 className="mt-5 font-semibold tracking-tight text-foreground">Draft a tailored cover letter</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            CareerSync reads your latest resume alongside this job description and writes a first draft you can edit and
            send.
          </p>

          {isGenerating && (
            <div className="mx-auto mt-8 max-w-md space-y-2.5" aria-hidden="true">
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-3 w-[92%] rounded skeleton" />
              <div className="h-3 w-[97%] rounded skeleton" />
              <div className="h-3 w-[70%] rounded skeleton" />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
