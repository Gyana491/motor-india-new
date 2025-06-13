import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Motor India</h3>
            <p className="text-gray-300 mb-4">
              India's #1 complete automotive platform. Get accurate on-road car prices, 
              compare specifications, read expert reviews, and make informed car buying decisions.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span>{' '}
                <a 
                  href="mailto:support@motorindia.in" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  support@motorindia.in
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/cars" className="block text-gray-300 hover:text-white transition-colors">
                Cars
              </Link>
              <Link href="/hindi" className="block text-gray-300 hover:text-white transition-colors">
                News
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <nav className="space-y-2">
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Car Pricing Help
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Motor India. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
