import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_API_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'lookym-stores',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default cloudinary;
