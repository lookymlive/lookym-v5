// Define a list of placeholder images from a reliable source
export const productImages = {
  boots: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80',
  jacket: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80',
  dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
  handbag: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80',
} as const;

// Function to get image URL
export function getProductImage(name: keyof typeof productImages): string {
  return productImages[name];
}

// Function to get all product images
export function getAllProductImages(): typeof productImages {
  return productImages;
}
