'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import AuthLayout from '@/src/components/ui/AuthLayout';
import { Button } from '@/src/components/ui/Button';
import { Field, Input } from '@/src/components/ui/Field';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to CareerSync"
      subtitle="Pick up your search where you left it."
      footer={
        <>
          New to CareerSync?{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
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

        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" size="lg" loading={isLoading} className="w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-subtle before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        or
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        leadingIcon={<GoogleIcon />}
      >
        Continue with Google
      </Button>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.86-.08-1.68-.22-2.47H12v4.68h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.83Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.9l-3.86-3c-1.07.72-2.45 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.25 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.97-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.97 3.09C6.2 6.87 8.86 4.75 12 4.75Z"
      />
    </svg>
  );
}
