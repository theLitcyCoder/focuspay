'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRequireRole } from '@/hooks/useProtectedRoute';

export default function CompletedTasks() {
  const { authorized, checking } = useRequireRole('tasker');
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!checking && authorized) fetchCompletedTasks();
  }, [authorized, checking]);

  const fetchCompletedTasks = async () => {
    const { data, error } = await supabase
      .from('task_completions')
      .select('*, tasks(*)')
      .eq('user_id', authorized);
    if (!error) setCompletedTasks(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Completed Tasks</h1>
      <ul className="space-y-4">
        {completedTasks.map(({ id, tasks }) => (
          <li key={id} className="p-4 border rounded bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold">{tasks.title}</h2>
            <p>{tasks.description}</p>
            <p className="text-sm text-green-600">Status: Completed</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
