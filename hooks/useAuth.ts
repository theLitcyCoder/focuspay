import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function useAuth(redirectIfNoUser: boolean = true) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user && redirectIfNoUser) {
        router.push('/auth/signin');
      } else {
        setUser(session?.user ?? null);
      }

      setLoading(false);
    };

    getUser();
  }, [router, redirectIfNoUser]);

  return { user, loading };
}
