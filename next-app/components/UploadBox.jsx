"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleUpload = async (e) => {
    const files = e.target.files; // Get files from input
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
    }, 4000); // 2000ms = 2 seconds delay before starting the upload
  };

  return (
    <div
      style={{
        border: "2px dashed gray",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <p>Drag and drop images here, or click to upload</p>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        {loading ? "Uploading..." : "Click to select files"}
      </label>
    </div>
  );
}
