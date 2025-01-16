'use client'; // This ensures the component is treated as a client-side component
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Using usePathname for path detection

const Navbar = () => {
  const pathname = usePathname(); // Use usePathname to get the current path

  return (
    <nav className="bg-gray-800 py-3">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <span className="text-white text-lg font-bold">LOGO</span>
          <div className="flex space-x-4">
            <Link
              href="/upload"
              className={`rounded-md px-5 py-3 text-base font-medium ${
                pathname === '/upload'
                  ? 'bg-gray-900 text-white' // Active link styling
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive link styling
              }`}
            >
              Upload
            </Link>
            <Link
              href="/gallery"
              className={`rounded-md px-5 py-3 text-base font-medium ${
                pathname === '/gallery'
                  ? 'bg-gray-900 text-white' // Active link styling
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive link styling
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
