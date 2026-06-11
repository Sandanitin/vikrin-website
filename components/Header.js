import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false); // scroll down
      } else {
        setShow(true); // scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`flex items-center justify-between px-8 py-5 bg-[#e5e5e5] shadow-md sticky top-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center space-x-3">
        <Link href="/" scroll={true}>
          <Image
            src="/logo.png"
            alt="Vikrin Logo"
            width={160}
            height={48}
            className="h-12 w-auto cursor-pointer"
            priority
            quality={100}
          />
        </Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setNavOpen(!navOpen)} className="text-gray-700 text-2xl">
          ☰
        </button>
      </div>

      <nav className={`${navOpen ? "flex" : "hidden"} flex-col absolute top-20 right-8 bg-white p-4 rounded-lg shadow-md space-y-4 md:flex md:flex-row md:static md:bg-transparent md:space-y-0 md:space-x-6 text-gray-700 font-medium`}>
        <Link href="/#services" className="hover:text-blue-600">Services</Link>
        <Link href="/#portfolio" className="hover:text-blue-600">Portfolio</Link>
        <Link href="/#why-us" className="hover:text-blue-600">Why Us</Link>
        <Link href="/#testimonials" className="hover:text-blue-600">Testimonials</Link>
        <Link href="/#contact" className="hover:text-blue-600">Contact</Link>
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <Link href="/careers" className="hover:text-blue-600 font-semibold text-[#1F3CAB]">Careers</Link>
      </nav>
    </header>
  );
}