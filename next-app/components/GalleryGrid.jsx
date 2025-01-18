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

    // Display the loading spinner first, then fetch images after 2 seconds
    const timer = setTimeout(() => {
      fetchImages(); // Fetch images after the spinner delay
      setIsLoading(false); // Stop loading after fetching images
    }, 4000); // 4000ms = 4 seconds

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [searchParams]); // Refetch images when query parameters change

  // Set up IntersectionObserver to trigger fade-in effect on image elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once the image has faded in
          }
        });
      },
      {
        threshold: 0.5, // Trigger when at least 50% of the image is in view
      }
    );

    // Observe each image
    imageRefs.current.forEach(image => {
      observer.observe(image);
    });

    return () => {
      observer.disconnect(); // Cleanup the observer on unmount
    };
  }, [images]); // Run this effect every time the images change

  // Function to download the image
  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // This will download the image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          position: relative; // Position relative for absolute children
        }

        .download-square {
          position: absolute; // Position it over the image
          top: 10px; // Move to the top
          right: 10px; // Move to the right
          width: 50px; // Set width to 45px
          height: 50px; // Set height to 45px
          background: rgba(255, 255, 255, 0.2); // Glassmorphism effect
          backdrop-filter: blur(20px); // Blur effect
          border-radius: 5px; // Rounded corners
          display: flex; // Center the icon
          justify-content: center; // Center horizontally
          align-items: center; // Center vertically
          cursor: pointer; // Change cursor to pointer
        }

        .download-square:hover {
          background: rgba(255, 255, 255, 0.4); // Change on hover
        }

        .material-symbols-outlined {
          color: white; // Set icon color to white
          font-size: 34px; // Adjust icon size if needed
        }
      `}</style>
    </div>
  );
}