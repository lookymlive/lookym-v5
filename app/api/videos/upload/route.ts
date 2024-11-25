import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "store" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "store_videos",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Here you would typically save the video metadata to your database
    // Including the Cloudinary URL, title, description, and store owner info

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Error uploading video" },
      { status: 500 }
    );
  }
}
