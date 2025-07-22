// // hooks/useProtectedRoute.ts
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '@/lib/supabaseClient';

// export function useProtectedRoute() {
//   const [user, setUser] = useState<any>(null); // State to store user
//   const [loading, setLoading] = useState(true); // Loading state while checking session
//   const router = useRouter();

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error || !session?.user) {
//         // If no session or error, redirect to sign-in
//         router.push('/auth/signin');
//       } else {
//         setUser(session.user); // Set user if session is valid
//       }

//       setLoading(false); // Set loading to false after session check
//     };

//     checkSession();
//   }, [router]);

//   return { user, loading }; // Return user and loading states
// }

// hooks/useRequireRole.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export function useRequireRole(requiredRole: string) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('dashboard');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile || profile.role !== requiredRole) {
        router.replace('/unauthorized');
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    verify();
  }, [router, requiredRole]);

  return { authorized, checking };
}
