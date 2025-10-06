import Head from 'next/head';
import Layout from '../../components/Layout';
import DynamicDashboard from '../../components/account/DynamicDashboard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('demo-user-123');

  useEffect(() => {
    // In a real app, this would get the actual user ID from authentication
    // For demo purposes, we'll use a mock user ID
    const mockUserId = 'demo-user-123';
    setUserId(mockUserId);
  }, []);

  return (
    <>
      <Head>
        <title>My Account | Sterling Sign Solutions</title>
        <meta name="description" content="Manage your account, view orders, and access your design vault." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <DynamicDashboard userId={userId} />
          </div>
        </div>
      </Layout>
    </>
  );
}
