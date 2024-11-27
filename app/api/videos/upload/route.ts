import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import VideoModel from "@/app/models/video";
import startDb from "@/app/lib/db";
import { uploadMedia, generateUrl } from "@/app/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!videoFile || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await startDb();

    // Upload video to Cloudinary with optimized settings
    const uploadResult = await uploadMedia(videoFile, {
      resourceType: 'video',
      folder: 'lookym/videos',
    });

    // Generate thumbnail URL using Cloudinary's URL transformation
    const thumbnailUrl = generateUrl(uploadResult.public_id, {
      resource_type: 'video',
      transformation: [
        { width: 300, height: 169, crop: 'fill' }, // 16:9 aspect ratio
        { format: 'jpg' },
        { start_offset: 'auto' } // Automatically select a good thumbnail moment
      ]
    });

    // Create video document
    const video = await VideoModel.create({
      title,
      description,
      url: uploadResult.secure_url,
      thumbnailUrl,
      userId: session.user.id,
      duration: uploadResult.duration,
    });

    return NextResponse.json(video);
  } catch (error: any) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};