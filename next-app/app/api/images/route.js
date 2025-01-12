import cloudinary from "../../../utils/cloudinary";

export async function GET() {
  try {
    // Hämta bilder från Cloudinary
    const { resources } = await cloudinary.search
      .expression("folder:nextjs-gallery") // Sök efter bilder i mappen "nextjs-gallery"
      .sort_by("created_at", "desc") // Sortera nyaste först
      .max_results(20) // Begränsa antal bilder (ändra vid behov)
      .execute();

    // Formatera resultaten
    const images = resources.map((image) => ({
      id: image.asset_id,
      url: image.secure_url,
    }));

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fel vid hämtning av bilder:", error);
    return new Response(
      JSON.stringify({ error: "Kunde inte hämta bilder" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
