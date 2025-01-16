import Navbar from "../components/Navbar"; // Import the Navbar component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Navbar is now included globally */}
        <main>{children}</main>
      </body>
    </html>
  );
}
