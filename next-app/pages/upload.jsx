import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Upload() {
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleImageUpload = async () => {
    for (const image of images) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
      };
    }
    router.push('/gallery');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <label className="w-64 h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => setImages([...e.target.files])}
        />
        📷 Upload Images
      </label>
      <button
        onClick={handleImageUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Upload
      </button>
    </div>
  );
}
