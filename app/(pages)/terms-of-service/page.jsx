import { Metadata } from 'next';

export const metadata = {
  title: 'Terms of Service - Motor India | User Agreement',
  description: 'Read Motor India\'s terms of service and user agreement. Understand the rules and guidelines for using our automotive platform.',
  keywords: 'terms of service, user agreement, motor india, terms and conditions, website terms, automotive platform',
  openGraph: {
    title: 'Terms of Service - Motor India',
    description: 'Motor India\'s terms of service and user agreement for our automotive platform.',
    type: 'website',
  },
};

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of Motor India's automotive platform. 
            Please read them carefully before using our services.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                By accessing and using Motor India ("we," "our," or "us"), you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>
              <p className="text-gray-600">
                If you do not agree to abide by the above, please do not use this service. 
                These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Motor India is a comprehensive automotive platform that provides:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Car specifications, features, and pricing information</li>
                <li>RTO tax calculations and on-road price estimates</li>
                <li>Car comparison tools and reviews</li>
                <li>Automotive news and articles</li>
                <li>360-degree car views and image galleries</li>
                <li>Location-based automotive services</li>
              </ul>
              <p className="text-gray-600">
                Our services are provided for informational purposes and to assist users in making 
                informed automotive decisions.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                While many features of Motor India are available without registration, some services 
                may require you to create an account.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Account Responsibilities</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                You agree to use Motor India only for lawful purposes and in accordance with these terms. 
                You agree not to:
              </p>
              
              <div className="grid gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Prohibited Activities</h4>
                  <ul className="list-disc pl-6 text-red-700 space-y-1 text-sm">
                    <li>Use the service for any illegal or unauthorized purpose</li>
                    <li>Violate any laws in your jurisdiction</li>
                    <li>Transmit harmful code, viruses, or malicious software</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service or servers</li>
                    <li>Scrape or harvest data without permission</li>
                    <li>Impersonate another person or entity</li>
                    <li>Post false, misleading, or fraudulent content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Content and Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Information Accuracy</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Information Accuracy</h4>
                <p className="text-yellow-700 text-sm">
                  While we strive to provide accurate and up-to-date information about cars, pricing, 
                  and specifications, we cannot guarantee the completeness or accuracy of all content.
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Price Information:</strong> Car prices, RTO calculations, and on-road estimates 
                  are provided for reference only. Actual prices may vary based on location, dealer, 
                  and current market conditions.
                </p>
                <p className="text-gray-600">
                  <strong>Specifications:</strong> Car specifications and features may change without notice. 
                  Always verify information with authorized dealers before making purchase decisions.
                </p>
                <p className="text-gray-600">
                  <strong>Reviews and Opinions:</strong> User reviews and expert opinions are subjective 
                  and may not reflect your personal experience.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                The Motor India service and its original content, features, and functionality are owned 
                by Motor India and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Your Content License</h4>
                <p className="text-blue-700 text-sm">
                  By submitting content (reviews, comments, feedback) to Motor India, you grant us 
                  a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and 
                  distribute your content in connection with our service.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Third-Party Content</h4>
                <p className="text-gray-600 text-sm">
                  Some content on our platform may be owned by third parties (car manufacturers, dealers). 
                  Such content is used under appropriate licenses or fair use provisions.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-600">
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy-policy" className="text-red-600 hover:text-red-800 underline">
                Privacy Policy
              </a>
              {' '}to understand how we collect, use, and protect your information.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitation of Liability</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Service Disclaimer</h4>
                <p className="text-gray-600 text-sm">
                  Motor India is provided "as is" and "as available" without warranties of any kind, 
                  either express or implied. We do not warrant that the service will be uninterrupted, 
                  error-free, or free of viruses or other harmful components.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Limitation of Liability</h4>
                <p className="text-gray-600 text-sm">
                  Motor India shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including loss of profits, data, or other intangible losses 
                  resulting from your use of the service.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Our service may contain links to third-party websites, including car manufacturers, 
                dealers, and other automotive services. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>The content, privacy policies, or practices of third-party sites</li>
                <li>Any damages or losses caused by third-party services</li>
                <li>The availability or accuracy of external content</li>
                <li>Transactions conducted with third parties</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                We may terminate or suspend your access to Motor India immediately, without prior notice 
                or liability, for any reason, including breach of these terms.
              </p>
              <p className="text-gray-600">
                Upon termination, your right to use the service will cease immediately. 
                All provisions that should survive termination will survive, including ownership provisions, 
                warranty disclaimers, and limitation of liability.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                We reserve the right to modify or replace these terms at any time. 
                If a revision is material, we will provide at least 30 days notice before any new terms take effect.
              </p>
              <p className="text-gray-600">
                By continuing to access or use our service after revisions become effective, 
                you agree to be bound by the revised terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Jurisdiction</h2>
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction 
              of the courts in India.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
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
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
