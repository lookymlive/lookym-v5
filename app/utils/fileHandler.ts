import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloud from "@/app/lib/cloud";

export const uploadFileToCloud = async (
  file: File,
  options?: UploadApiOptions
): Promise<UploadApiResponse | undefined> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const stream = cloud.uploader.upload_stream(
        options || {},
        (error, result) => {
          if (error) {
            reject(new Error(`File upload failed: ${error.message}`));
          } else {
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Error converting file to buffer:", error);
    throw new Error("Failed to prepare file for upload");
  }
};
