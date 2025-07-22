'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRequireRole } from '@/hooks/useProtectedRoute';

export default function Earnings() {
  const { authorized, checking } = useRequireRole('tasker');
  const [earnings, setEarnings] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!authorized && checking) fetchEarnings();
  }, [authorized, checking]);

  const fetchEarnings = async () => {
    const { data, error } = await supabase
      .from('task_completions')
      .select('reward')
      .eq('user_id', user.id);

    if (!error) {
      const total = data.reduce((sum, task) => sum + task.reward, 0);
      setEarnings(total);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Earnings</h1>
      <p className="text-2xl font-semibold">${earnings.toFixed(2)}</p>
    </div>
  );
}
