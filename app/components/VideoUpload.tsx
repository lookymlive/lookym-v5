'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import axios from 'axios';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
}

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ progress: 0, status: 'idle' });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      // Set the file in the form
      const videoInput = document.getElementById('video') as HTMLInputElement;
      if (videoInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        videoInput.files = dataTransfer.files;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      setUploadProgress({ progress: 0, status: 'uploading' });
      
      const formData = new FormData(e.currentTarget);
      
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress({ progress, status: 'uploading' });
          }
        },
      });

      if (!response.data) {
        throw new Error('Upload failed');
      }

      setUploadProgress({ progress: 100, status: 'completed' });
      toast.success("Video uploaded successfully!");
      router.refresh();

      // Reset form and preview
      (e.target as HTMLFormElement).reset();
      setVideoPreview(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress({ progress: 0, status: 'error' });
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Video Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div {...getRootProps()} className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${isDragActive ? 'border-indigo-500 bg-indigo-50' : ''}`}>
          <div className="text-center">
            <input {...getInputProps()} id="video" name="video" className="sr-only" />
            {videoPreview ? (
              <div className="mt-4">
                <video
                  src={videoPreview}
                  controls
                  className="mx-auto max-h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <span className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                    Upload a video
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">MP4, WebM or OGG up to 100MB</p>
              </div>
            )}
          </div>
        </div>

        {uploadProgress.status !== 'idle' && (
          <div className="mt-4">
            <Progress value={uploadProgress.progress} className="w-full" />
            <p className="mt-2 text-sm text-gray-600 text-center">
              {uploadProgress.status === 'uploading' && `Uploading... ${uploadProgress.progress}%`}
              {uploadProgress.status === 'completed' && 'Upload completed!'}
              {uploadProgress.status === 'error' && 'Upload failed'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}
