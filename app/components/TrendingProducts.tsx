import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button"
import { Icons } from "@/components/ui/icons"
import { productImages } from "@/app/utils/productImages"

const products = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    image: productImages.dress,
    price: 89.99,
    store: "Fashion Hub",
    likes: 1234,
  },
  {
    id: 2,
    name: "Classic Leather Boots",
    image: productImages.boots,
    price: 159.99,
    store: "Shoe Paradise",
    likes: 856,
  },
  {
    id: 3,
    name: "Designer Handbag",
    image: productImages.handbag,
    price: 299.99,
    store: "Accessory World",
    likes: 2345,
  },
  {
    id: 4,
    name: "Casual Denim Jacket",
    image: productImages.jacket,
    price: 129.99,
    store: "Style Studio",
    likes: 678,
  },
]

export default function TrendingProducts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader className="p-0">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.store className="mr-1 h-4 w-4" />
                  <span>{product.store}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icons.heart className="mr-1 h-4 w-4" />
                <span>{product.likes.toLocaleString()} likes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
