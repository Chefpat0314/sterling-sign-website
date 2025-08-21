// pages/_app.js
import '../styles/globals.css';   // <-- ensures Tailwind loads
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
