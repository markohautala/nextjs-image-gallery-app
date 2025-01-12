"use client"; // Add this at the top

import { useEffect, useState } from "react";

export default function GalleryGrid() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images");
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {images.map((image) => (
        <img key={image.id} src={image.url} alt="Uploaded" style={{ width: "100%" }} />
      ))}
    </div>
  );
}
