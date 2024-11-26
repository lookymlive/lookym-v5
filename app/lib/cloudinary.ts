import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_API_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

type UploadResponse = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  [key: string]: any;
};

export const uploadMedia = async (file: File): Promise<UploadResponse> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine resource type and folder based on file type
    const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
    const folder = resourceType === 'image' ? 'lookym-stores/images' : 'lookym-stores/videos';

    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: folder,
            // Optimized settings based on resource type
            ...(resourceType === 'image' ? {
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto:best' },
                { fetch_format: 'auto' },
                { flags: 'progressive' }
              ]
            } : {
              resource_type: 'video',
              chunk_size: 6000000,
              eager: [
                { 
                  format: 'mp4',
                  quality: 'auto',
                  video_codec: 'auto'
                }
              ],
              eager_async: true
            })
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadResponse);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Legacy support for direct image upload from URL/path
export const uploadImage = async (file: string): Promise<UploadResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'lookym-stores/images',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
        { flags: 'progressive' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default cloudinary;