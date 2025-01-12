import cloudinary from '../../../utils/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file'); // Get the uploaded file

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'nextjs-gallery', // Optional folder name
    });

    return new Response(JSON.stringify({ url: uploadResponse.secure_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload image' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
