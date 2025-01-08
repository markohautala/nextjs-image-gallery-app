import cloudinary from '../../utils/cloudinary';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { resources } = await cloudinary.search
        .expression('folder:gallery')
        .sort_by('created_at', 'desc')
        .execute();

      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  }
}
