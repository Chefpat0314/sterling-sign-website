// pages/_app.js
import '../styles/globals.css';   // <-- ensures Tailwind loads
import '../styles/buttons.css';   // <-- global button styles
import '../styles/accessibility.css';   // <-- accessibility enhancements
import '../styles/tokens.css';   // <-- Sterling design tokens
import Layout from '../components/Layout';
import TrustBar from '../components/TrustBar';
import { analytics } from '../lib/metrics';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Track app view
    analytics.viewApp();
  }, []);

  return (
    <>
      <TrustBar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
