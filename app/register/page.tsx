'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import AuthLayout from '@/src/components/ui/AuthLayout';
import { Button } from '@/src/components/ui/Button';
import { Field, Input } from '@/src/components/ui/Field';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        router.push('/login');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Set up your workspace in a couple of minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-surface px-3.5 py-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full name" htmlFor="name">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" htmlFor="password" hint="At least 6 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" size="lg" loading={isLoading} className="w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-subtle">
        Your resume text is stored against your account and used only to score jobs and draft letters.
      </p>
    </AuthLayout>
  );
}
