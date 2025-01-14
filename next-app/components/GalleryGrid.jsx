"use client";

import { useEffect, useState } from "react";

export default function GalleryGrid() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Kunde inte hämta bilder");
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="gallery-grid">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt="Uppladdad bild"
          className="gallery-image"
        />
      ))}
      <style jsx>{`
        .gallery-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr; /* Default to 1 column */

          /* Medium screens: 2 columns */
          @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
          }

          /* Large screens: 3 columns */
          @media (min-width: 1024px) {
            grid-template-columns: repeat(3, 1fr);
          }

          /* Add grid-auto-rows for consistent row height */
          grid-auto-rows: auto;
        }

        .gallery-image {
          width: 100%;
          border-radius: 8px;
          object-fit: cover; /* Ensures images fill the space proportionally */
        }
      `}</style>
    </div>
  );
}
