import Head from 'next/head';
import Layout from '../components/Layout';

export default function AccessibilityPage() {
  return (
    <>
      <Head>
        <title>Accessibility Statement | Sterling Sign Solutions</title>
        <meta name="description" content="Sterling Sign Solutions Accessibility Statement - Our commitment to making our website accessible to all users." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sterling-sign-website.vercel.app/accessibility" />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
                <p className="text-gray-600 mb-4">
                  Sterling Sign Solutions is committed to ensuring digital accessibility for all users, 
                  including those with disabilities. We strive to provide an accessible and inclusive 
                  experience for everyone who visits our website.
                </p>
                <p className="text-gray-600">
                  We are actively working to increase the accessibility and usability of our website 
                  and in doing so adhere to many of the available standards and guidelines.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Standards</h2>
                <p className="text-gray-600 mb-4">
                  This website endeavors to conform to level AA of the World Wide Web Consortium (W3C) 
                  Web Content Accessibility Guidelines 2.1. These guidelines explain how to make web 
                  content more accessible for people with disabilities, and user-friendly for everyone.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-3">WCAG 2.1 Level AA Compliance</h3>
                  <p className="text-blue-800 mb-4">
                    We are working to ensure our website meets WCAG 2.1 Level AA standards, which include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Perceivable: Information and UI components must be presentable in ways users can perceive</li>
                    <li>Operable: UI components and navigation must be operable</li>
                    <li>Understandable: Information and UI operation must be understandable</li>
                    <li>Robust: Content must be robust enough for interpretation by assistive technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Keyboard Navigation</h3>
                    <p className="text-gray-600 mb-3">
                      Our website can be navigated using only a keyboard. Use the Tab key to move forward 
                      through interactive elements and Shift+Tab to move backward.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Skip links are provided to jump to main content</li>
                      <li>All interactive elements are keyboard accessible</li>
                      <li>Focus indicators are clearly visible</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Screen Reader Support</h3>
                    <p className="text-gray-600 mb-3">
                      Our website is designed to work with screen readers and other assistive technologies:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Semantic HTML structure with proper headings</li>
                      <li>Alt text for all images</li>
                      <li>ARIA labels and descriptions where needed</li>
                      <li>Form labels and instructions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Visual Accessibility</h3>
                    <p className="text-gray-600 mb-3">
                      We've designed our website with visual accessibility in mind:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>High contrast color schemes</li>
                      <li>Scalable text and images</li>
                      <li>Clear typography and spacing</li>
                      <li>Consistent navigation and layout</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h2>
                <p className="text-gray-600 mb-4">
                  We are continuously working to improve the accessibility of our website. Recent improvements include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Added skip navigation links</li>
                  <li>Improved color contrast ratios</li>
                  <li>Enhanced keyboard navigation</li>
                  <li>Added ARIA labels and descriptions</li>
                  <li>Improved form accessibility</li>
                  <li>Optimized for screen readers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assistive Technologies</h2>
                <p className="text-gray-600 mb-4">
                  Our website is compatible with the following assistive technologies:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Screen Readers</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• NVDA (Windows)</li>
                      <li>• JAWS (Windows)</li>
                      <li>• VoiceOver (Mac)</li>
                      <li>• TalkBack (Android)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Browser Support</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chrome with extensions</li>
                      <li>• Firefox with extensions</li>
                      <li>• Safari with VoiceOver</li>
                      <li>• Edge with Narrator</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Issues</h2>
                <p className="text-gray-600 mb-4">
                  We are aware of the following accessibility issues and are working to resolve them:
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    <li>Some older PDF documents may not be fully accessible</li>
                    <li>Video content may need captions (in progress)</li>
                    <li>Some complex data tables could benefit from better structure</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback and Support</h2>
                <p className="text-gray-600 mb-4">
                  We welcome your feedback on the accessibility of our website. If you encounter any 
                  accessibility barriers or have suggestions for improvement, please contact us:
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-2">Accessibility Contact</h4>
                  <p className="text-green-800 mb-2">Email: accessibility@sterlingsignsolutions.com</p>
                  <p className="text-green-800 mb-2">Phone: (555) 123-4567</p>
                  <p className="text-green-800">Address: 123 Business St, City, State 12345</p>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Response Time</h4>
                  <p className="text-blue-800">
                    We aim to respond to accessibility feedback within 2 business days and will work 
                    to resolve any issues as quickly as possible.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
                <p className="text-gray-600">
                  Some content on our website may be provided by third parties. While we strive to ensure 
                  all content meets accessibility standards, we cannot guarantee the accessibility of 
                  third-party content. If you encounter accessibility issues with third-party content, 
                  please let us know and we will work with the provider to address the issue.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Statement</h2>
                <p className="text-gray-600">
                  We will review and update this accessibility statement regularly to reflect our ongoing 
                  commitment to accessibility and any improvements we make to our website.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
