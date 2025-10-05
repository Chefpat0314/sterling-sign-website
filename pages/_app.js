// pages/_app.js
import '../styles/globals.css';   // <-- ensures Tailwind loads
import '../styles/buttons.css';   // <-- global button styles
import '../styles/accessibility.css';   // <-- accessibility enhancements
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
