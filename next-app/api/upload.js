import cloudinary from '../../utils/cloudinary';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'gallery',
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
}
