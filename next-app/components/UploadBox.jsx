"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false); // Track if files are being dragged
  const router = useRouter(); // Initialize the router

  const handleUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files; // Get files from input or dropped files
    if (!files || files.length === 0) return;

    setLoading(true);

    // Show "Uploading..." for 2 seconds before starting the actual upload
    setTimeout(async () => {
      try {
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

          // Redirect to gallery and include a query parameter to refresh
          router.push("/gallery?refresh=true");
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        setLoading(false); // Hide loading state after the upload process
      }
    }, 4000); // 4000ms = 4 seconds delay before starting the upload
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
          border: dragging ? "2px solid #4CAF50" : "2px dashed gray",
          padding: "20px",
          borderRadius: "8px",
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
            ? "Drag and drop the files here"
            : loading
            ? "Uploading..."
            : "Drag and drop images here, or click to upload"}
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
