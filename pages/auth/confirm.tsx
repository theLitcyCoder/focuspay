// // pages/auth/confirm.tsx

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '@/lib/supabaseClient';

// export default function ConfirmPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('Confirming your email...');

//   useEffect(() => {
//     const confirmEmail = async () => {
//       // Try to get the current session
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error || !session) {
//         setMessage('There was an error confirming your email.');
//         setLoading(false);
//         return;
//       }

//       const user = session.user;

//         // Check if profile exists
//         const { data: existingProfile, error: profileError } = await supabase
//         .from('profiles')
//         .select('user_id')
//         .eq('user_id', user.id)
//         .single();

//         if (profileError && profileError.code !== 'PGRST116') {
//         // Log any unexpected error (PGRST116 = no rows returned, which is OK here)
//         console.error('Profile lookup error:', profileError);
//         }

//         if (!existingProfile) {
//             const fullName = localStorage.getItem('full_name') || '';
//             const role = localStorage.getItem('role') || 'tasker';

//             // Insert new profile
//             const { error: insertError } = await supabase.from('profiles').insert([
//               {
//                 user_id: user.id,
//                 email: user.email,
//                 full_name: fullName, // Optionally ask for full name later
//                 role: role
//               }
//             ]);
    
//             if (insertError) {
//               console.error('Failed to create profile:', insertError);
//             }
//           }

//           setMessage('Email confirmed! Redirecting...');
//           setTimeout(() => {
//             router.push('/auth/signin');
//           }, 2000);

//     //   if (session) {
//     //     setMessage('Email confirmed! Redirecting...');
//     //     setTimeout(() => {
//     //       router.push('/auth/signin');
//     //     }, 2000);
//     //   } else {
//     //     setMessage('Please check your email to confirm your address.');
//     //   }

//       setLoading(false);
//     };

//     confirmEmail();
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white px-4">
//       <div className="text-center max-w-md">
//         <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
//         <p>{message}</p>
//         {loading && <div className="mt-4 animate-pulse text-gray-500">Loading...</div>}
//       </div>
//     </div>
//   );
// }
// pages/auth/confirm.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function ConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Waiting for email confirmation...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;
          console.log('Auth state changed:', event, session);

          // Check if profile already exists
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile lookup error:', profileError);
          }

          if (!existingProfile) {
            const fullName = localStorage.getItem('full_name') || '';
            const role = localStorage.getItem('role') || 'tasker';

            const { error: insertError } = await supabase.from('profiles').insert([
              {
                user_id: user.id,
                email: user.email,
                full_name: fullName,
                role: role,
              },
            ]);

            if (insertError) {
              console.error('Failed to create profile:', insertError);
            }
          }

          setMessage('Email confirmed! Redirecting...');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{message}</p>
        {loading && <div className="mt-4 animate-pulse text-gray-500">Waiting for confirmation...</div>}
      </div>
    </div>
  );
}
