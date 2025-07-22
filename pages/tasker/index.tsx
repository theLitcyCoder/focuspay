'use client';
import { useRouter } from 'next/router';
import { useRequireRole } from '@/hooks/useProtectedRoute';

export default function TaskerDashboard() {
  const { authorized, checking } = useRequireRole('tasker');
  const router = useRouter();

  if (checking) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome, Tasker!</h1>
      <div className="space-y-4">
        <button onClick={() => router.push('/tasker/available/tasks')} className="block w-full px-4 py-2 bg-blue-600 text-white rounded">
          View Available Tasks
        </button>
        <button onClick={() => router.push('/tasker/completed')} className="block w-full px-4 py-2 bg-green-600 text-white rounded">
          View Completed Tasks
        </button>
        <button onClick={() => router.push('/tasker/earnings')} className="block w-full px-4 py-2 bg-purple-600 text-white rounded">
          View Earnings
        </button>
      </div>
    </div>
  );
}
