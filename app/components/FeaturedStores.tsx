import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"

const stores = [
  {
    id: 1,
    name: "Fashion Hub",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FH",
    category: "Clothing",
    rating: 4.8,
    products: 128,
  },
  {
    id: 2,
    name: "Shoe Paradise",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=60",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SP",
    category: "Shoes",
    rating: 4.9,
    products: 256,
  },
  {
    id: 3,
    name: "Accessory World",
    image: "https://images.unsplash.com/photo-1513373319109-eb154073eb0b?w=800&auto=format&fit=crop&q=60",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AW",
    category: "Accessories",
    rating: 4.7,
    products: 512,
  },
  {
    id: 4,
    name: "Style Studio",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=60",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SS",
    category: "Clothing",
    rating: 4.6,
    products: 384,
  },
]

export default function FeaturedStores() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stores.map((store) => (
        <Link key={store.id} href={`/stores/${store.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={store.avatar} alt={store.name} />
                  <AvatarFallback>
                    {store.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {store.category}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Icons.star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>{store.rating}</span>
                </div>
                <div className="flex items-center">
                  <Icons.product className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{store.products} products</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
