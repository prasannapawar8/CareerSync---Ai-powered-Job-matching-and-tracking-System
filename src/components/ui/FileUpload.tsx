'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from './Button';

type UploadResult = { success: boolean; message: string; textPreview?: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setResult({ success: false, message: 'Please choose a PDF document.' });
      return;
    }
    setFile(selected);
    setResult(null);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message, textPreview: data.textPreview });
        // Refresh so the dashboard shows the new resume metadata.
        router.refresh();
      } else {
        setResult({ success: false, message: data.error || 'Upload failed.' });
      }
    } catch {
      setResult({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose a resume PDF or drop one here"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'cursor-pointer rounded-card border border-dashed px-6 py-9 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary-soft'
            : 'border-border-strong hover:border-primary/60 hover:bg-surface-muted/60',
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
        <span
          className={cn(
            'mx-auto grid size-11 place-items-center rounded-xl transition-colors',
            isDragging ? 'bg-primary text-primary-foreground' : 'bg-surface-muted text-subtle',
          )}
        >
          <UploadCloud className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium text-foreground">
          {isDragging ? 'Drop to attach' : 'Drop your resume here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-subtle">PDF only</p>
      </div>

      {file && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface-muted px-4 py-3">
          <FileText className="size-4 shrink-0 text-subtle" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-subtle">{formatBytes(file.size)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile} aria-label="Remove selected file" disabled={isUploading}>
            <X className="size-4" />
          </Button>
          <Button onClick={handleUpload} loading={isUploading}>
            {isUploading ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      )}

      {result && (
        <div
          role="status"
          className={cn(
            'mt-4 rounded-card border px-4 py-3',
            result.success
              ? 'border-success/30 bg-success-surface text-success'
              : 'border-danger/30 bg-danger-surface text-danger',
          )}
        >
          <p className="flex items-start gap-2.5 text-sm font-medium">
            {result.success ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}
            {result.message}
          </p>

          {result.textPreview && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium underline-offset-4 hover:underline">
                Preview extracted text
              </summary>
              <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-left font-mono text-xs leading-5 text-muted">
                {result.textPreview}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
