import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { toast } from 'sonner';

export default function StoreUploadForm(): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lookym-stores');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        images,
      };

      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully');
      router.push('/store/products');
      router.refresh();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" required>
          <option value="">Select a category</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Product Images</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('images')?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Icons.upload className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Icons.trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading || images.length === 0}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Product'
        )}
      </Button>
    </form>
  );
}
