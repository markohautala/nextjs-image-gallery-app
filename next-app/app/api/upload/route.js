import cloudinary from "../../../utils/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Hämtar filen från FormData

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Ingen fil bifogad" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Konvertera File till buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ladda upp buffer till Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: "nextjs-gallery" }, // Ange mappnamn
      (error, result) => {
        if (error) {
          console.error("Cloudinary-fel:", error);
          throw new Error("Uppladdningen till Cloudinary misslyckades");
        }
        return result;
      }
    );

    // Skapa en läsbar stream från buffern och skicka till Cloudinary
    const { Readable } = require("stream");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signalera slut på stream
    readableStream.pipe(uploadResponse);

    return new Response(
      JSON.stringify({ url: uploadResponse.secure_url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Fel vid uppladdning:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
