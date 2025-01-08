import { useEffect, useState } from 'react';

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data);
    }
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {images.map((image) => (
        <img
          key={image.public_id}
          src={image.secure_url}
          alt="Uploaded"
          className="w-full h-64 object-cover rounded-md"
        />
      ))}
    </div>
  );
}
