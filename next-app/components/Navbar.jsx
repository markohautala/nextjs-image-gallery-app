import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-white text-lg font-bold">LOGO</span>
        <div className="flex space-x-4">
          <Link href="/upload" className="bg-white text-black px-4 py-2 rounded-md">Upload</Link>
          <Link href="/gallery" className="bg-white text-black px-4 py-2 rounded-md">Gallery</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
