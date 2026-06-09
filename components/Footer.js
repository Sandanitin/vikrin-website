// Footer component
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-[#1F3CAB] text-white py-12 px-4 sm:px-6 mt-20">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">

        {/* Branding */}
        <div>
          <h3 className="text-xl font-bold mb-3">Vikrin</h3>
          <p className="text-sm text-gray-200">Building solutions that matter. Let’s talk.</p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            <a href="https://linkedin.com/company/vikrin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="w-5 h-5 hover:text-gray-300" />
            </a>
            <a href="https://instagram.com/vikrintech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="w-5 h-5 hover:text-gray-300" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "About", href: "/about", isAnchor: false },
              { label: "Services", href: "/#services", isAnchor: true },
              { label: "Careers", href: "/careers", isAnchor: false },
              { label: "Contact", href: "/#contact", isAnchor: true },
              { label: "Privacy Policy", href: "/privacy-policy", isAnchor: false },
              { label: "Terms & Conditions", href: "/terms", isAnchor: false },
              { label: "Admin Login", href: "/admin/login", isAnchor: false },
            ].map((link, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {link.isAnchor ? (
                  <a href={link.href} className="hover:underline">{link.label}</a>
                ) : (
                  <Link href={link.href} className="hover:underline">{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p className="text-sm">Email: <a href="mailto:contact@vikrin.com" className="underline">contact@vikrin.com</a></p>
          <p className="text-sm mt-2">WhatsApp: <a href="https://wa.me/919177754434" className="underline">+91 91777 54434</a></p>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center mt-10 text-xs sm:text-sm text-gray-300 border-t border-gray-400 pt-6">
        &copy; {new Date().getFullYear()} Vikrin Private Limited. All Rights Reserved.
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 bg-white text-[#1F3CAB] p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}