"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Import from next/navigation

// GalleryGrid component is responsible for displaying images in a grid format.
export default function GalleryGrid() {
  const [images, setImages] = useState([]); // State to store fetched images
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const searchParams = useSearchParams(); // Access query parameters

  const imageRefs = useRef([]); // Store references for each image element

  // useEffect to fetch images and control loading state
  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images"); // Fetch images from the API
      if (response.ok) {
        const data = await response.json();
        setImages(data); // Set images to state once fetched
      } else {
        console.error("Could not fetch images");
      }
    };

    // Delay fetching images to show a loading spinner first
    const timer = setTimeout(() => {
      fetchImages();
      setIsLoading(false); // Set loading state to false after images are fetched
    }, 4000); // 4-second delay for loading spinner

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [searchParams]);

  // useEffect to observe when images come into view and apply fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in"); // Add fade-in class
            observer.unobserve(entry.target); // Stop observing after fade-in
          }
        });
      },
      {
        threshold: 0.5, // Trigger fade-in when at least 50% of the image is visible
      }
    );

    // Observe each image in the grid
    imageRefs.current.forEach((image) => {
      observer.observe(image);
    });

    return () => {
      observer.disconnect(); // Cleanup observer on component unmount
    };
  }, [images]);

  // Function to handle image download
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob(); // Get the image as a blob
      const blobUrl = URL.createObjectURL(blob); // Create a blob URL

      const link = document.createElement("a"); // Create an invisible download link
      link.href = blobUrl;
      link.download = "downloaded-image.jpg"; // Set the default file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl); // Revoke the blob URL to free up memory
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="gallery-container">
      {isLoading ? (
        <div className="loading-spinner">
          {/* Display the loading spinner while images are being fetched */}
          <img src="/images/spinner.gif" alt="Loading..." className="spinner-gif" />
        </div>
      ) : (
        <div className="gallery-columns">
          {/* Render images in a grid layout */}
          {images.map((image, index) => (
            <div className="image-container" key={image.id}>
              <img
                src={image.url}
                alt="Uploaded image"
                className="gallery-image"
                ref={(el) => (imageRefs.current[index] = el)} // Assign ref to each image
              />
              <div className="download-square" onClick={() => downloadImage(image.url)}>
                <span className="material-symbols-outlined">download</span> {/* Download icon */}
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
          width: 80px; /* Adjust the size of the GIF */
          height: 80px;
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
