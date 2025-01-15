"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import from next/navigation

export default function GalleryGrid() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const searchParams = useSearchParams(); // Access query parameters

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Could not fetch images");
      }
    };

    // Display the loading spinner first, then fetch images after 2 seconds
    const timer = setTimeout(() => {
      fetchImages(); // Fetch images after the spinner delay
      setIsLoading(false); // Stop loading after fetching images
    }, 4000); // 2000ms = 2 seconds

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [searchParams]); // Refetch images when query parameters change

  return (
    <div className="gallery-container">
      {isLoading ? (
        <div className="loading-spinner">
          {/* Display your loading GIF here */}
          <img src="/images/spinner.gif" alt="Loading..." className="spinner-gif" />
        </div>
      ) : (
        <div className="gallery-columns">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="Uploaded image"
              className="gallery-image"
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .gallery-container {
          width: 100%;
          padding: 10px;
        }

        .gallery-columns {
          column-count: 1; /* Default to 1 column */
          column-gap: 10px;

          /* Medium screens: 2 columns */
          @media (min-width: 768px) {
            column-count: 2;
          }

          /* Large screens: 3 columns */
          @media (min-width: 1024px) {
            column-count: 3;
          }
        }

        .gallery-image {
          width: 100%;
          margin-bottom: 10px;
          border-radius: 12px;
          object-fit: cover;
          display: block; /* Ensures images stay aligned within columns */
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* Full screen height to center the spinner */
        }

        .spinner-gif {
          width: 100px; /* Adjust the size of the GIF */
          height: 100px;
        }
      `}</style>
    </div>
  );
}
