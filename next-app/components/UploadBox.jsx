"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false); // Track if files are being dragged
  const [error, setError] = useState(""); // Track upload errors
  const router = useRouter(); // Initialize the router

  const handleUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files; // Get files from input or dropped files
    if (!files || files.length === 0) return;

    // Check if the number of files exceeds the limit
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images at once.");
      return;
    }

    setError(""); // Reset error if files are valid
    setLoading(true); // Show loading status immediately

    try {
      // Make the API call immediately
      const formData = new FormData();
      // Add each file to FormData
      for (const file of files) {
        formData.append("file", file);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Send FormData as request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded:", data.url);

        // Wait for 5 seconds to allow time for the upload to Cloudinary
        setTimeout(() => {
          // After 5 seconds, redirect to the gallery
          router.push("/gallery?refresh=true");
        }, 5000); // 5000ms = 5 seconds delay
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error during upload:", error);
    }

    // The "Uploading..." status will be shown for 5 seconds before redirecting
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow drop
    setDragging(true); // Set dragging state to true when hovering over
  };

  const handleDragLeave = () => {
    setDragging(false); // Reset dragging state when leaving the area
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false); // Reset dragging state after drop
    handleUpload(e); // Handle the file drop
  };

  const handleClick = () => {
    document.getElementById("file-upload").click(); // Trigger the file input click programmatically
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
        {/* Upload Icon */}
        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#7CACF8" }}>
          cloud_upload
        </span>

        <p>
          {dragging
            ? "Drag and drop the files here - maximum 5 images at a time"
            : loading
            ? "Uploading..." // Show "Uploading..." immediately after the API call
            : error
            ? error
            : "Drag and drop images here, or click to upload - maximum 5 images at a time"}
        </p>

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
