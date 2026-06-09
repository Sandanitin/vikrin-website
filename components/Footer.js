// Footer component
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaInstagram, FaArrowUp, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-[#1F3CAB] text-white py-16 px-6 sm:px-8 mt-20 border-t-4 border-green-500">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3">

        {/* Branding */}
        <div className="space-y-4">
          <div className="bg-white px-4 py-2 rounded-2xl inline-block shadow-lg border border-white/10 hover:scale-105 transition duration-200">
            <Image
              src="/logo.png"
              alt="Vikrin Logo"
              width={140}
              height={42}
              className="h-10 w-auto"
              quality={100}
            />
          </div>
          <p className="text-sm text-gray-200 leading-relaxed font-medium">Building solutions that matter. Let’s talk.</p>

          {/* Socials */}
          <div className="flex gap-4 pt-2">
            <a href="https://linkedin.com/company/vikrin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:text-blue-300 transition duration-200 shadow-sm">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/vikrintech" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:text-pink-300 transition duration-200 shadow-sm">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/share/1H7ExZ2puK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:text-blue-400 transition duration-200 shadow-sm">
              <FaFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4 tracking-tight border-b border-white/10 pb-2 inline-block">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "About", href: "/about", isAnchor: false },
              { label: "Services", href: "/#services", isAnchor: true },
              { label: "Careers", href: "/careers", isAnchor: false },
              { label: "Contact", href: "/#contact", isAnchor: true },
              { label: "Privacy Policy", href: "/privacy-policy", isAnchor: false },
              { label: "Terms & Conditions", href: "/terms", isAnchor: false },
            ].map((link, idx) => (
              <li key={idx} className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/40 group-hover:text-white transition duration-200 transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {link.isAnchor ? (
                  <a href={link.href} className="hover:underline transform group-hover:translate-x-1 transition duration-200 text-gray-200 hover:text-white font-medium">{link.label}</a>
                ) : (
                  <Link href={link.href} className="hover:underline transform group-hover:translate-x-1 transition duration-200 text-gray-200 hover:text-white font-medium">{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-4 tracking-tight border-b border-white/10 pb-2 inline-block">Contact</h4>
          <div className="space-y-3 text-sm text-gray-200 font-medium">
            <p>Email: <a href="mailto:contact@vikrin.com" className="underline hover:text-white transition">contact@vikrin.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/919177754434" className="underline hover:text-white transition">+91 91777 54434</a></p>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center mt-12 text-xs sm:text-sm text-gray-300 border-t border-white/10 pt-6 font-medium">
        &copy; {new Date().getFullYear()} Vikrin Private Limited. All Rights Reserved.
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 bg-white text-[#1F3CAB] p-2.5 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 active:scale-95 transition cursor-pointer"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}