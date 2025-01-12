"use client"; // Add this at the top

import { useState } from "react";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Uploaded image URL:", data.url);
        // Redirect or reload to gallery
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "2px dashed gray", padding: "20px", borderRadius: "8px" }}>
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
