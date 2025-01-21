"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploadsComplete, setUploadsComplete] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

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

      const uploadFile = async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = [...prev];
              if (progress < 95) {
                progress += Math.random() * 10;
                newProgress[index] = { status: "Uploading...", progress: Math.min(95, progress) };
              }
              return newProgress;
            });
          }, 300);

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

      const uploadPromises = fileList.map((file, index) => uploadFile(file, index));
      await Promise.all(uploadPromises);
      setUploadsComplete(true);
      setTimeout(() => {
        router.push("/gallery");
      }, 3000);
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <input type="file" multiple onChange={handleUpload} style={{ display: "none" }} id="file-upload" />
      </div>
    </div>
  );
}
