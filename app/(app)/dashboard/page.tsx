import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth';
import { FileUpload } from '@/src/components/ui/FileUpload';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session.user.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Upload your latest resume to parse and find the best matching jobs.
          </p>
        </div>

        {/* Resume Hub Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-4">
            📄 Resume Hub
          </h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
