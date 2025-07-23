// import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
// import { supabase } from '@/lib/supabaseClient'

// const SignUp = () => {
//   useRedirectIfAuthenticated();

//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [fullName, setFullName] = useState('');
//   const [role, setRole] = useState<'tasker' | 'advertiser' | ''>('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('');

//  useEffect(() => {
//     if (router.isReady) {
//           const queryRole = router.query.role?.toString().toLowerCase();
//       if (queryRole === 'tasker' || queryRole === 'advertiser') {
        
//         setRole(queryRole);
        
//       }
//     }
//   }, [router.isReady, router.query.role]);


//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setError(null);

//     // Save profile info to localStorage for confirm page
//     localStorage.setItem('full_name', fullName);
//     localStorage.setItem('role', role);

//     // const { data: signUpData, error: authError } = await supabase.auth.signUp({
//     const { error } = await supabase.auth.signUp({
//       email, 
//       password,
//       options: {
//       data: {
//         full_name: fullName,
//         role,
//       },
//      },
//     });

//     if (error) {
//       setMessage(`Sign-up error: ${error.message}`);
//     } else {
//       setMessage('Check your email for a confirmation link.');
//       router.push('/auth/confirm'); // After signup, send to sign in
//     }

//     setLoading(false);
//     // const user = signUpData?.user;

//     // if (authError || !signUpData.user) {
//     //   setError(authError?.message ?? 'Sign-up failed');
//     //   setLoading(false);
//     //   return;
//     // }

//     // if (user) {
//     //   const { error: profileError } = await supabase
//     //     .from('profiles')
//     //     .insert([
//     //       {
//     //         user_id: user.id, // Use the auth user's UUID
//     //         role: role, // 'client' or 'tasker'
//     //         email: user.email,
//     //         full_name: fullName,
//     //       },
//     //     ]);
//     //     if (profileError) {
//     //       setError(profileError.message);
//     //       return;
//     //     }
//     // }

//     // if (error) {
//     //   console.error('Signup error:', error.message);
//     //   setError(error.message);
//     // } else {
//     //   console.log('User signed up:', data.user?.email);
//     //   router.push('/auth/confirm'); // After signup, send to sign in
//     // }

//     // router.push('/auth/confirm'); // After signup, send to sign in
//     // console.log('Confirmation email sent to:', signUpData.user.email)

//   };

//   return (
//     <div className="dark:dark:bg-gray-950 dark:text-white min-h-screen flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white dark:text-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
//         <h2 className="text-center text-2xl font-bold mb-4">
//           Create your FocusPay account
//         </h2>
        
//         <form onSubmit={handleSignUp} className="dark:text-white bg-white dark:bg-gray-800 p-6 rounded ">
//           <div>
//           <label className="dark:text-white block text-gray-700">Full Name</label>
//             <input
//               type="text"
//               className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="mt-3 dark:text-white block text-gray-700">Email address</label>
//             <input
//               type="email"
//               className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
          
//           <div>
//             <label className="mt-3 dark:text-white block text-gray-700">Password</label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//           <label className="mt-3 dark:text-white block text-gray-700">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value as 'tasker' | 'advertiser')}
//               className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//             >
//               <option className="bg-white dark:text-white dark:bg-gray-800" value="tasker">Tasker</option>
//               <option className="bg-white dark:text-white dark:bg-gray-800" value="advertiser">Advertiser</option>
//             </select>

//           </div>

//           {error && (
//             <div className="dark:text-white text-red-600 text-sm">
//               {error}
//             </div>
//           )}

//         <button
//             type="submit"
//             disabled={loading}
//             className="cursor-pointer dark:text-white mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
//           >
//             {loading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//           {message && <p className="text-center mt-4">{message}</p>}

//         </form>

//         <p className="dark:text-gray-400 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <a href="/auth/signin" className="dark:text-blue-400 text-blue-600 hover:pointerhover:underline">
//             Sign in
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;




// // import { useState } from 'react';
// // import { supabase } from '../../lib/supabaseClient';
// // import { useRouter } from 'next/router';

// // const SignUp = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const router = useRouter();

// //   const handleSignUp = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const { error } = await supabase.auth.signUp({ email, password });
// //     if (error) {
// //       alert(error.message);
// //     } else {
// //       router.push('/');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center">
// //       <form onSubmit={handleSignUp} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
// //         <h2 className="text-2xl mb-4">Sign Up</h2>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="w-full p-2 mb-4 border rounded"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full p-2 mb-4 border rounded"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />
// //         <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
// //           Sign Up
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default SignUp;
























// // import { useState } from 'react'
// // import { useRouter } from 'next/router'
// // import { supabase } from '../../lib/supabaseClient'

// // export default function SignUp() {
// //   const router = useRouter()
// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [error, setError] = useState('')
// //   const [loading, setLoading] = useState(false)

// //   const handleSignUp = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError('')

// //     const { data, error } = await supabase.auth.signUp({
// //       email,
// //       password,
// //     })

// //     if (error) {
// //       setError(error.message)
// //     } else {
// //       router.push('/') // Redirect to homepage after sign up
// //     }

// //     setLoading(false)
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //       <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
// //         <h2 className="text-center text-2xl font-bold text-gray-800">
// //           Create your FocusPay account
// //         </h2>

// //         <form onSubmit={handleSignUp} className="space-y-4">
// //           <div>
// //             <label className="block text-gray-700">Email address</label>
// //             <input
// //               type="email"
// //               required
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Password</label>
// //             <input
// //               type="password"
// //               required
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {error && (
// //             <div className="text-red-600 text-sm">
// //               {error}
// //             </div>
// //           )}

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
// //           >
// //             {loading ? 'Creating Account...' : 'Sign Up'}
// //           </button>
// //         </form>

// //         <p className="text-center text-sm text-gray-600">
// //           Already have an account?{' '}
// //           <a href="/auth/signin" className="text-blue-600 hover:underline">
// //             Sign in
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   )
// // }


import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const SignUp = () => {
  useRedirectIfAuthenticated();

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'tasker' | 'advertiser' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const queryRole = router.query.role?.toString().toLowerCase();
      if (queryRole === 'tasker' || queryRole === 'advertiser') {
        setRole(queryRole);
      }
    }
  }, [router.isReady, router.query.role]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(null);

    try {
      // Save metadata for later confirmation page
      localStorage.setItem('full_name', fullName);
      localStorage.setItem('role', role);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a confirmation link.');
        router.push('/auth/confirm');
      }
    } catch (err: any) {
      setError(err.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:dark:bg-gray-950 dark:text-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:text-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold mb-4">
          Create your FocusPay account
        </h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-white">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-white">Email address</label>
            <input
              type="email"
              required
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-white">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-white">Role</label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value as 'tasker' | 'advertiser')}
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select role</option>
              <option value="tasker">Tasker</option>
              <option value="advertiser">Advertiser</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {message && (
            <p className="text-center mt-4 text-sm text-green-600">{message}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
