import mongoose, { Schema, Document } from "mongoose";

interface IVideo extends Document {
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  userId: mongoose.Types.ObjectId;
  views: number;
  likes: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VideoModel = mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema);

export default VideoModel;