'use client'; // This ensures the component is treated as a client-side component
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Using usePathname for path detection

const Navbar = () => {
  const pathname = usePathname(); // Use usePathname to get the current path

  return (
    <nav className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      {/* Gradient Background */}
      <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
        <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)'}}></div>
      </div>
      <div className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
        <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)'}}></div>
      </div>

      {/* Main Navbar Content */}
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full">
        <div className="relative flex h-16 items-center">
          {/* PIXSHARE Text on the left */}
          <div className="text-black text-lg font-bold">
            PIXSHARE
          </div>

          {/* Navigation Links - aligned to the right */}
          <div className="ml-auto flex space-x-4">
            <Link
              href="/upload"
              className={`rounded-full bg-gray-800 px-5 py-4 text-sm font-semibold text-white shadow-sm ${
                pathname === '/upload'
                  ? 'border-1 border-white bg-black text-white' // Active state
                  : 'text-gray-300 hover:bg-black hover:text-white' // Default hover behavior
              }`}
            >
              Upload
            </Link>

            <Link
              href="/gallery"
              className={`rounded-full bg-gray-800 px-5 py-4 text-sm font-semibold text-white shadow-sm ${
                pathname === '/gallery'
                  ? 'border-1 border-white bg-black text-white' // Active state
                  : 'text-gray-300 hover:bg-black hover:text-white' // Default hover behavior
              }`}
            >
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
