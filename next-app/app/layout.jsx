import "./globals.css";
import Navbar from "../components/Navbar";

// RootLayout is the main layout component for the application.
// It wraps the content of all pages and adds global structure and styles.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Page title and meta information */}
        <title>PIXSHARE | Created by Marko Hautala</title>

        {/* Favicon for the browser tab */}
        <link rel="icon" href="/images/favicon.png" type="image/png" />

        {/* Link to an external font from Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>
      <body>
        {/* The Navbar component is displayed at the top of every page */}
        <Navbar />

        {/* The main content of the page is rendered here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
