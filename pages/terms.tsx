import Head from 'next/head';
import Layout from '../components/Layout';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service | Sterling Sign Solutions</title>
        <meta name="description" content="Sterling Sign Solutions Terms of Service - Our terms and conditions for using our website and services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sterling-sign-website.vercel.app/terms" />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Sterling Sign Solutions' website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-600 mb-4">
                  Permission is granted to temporarily download one copy of the materials on Sterling Sign Solutions' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Services and Products</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Custom Sign Manufacturing</h3>
                    <p className="text-gray-600">
                      We provide custom sign manufacturing services. All designs, specifications, and requirements 
                      must be clearly communicated and approved before production begins.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Pricing and Payment</h3>
                    <p className="text-gray-600">
                      All prices are subject to change without notice. Payment terms will be specified in individual 
                      quotes and contracts. We accept major credit cards and business checks.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Production and Delivery</h3>
                    <p className="text-gray-600">
                      Production times and delivery dates are estimates and may vary based on project complexity, 
                      material availability, and other factors beyond our control.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
                <p className="text-gray-600 mb-4">
                  The content, organization, graphics, design, compilation, magnetic translation, digital conversion, 
                  and other matters related to the website are protected under applicable copyrights, trademarks, 
                  and other proprietary rights.
                </p>
                <p className="text-gray-600">
                  You may not use our trademarks, logos, or other proprietary information without our express written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
                <p className="text-gray-600 mb-4">You agree to:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Provide accurate and complete information when requesting quotes or services</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use our services for any unlawful purpose</li>
                  <li>Not interfere with the proper functioning of our website</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall Sterling Sign Solutions or its suppliers be liable for any damages (including, 
                  without limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use the materials on Sterling Sign Solutions' website, even if 
                  Sterling Sign Solutions or a Sterling Sign Solutions authorized representative has been notified 
                  orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Warranty Disclaimer</h2>
                <p className="text-gray-600">
                  The materials on Sterling Sign Solutions' website are provided on an 'as is' basis. Sterling Sign Solutions 
                  makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including 
                  without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                  or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Revisions and Errata</h2>
                <p className="text-gray-600">
                  The materials appearing on Sterling Sign Solutions' website could include technical, typographical, 
                  or photographic errors. Sterling Sign Solutions does not warrant that any of the materials on its 
                  website are accurate, complete, or current. Sterling Sign Solutions may make changes to the materials 
                  contained on its website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Links to Other Websites</h2>
                <p className="text-gray-600">
                  Sterling Sign Solutions has not reviewed all of the sites linked to our website and is not responsible 
                  for the contents of any such linked site. The inclusion of any link does not imply endorsement by 
                  Sterling Sign Solutions of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                <p className="text-gray-600">
                  These terms and conditions are governed by and construed in accordance with the laws of the State of 
                  California and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-600">
                  Sterling Sign Solutions may revise these terms of service for its website at any time without notice. 
                  By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Sterling Sign Solutions</h4>
                  <p className="text-gray-600">Email: legal@sterlingsignsolutions.com</p>
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
