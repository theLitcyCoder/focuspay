// hooks/useAuthRedirect.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export function useRedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.role === 'tasker') {
          router.replace('/tasker');
        } else if (profile?.role === 'advertiser') {
          router.replace('/advertiser');
        } else {
          router.replace('/unauthorized');
        }
      }
    };
    checkAuth();
  }, [router]);
}
