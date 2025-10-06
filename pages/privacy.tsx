import Head from 'next/head';
import Layout from '../components/Layout';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Sterling Sign Solutions</title>
        <meta name="description" content="Sterling Sign Solutions Privacy Policy - How we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sterling-sign-website.vercel.app/privacy" />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Personal Information</h3>
                    <p className="text-gray-600">
                      We collect information you provide directly to us, such as when you create an account, 
                      request a quote, or contact us. This may include:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                      <li>Name and contact information (email, phone, address)</li>
                      <li>Company information</li>
                      <li>Project specifications and requirements</li>
                      <li>Payment information (processed securely through our payment partners)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Automatically Collected Information</h3>
                    <p className="text-gray-600">
                      We automatically collect certain information when you visit our website:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                      <li>IP address and browser information</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website information</li>
                      <li>Device and operating system information</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process orders and deliver products</li>
                  <li>Communicate with you about your orders and our services</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Analyze website usage and improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, except:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist us in operating our website and conducting our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, 
                  secure servers, and regular security audits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to enhance your experience on our website. 
                  You can control cookie preferences through our cookie banner or your browser settings.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Cookie Types We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li><strong>Necessary:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Marketing:</strong> Used to deliver relevant advertisements</li>
                    <li><strong>Functional:</strong> Remember your preferences and settings</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Object to processing of your information</li>
                  <li>Data portability</li>
                  <li>Withdraw consent for marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our services are not directed to children under 13. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected 
                  personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Sterling Sign Solutions</h4>
                  <p className="text-gray-600">Email: privacy@sterlingsignsolutions.com</p>
                  <p className="text-gray-600">Phone: (555) 123-4567</p>
                  <p className="text-gray-600">Address: 123 Business St, City, State 12345</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
