// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Routes where you do NOT want the header
  // const hideHeaderRoutes = ['/auth/signin', '/auth/signup', '/advertiser/*', '/tasker'];
  const pathname = router.pathname;

  const shouldHideHeader =
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/auth/signup') ||
    pathname.startsWith('/advertiser') ||
    pathname.startsWith('/tasker');

  // Show header if not in hide list AND if the route contains 'dashboard'
  const showHeader = shouldHideHeader && !pathname.includes('dashboard');

  return (
    <div className="h-screen dark:bg-gray-950">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
            width: '400px',
          },
          success: {
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
          duration: 3000,
        }}
      />

      {showHeader && <Header />}

      <Component {...pageProps} className="text-black dark:text-white dark:bg-gray-950" />
    </div>
  );
}

export default MyApp;
