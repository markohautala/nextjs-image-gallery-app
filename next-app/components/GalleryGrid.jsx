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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
      }}
    >
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt="Uppladdad bild"
          style={{ width: "100%" }}
        />
      ))}
    </div>
  );
}
