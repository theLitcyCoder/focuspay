// pages/index.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const DashboardRedirect = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      setLoading(true);
      setError('');

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.replace('dashboard');
        return;
      }

      const user = session.user;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError?.message);
        setError('Failed to fetch user role.');
        router.replace('/auth/signin');
        // setLoading(false);
        return;
      }

      const role = profile.role;

      // Redirect based on role
     if (role === 'tasker') {
        router.replace('/tasker');
      } else if (role === 'advertiser') {
        router.replace('/advertiser');
      } else {
        router.replace('/unauthorized');
      }

      // setLoading(false);
    };

    checkUserAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black dark:text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return null; // nothing is rendered since redirect happens
};

export default DashboardRedirect;
