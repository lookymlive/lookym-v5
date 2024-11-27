import { v2 as cloudinary, UploadApiResponse as V2UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Add this type mapping to ensure compatibility
type CloudinaryUploadApiResponse = V2UploadApiResponse & {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET,
});

// Enhanced TypeScript types for better type safety
export interface CloudinaryResource {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'auto' | 'raw';
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
  created_at: string;
}

export interface CloudinaryUploadOptions extends UploadApiOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'auto' | 'raw';
  transformation?: Array<Record<string, any>>;
  eager?: Array<Record<string, any>>;
  eager_async?: boolean;
  chunk_size?: number;
}

// Extend the Cloudinary uploader type to include upload_stream method
declare module 'cloudinary' {
  namespace v2 {
    interface Uploader {
      upload_stream(
        options: UploadApiOptions, 
        callback: (error: any, result?: V2UploadApiResponse) => void
      ): NodeJS.WritableStream;
    }
  }
}

// Default optimization settings for different media types
const OPTIMIZATION_SETTINGS = {
  image: {
    transformation: [
      { quality: 'auto:best', fetch_format: 'auto' },
      ...(true ? [{ flags: 'preserve_transparency' }] : []),
    ],
  },
  video: {
    transformation: [
      { quality: 'auto:best', fetch_format: 'auto' },
      { audio_codec: 'aac', video_codec: 'h264' },
    ],
    eager_async: true,
    chunk_size: 6000000, // 6MB chunks for better upload handling
  },
};

const BASE_FOLDERS = {
  image: 'lookym/images',
  video: 'lookym/videos',
  raw: 'lookym/raw',
};

/**
 * Enhanced media upload function that handles both image and video uploads
 * with automatic type detection and optimized settings
 */
export const uploadMedia = async (
  file: File | string,
  customOptions: Partial<CloudinaryUploadOptions> = {}
): Promise<CloudinaryResource> => {
  try {
    const isFileObject = file instanceof File;
    
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto';
    if (isFileObject) {
      const mimeType = (file as File).type;
      if (mimeType.startsWith('image/')) resourceType = 'image';
      else if (mimeType.startsWith('video/')) resourceType = 'video';
    } else {
      const fileName = file as string;
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) resourceType = 'image';
      else if (/\.(mp4|avi|mov|mkv|webm)$/i.test(fileName)) resourceType = 'video';
    }

    const options: CloudinaryUploadOptions = {
      folder: resourceType === 'auto' ? BASE_FOLDERS.image : BASE_FOLDERS[resourceType],
      resourceType: resourceType === 'auto' ? 'image' : resourceType,
      ...(resourceType === 'auto' ? OPTIMIZATION_SETTINGS.image : OPTIMIZATION_SETTINGS[resourceType] || OPTIMIZATION_SETTINGS.image),
      ...customOptions
    };

    function mapCloudinaryResponse(response: CloudinaryUploadApiResponse): CloudinaryResource {
      return {
        secure_url: response.secure_url,
        public_id: response.public_id,
        resource_type: response.resource_type as 'image' | 'video' | 'auto' | 'raw',
        format: response.format || '',
        width: response.width,
        height: response.height,
        duration: response.duration,
        bytes: response.bytes,
        created_at: response.created_at
      };
    }

    if (isFileObject) {
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return await new Promise<CloudinaryResource>((resolve, reject) => {
        // Use type assertion to bypass TypeScript type checking
        (cloudinary.uploader as any).upload_stream(
          options, 
          (error: any, result?: CloudinaryUploadApiResponse) => {
            if (error) reject(error);
            else if (result) resolve(mapCloudinaryResponse(result));
            else reject(new Error('No upload result'));
          }
        ).end(buffer);
      });
    } else {
      const result = await cloudinary.uploader.upload(file as string, options);
      return mapCloudinaryResponse(result as CloudinaryUploadApiResponse);
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Utility function to generate a Cloudinary URL with transformations
export const generateUrl = (publicId: string, options: Record<string, any> = {}) => {
  return cloudinary.url(publicId, options);
};

// Export the configured cloudinary instance for direct access if needed
export { cloudinary };