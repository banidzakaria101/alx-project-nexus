// components/Footer.tsx
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";
import { CodeBracketIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

function Footer() {
  const currentYear = new Date().getFullYear();
  const siteDescription = "CineVerse is your smart movie explorer, offering AI-powered recommendations and a personalized favorites list.";

  return (
    <footer className="bg-gray-950 text-gray-400 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-screen-2xl mx-auto">
        {/* Top Section: Branding, Description & Main Navigation */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-gray-800">
          {/* Branding (App Name/Logo and Description) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-sm">
            <Link href="/" className="flex items-center text-white text-2xl font-bold hover:text-orange-400 transition-colors duration-200 mb-2">
              <HomeIcon className="h-8 w-8 mr-2" />
              CineVerse
            </Link>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {siteDescription}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2 text-base font-medium">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link href="/favorites" className="hover:text-red-400 transition-colors duration-200">
              Favorites
            </Link>
            <Link href="/search/popular" className="hover:text-blue-400 transition-colors duration-200">
              Popular
            </Link>
            {/* Contact Us Link */}
            <Link href="/contact" className="hover:text-white transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright & Social Media */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-sm text-center sm:text-left">
            &copy; {currentYear} CineVerse. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <a href="https://github.com/yourusername/yourrepo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="GitHub">
              <CodeBracketIcon className="h-6 w-6" />
            </a>
            <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Portfolio/Website">
              <GlobeAltIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;