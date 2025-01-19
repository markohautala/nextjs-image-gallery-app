"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]); // Track progress for each file
  const [uploadsComplete, setUploadsComplete] = useState(false); // Tracks if uploads are done
  const router = useRouter();

  const handleUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    // Check if the number of files exceeds the limit
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images at once.");
      return;
    }

    setError(""); // Reset error if files are valid
    setLoading(true);
    setUploadProgress([]); // Clear previous progress
    setUploadsComplete(false); // Reset uploads complete state

    try {
      // Convert FileList to Array
      const fileList = Array.from(files);

      // Initialize the progress state for each file
      const initialProgress = fileList.map(() => ({ status: "Uploading...", progress: 0 }));
      setUploadProgress(initialProgress);

      // Function to upload a single file and track progress
      const uploadFile = async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          console.log("Image uploaded:", data.url);

          // Update progress for the uploaded file
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = { status: "Uploaded", progress: 100 };
            return newProgress;
          });
        } catch (error) {
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = { status: "Failed", progress: 0 };
            return newProgress;
          });
          console.error("Error during upload:", error);
        }
      };

      // Upload each file in parallel
      const uploadPromises = fileList.map((file, index) => uploadFile(file, index));

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Mark uploads as complete
      setUploadsComplete(true);

      // Delay redirect to gallery page to let user view progress bars
      setTimeout(() => {
        router.push("/gallery?refresh=true");
      }, 5000); // Add delay to allow for completion

    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setLoading(false); // Stop loading when all uploads are complete
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e);
  };

  const handleClick = () => {
    document.getElementById("file-upload").click();
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
        {/* Show loading spinner and progress bars during upload */}
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

            {/* Display upload progress for each file */}
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
            {/* Upload Icon */}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "48px", color: "#7CACF8" }}
            >
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

        <input
          type="file"
          multiple
          onChange={handleUpload}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ display: "none" }}>
          {loading ? "Uploading..." : "Click to select files"}
        </label>
      </div>
    </div>
  );
}
