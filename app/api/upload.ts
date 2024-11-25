import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import startDb from '@/app/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Initialize database connection
      await startDb();
      
      const file = req.body.file;
      if (!file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const uploadResult = await cloudinary.uploader.upload(file, {
        folder: 'lookym-v3',
        public_id: 'example-video',
        resource_type: 'video',
      });
      
      res.status(201).json(uploadResult);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: 'Error uploading file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;