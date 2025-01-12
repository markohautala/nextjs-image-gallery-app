import cloudinary from '../../../utils/cloudinary';

export async function GET(req) {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:nextjs-gallery') // Replace with your folder
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    const images = resources.map((resource) => ({
      url: resource.secure_url,
      id: resource.asset_id,
    }));

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch images' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
