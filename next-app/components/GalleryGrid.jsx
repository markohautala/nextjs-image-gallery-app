"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Import from next/navigation

export default function GalleryGrid() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const searchParams = useSearchParams(); // Access query parameters

  const imageRefs = useRef([]); // Array to hold references for images

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

    // Display the loading spinner first, then fetch images after 4 seconds
    const timer = setTimeout(() => {
      fetchImages();
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [searchParams]);

  // Set up IntersectionObserver to trigger fade-in effect on image elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target); // Stop observing once the image has faded in
          }
        });
      },
      {
        threshold: 0.5, // Trigger when at least 50% of the image is in view
      }
    );

    // Observe each image
    imageRefs.current.forEach((image) => {
      observer.observe(image);
    });

    return () => {
      observer.disconnect(); // Cleanup the observer on unmount
    };
  }, [images]);

  // Function to download the image properly
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "downloaded-image.jpg"; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL to free up memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="gallery-container">
      {isLoading ? (
        <div className="loading-spinner">
          {/* Display your loading GIF here */}
          <img src="/images/spinner.gif" alt="Loading..." className="spinner-gif" />
        </div>
      ) : (
        <div className="gallery-columns">
          {images.map((image, index) => (
            <div className="image-container" key={image.id}>
              <img
                src={image.url}
                alt="Uploaded image"
                className="gallery-image"
                ref={(el) => (imageRefs.current[index] = el)} // Assign ref to each image
              />
              <div className="download-square" onClick={() => downloadImage(image.url)}>
                <span className="material-symbols-outlined">download</span>
              </div>
            </div>
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
          object-fit: cover; /* Ensures images fit well */
          display: block; /* Ensures images stay aligned within columns */
          opacity: 0; /* Initially set to fully transparent */
          transition: opacity 0.7s ease-out; /* Smooth fade-in transition */
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

        /* Fade-in effect when image comes into view */
        .fade-in {
          opacity: 1; /* Make image fully opaque */
        }

        .image-container {
          position: relative; /* Position relative for absolute children */
        }

        .download-square {
          position: absolute; /* Position it over the image */
          top: 10px;
          right: 10px;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2); /* Glassmorphism effect */
          backdrop-filter: blur(20px); /* Blur effect */
          border-radius: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .download-square:hover {
          background: rgba(255, 255, 255, 0.4); /* Change on hover */
        }

        .material-symbols-outlined {
          color: white;
          font-size: 34px; /* Adjust icon size if needed */
        }
      `}</style>
    </div>
  );
}
