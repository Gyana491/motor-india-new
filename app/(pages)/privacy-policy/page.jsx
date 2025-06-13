export const metadata = {
  title: 'Privacy Policy - Motor India | How We Protect Your Data',
  description: 'Learn how Motor India collects, uses, and protects your personal information. Our privacy policy outlines data handling practices for our automotive platform.',
  keywords: 'privacy policy, data protection, motor india, user privacy, personal information, data security',
  openGraph: {
    title: 'Privacy Policy - Motor India',
    description: 'Learn how Motor India protects your personal information and data privacy.',
    type: 'website',
  },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Motor India, we respect your privacy and are committed to protecting your personal information. 
            This policy explains how we collect, use, and safeguard your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-600 mb-2">
                  We may collect the following types of personal information when you use our services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Name, email address, and phone number (when you contact us or subscribe)</li>
                  <li>Location data (city, state) for RTO price calculations</li>
                  <li>Search preferences and car interests</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Information</h3>
                <p className="text-gray-600 mb-2">
                  We automatically collect information about how you interact with our platform:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Pages visited and time spent on our website</li>
                  <li>Car models and variants you research</li>
                  <li>Search queries and filters used</li>
                  <li>Referring websites and exit pages</li>
                  <li>Click-through rates and user engagement patterns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            
            <div className="space-y-3">
              <p className="text-gray-600">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Service Provision:</strong> To provide accurate car pricing, specifications, and regional information</li>
                <li><strong>RTO Calculations:</strong> To calculate on-road prices based on your location</li>
                <li><strong>Personalization:</strong> To customize content and recommendations based on your preferences</li>
                <li><strong>Communication:</strong> To respond to your inquiries and provide customer support</li>
                <li><strong>Analytics:</strong> To improve our website functionality and user experience</li>
                <li><strong>Marketing:</strong> To send relevant automotive news and updates (with your consent)</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Service Providers</h4>
                <p className="text-gray-600">
                  We work with trusted third-party service providers who assist us in operating our website, 
                  conducting our business, or servicing you. These parties are obligated to keep your information confidential.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Legal Requirements</h4>
                <p className="text-gray-600">
                  We may disclose your information when required by law, court order, or government request, 
                  or to protect our rights, property, or safety.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Business Transfers</h4>
                <p className="text-gray-600">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  as part of the transaction, subject to confidentiality obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            
            <div className="space-y-3">
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and data storage systems</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-gray-600 mt-3">
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Essential Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Required for basic website functionality, such as navigation and access to secure areas.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Help us understand how visitors interact with our website by collecting anonymous information.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Preference Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Remember your location, language preferences, and other customization settings.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Marketing Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Used to track visitors across websites to display relevant and engaging advertisements.
                  </p>
                </div>
              </div>

              <p className="text-gray-600">
                You can control cookie settings through your browser preferences. Note that disabling certain cookies 
                may affect website functionality.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">
                You have the following rights regarding your personal information:
              </p>
              
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Access and Portability</h4>
                    <p className="text-gray-600 text-sm">Request a copy of the personal information we hold about you</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Correction</h4>
                    <p className="text-gray-600 text-sm">Update or correct inaccurate personal information</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Deletion</h4>
                    <p className="text-gray-600 text-sm">Request deletion of your personal information (subject to legal obligations)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Opt-out</h4>
                    <p className="text-gray-600 text-sm">Unsubscribe from marketing communications at any time</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>To exercise your rights:</strong> Contact us at{' '}
                  <a href="mailto:support@motorindia.in" className="text-blue-600 hover:text-blue-800 underline">
                    support@motorindia.in
                  </a>
                  {' '}or use our contact form. We will respond within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
            
            <div className="space-y-3">
              <p className="text-gray-600">
                Our website may contain links to third-party websites and services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for content sharing</li>
                <li>Car manufacturer websites for detailed specifications</li>
                <li>Payment processors for subscription services</li>
              </ul>
              <p className="text-gray-600 mt-3">
                These third parties have their own privacy policies. We encourage you to review their privacy practices 
                before providing any personal information.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              Motor India is not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children. If you are a parent or guardian and believe your child 
              has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Users</h2>
            <p className="text-gray-600">
              Motor India primarily serves users in India. If you access our services from outside India, 
              please be aware that your information may be transferred to, stored, and processed in India, 
              where our servers are located and our central database is operated.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                We may update this privacy policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors.
              </p>
              <p className="text-gray-600">
                We will notify you of any material changes by posting the updated policy on this page 
                and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">Email:</span>
                <a 
                  href="mailto:support@motorindia.in" 
                  className="text-red-600 hover:text-red-800 underline"
                >
                  support@motorindia.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">Website:</span>
                <a 
                  href="/contact-us" 
                  className="text-red-600 hover:text-red-800 underline"
                >
                  Contact Form
                </a>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4">
              We are committed to resolving any privacy concerns you may have and will respond to your 
              inquiries within 30 business days.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
