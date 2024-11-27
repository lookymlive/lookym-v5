import { uploadMedia } from '@/app/lib/cloudinary';
import type { CloudinaryUploadOptions, CloudinaryResource } from '@/app/lib/cloudinary';

export const uploadFileToCloud = async (
  file: File,
  options?: Partial<CloudinaryUploadOptions>
): Promise<CloudinaryResource> => {
  return uploadMedia(file, options);
};