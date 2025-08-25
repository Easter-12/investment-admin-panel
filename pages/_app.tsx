import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // We don't want to show the sidebar on the login page.
  // The login page is at the path '/', so we check for that.
  if (router.pathname === '/') {
    // If it's the login page, just show the component as is.
    return <Component {...pageProps} />;
  }

  // For ALL other pages (like /dashboard and /users), wrap them in our layout.
  // But wait, our dashboard is on the '/' path too. This logic is wrong.
  // Let's rethink. We have a login screen, and then the app.
  // The login screen is a special case.
  // Let's adjust the logic in the login page itself instead. This is simpler.

  // My apologies, the above logic is too complex.
  // Let's keep this file simple and handle the logic in the pages themselves.
  // Please use this simpler code for _app.tsx:

  return <Component {...pageProps} />;
}

export default MyApp;