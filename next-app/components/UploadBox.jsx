"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * UploadBox Component:
 * A file upload component that supports drag-and-drop and file input to upload multiple images.
 * Displays upload progress for each file, and handles errors, loading, and post-upload redirects.
 */
export default function UploadBox() {
  // State variables
  const [loading, setLoading] = useState(false); // Tracks if the upload process is loading
  const [dragging, setDragging] = useState(false); // Tracks if the user is dragging files over the box
  const [error, setError] = useState(""); // Stores any error messages
  const [uploadProgress, setUploadProgress] = useState([]); // Tracks the progress of each file upload
  const [uploadsComplete, setUploadsComplete] = useState(false); // Flag to indicate if all uploads are complete
  const router = useRouter(); // Router hook for navigating after uploads
  const fileInputRef = useRef(null); // Reference to the hidden file input element

  /**
   * Handles the file upload process.
   * - Validates file selection and starts the upload process.
   * - Tracks progress for each file.
   * - Handles success and failure scenarios for each file upload.
   * - Redirects to the gallery page upon successful upload.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    // Restricting file upload to 5 files maximum
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images at once.");
      return;
    }

    setError("");
    setLoading(true);
    setUploadProgress([]);
    setUploadsComplete(false);

    try {
      const fileList = Array.from(files);
      const initialProgress = fileList.map(() => ({ status: "Uploading...", progress: 0 }));
      setUploadProgress(initialProgress);

      /**
       * Uploads a single file and tracks its progress.
       * @param {File} file - The file to be uploaded
       * @param {number} index - The index of the file in the file list
       */
      const uploadFile = async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = [...prev];
              if (progress < 95) {
                progress += Math.random() * 10; // Simulating upload progress
                newProgress[index] = { status: "Uploading...", progress: Math.min(95, progress) };
              }
              return newProgress;
            });
          }, 300);

          // Sending the file to the server
          fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Upload failed");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Image uploaded:", data.url);
              clearInterval(interval);
              setUploadProgress((prev) => {
                const newProgress = [...prev];
                newProgress[index] = { status: "Uploaded", progress: 100 };
                return newProgress;
              });
              resolve();
            })
            .catch((error) => {
              console.error("Error during upload:", error);
              clearInterval(interval);
              setUploadProgress((prev) => {
                const newProgress = [...prev];
                newProgress[index] = { status: "Failed", progress: 0 };
                return newProgress;
              });
              resolve();
            });
        });
      };

      // Upload all selected files in parallel
      await Promise.all(fileList.map((file, index) => uploadFile(file, index)));
      setUploadsComplete(true);

      // Redirect to the gallery page after a short delay
      setTimeout(() => {
        router.push("/gallery");
      }, 3000);
    } catch (error) {
      console.error("Error during upload:", error);
      setError("An error occurred during the upload.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the drag-over event, setting the dragging state to true.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  /**
   * Handles the drag-leave event, setting the dragging state to false.
   */
  const handleDragLeave = () => {
    setDragging(false);
  };

  /**
   * Handles the drop event, initiating the file upload process.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e);
  };

  /**
   * Opens the file input dialog when the upload box is clicked.
   */
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        width: "100vw",
        paddingTop: "20vh",
      }}
    >
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        style={{
          width: "75vw",
          border: dragging ? "3px solid #7CACF8" : "3px dashed gray",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {loading || uploadsComplete ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="loading-spinner">
              <img
                src="/images/spinner.gif"
                alt="Loading..."
                className="spinner-gif"
                style={{ width: "45px", height: "45px", marginBottom: "10px" }}
              />
            </div>
            {uploadProgress.length > 0 && (
              <div style={{ width: "100%", textAlign: "center" }}>
                {uploadProgress.map((progress, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <p>{`File ${index + 1}: ${progress.status}`}</p>
                    <progress value={progress.progress} max="100" style={{ width: "100%" }}></progress>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#7CACF8" }}>
              cloud_upload
            </span>
            <p>
              {dragging
                ? "Drag and drop the files here - maximum 5 images at a time"
                : error
                ? error
                : "Drag and drop your images here, or click to upload - maximum 5 images at a time"}
            </p>
          </>
        )}
        <input type="file" multiple onChange={handleUpload} ref={fileInputRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
