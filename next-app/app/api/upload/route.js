import cloudinary from "../../../utils/cloudinary";
import { Readable } from "stream";

// This function handles an HTTP POST request to upload a file to Cloudinary
export async function POST(req) {
  try {
    // Extract the form data from the request
    const formData = await req.formData();
    const file = formData.get("file"); // Get the file from the form data

    // If no file is provided, return a 400 (Bad Request) response
    if (!file) {
      return new Response(JSON.stringify({ error: "No file attached" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert the file into a buffer
    const arrayBuffer = await file.arrayBuffer(); // Read the file data as an ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convert the ArrayBuffer to a Node.js buffer

    // Function to upload the file to Cloudinary using a stream
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        // Create a Cloudinary upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "nextjs-gallery" }, // Save the file in the "nextjs-gallery" folder
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              reject(new Error("Upload to Cloudinary failed"));
            } else {
              resolve(result); // Resolve the promise with the upload result
            }
          }
        );

        // Create a readable stream from the buffer and pipe it to the upload stream
        const readableStream = new Readable();
        readableStream.push(buffer); // Push the file data to the stream
        readableStream.push(null); // End the stream
        readableStream.pipe(uploadStream); // Pipe the readable stream to the upload stream
      });
    };

    // Upload the file and get the response from Cloudinary
    const uploadResponse = await uploadToCloudinary();

    // Return the uploaded file's URL in the response
    return new Response(JSON.stringify({ url: uploadResponse.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log any errors and return a 500 (Server Error) response
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
