import cloudinary from "../../../utils/cloudinary";

// This function handles an HTTP GET request to fetch images from Cloudinary
export async function GET() {
  try {
    // Fetch images from Cloudinary
    const { resources } = await cloudinary.search
      .expression("folder:nextjs-gallery") // Search for images in the "nextjs-gallery" folder
      .sort_by("created_at", "desc") // Sort the results by creation date, newest first
      .max_results(200) // Limit the number of results to 200 (can be adjusted)
      .execute();

    // Format the image data to only include the ID and secure URL
    const images = resources.map((image) => ({
      id: image.asset_id, // Unique ID of the image
      url: image.secure_url, // Secure URL of the image
    }));

    // Return the formatted data as a JSON response with status 200
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error while fetching images:", error);

    // Return an error response if fetching images fails
    return new Response(
      JSON.stringify({ error: "Failed to fetch images" }),
      {
        status: 500, // HTTP status code for server error
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}