import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadToCloudinary = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine the resource type based on file mime type
    const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
    const folder = resourceType === 'image' ? 'images' : 'videos';

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: folder,
            // Add optimization settings for both types
            ...(resourceType === 'image' ? {
              quality: 'auto:best',
              fetch_format: 'auto',
              flags: 'progressive',
            } : {
              resource_type: 'video',
              chunk_size: 6000000, // Optimized chunk size for videos
              eager: [
                { quality: 'auto', format: 'mp4' }
              ],
            }),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};