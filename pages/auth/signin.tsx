'use client';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

const SignIn = () => {
  useRedirectIfAuthenticated();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (signInError || !data.user) {
      console.error('Login error:', signInError?.message);
      setError(signInError?.message || 'Unknown error');
      setLoading(false);
      return;
    }

  const user = data.user;

  // Fetch role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError?.message);
    setError('Failed to fetch user role.');
    setLoading(false);
    return;
  }
  const role = profile.role;

  console.log('User role:', role);

  // Redirect based on role
  if (role === 'advertiser') {
    router.push('/advertiser');
  } else if (role === 'tasker') {
    router.push('/tasker');
  } else {
      router.push('/unauthorized');
  } 

  setLoading(false);
};

  return (
    <div className="mx-auto dark:bg-gray-900 dark:text-white h-screen flex items-center justify-center px-4">
      <div className="dark:bg-gray-800 max-w-md w-full bg-white dark:text-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-center text-2xl font-bold mb-4">
          Welcome back to FocusPay
        </h2>

        <form onSubmit={handleSignIn} className="p-6 rounded ">
          <div>
            <label className="dark:text-white block text-gray-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mt-3 dark:text-white block text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {error && (
            <div className="dark:text-white text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer dark:text-white mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <p className="dark:text-gray-400 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="dark:text-blue-400 text-blue-600 hover:pointerhover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>

  );
};

export default SignIn;


