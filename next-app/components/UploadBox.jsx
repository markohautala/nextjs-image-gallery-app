"use client";

import { useState } from "react";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files; // Hämtar filerna från input
    if (!files || files.length === 0) return;

    setLoading(true);

    try {
      const formData = new FormData();
      // Lägg till varje fil i FormData
      for (const file of files) {
        formData.append("file", file); // Lägg till filen
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Skicka FormData som request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bild uppladdad:", data.url);

        // Omdirigera användaren till galleriet
        window.location.href = "/gallery";
      } else {
        console.error("Uppladdningen misslyckades");
      }
    } catch (error) {
      console.error("Fel vid uppladdning:", error);
    } finally {
      setLoading(false);
    }
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
