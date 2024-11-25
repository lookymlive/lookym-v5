'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      router.refresh();
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">
            Video File
          </label>
          <input
            type="file"
            name="video"
            id="video"
            accept="video/*"
            required
            className="mt-1 block w-full"
          />
        </div>

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
