import { auth } from "@/auth"
import { Button } from "@/components/atoms/Button"
import { Icons } from "@/components/ui/icons"
import CategoryFilter from "@/app/components/CategoryFilter"
import VideoGrid from "@/app/components/VideoGrid"
import FeaturedStores from "@/app/components/FeaturedStores"
import TrendingProducts from "@/app/components/TrendingProducts"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Amazing Store Displays
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explore unique store displays and products from top retailers around the world.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="inline-flex items-center" asChild>
                  <Link href={session ? "/dashboard" : "/login"}>
                    Get Started
                    <Icons.arrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!session && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/register?type=store">
                      Register Store
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto aspect-video w-full max-w-[600px] overflow-hidden rounded-xl">
              <video
                className="object-cover w-full h-full"
                autoPlay
                muted
                loop
                playsInline
                src="https://res.cloudinary.com/dhnkojapo/video/upload/v1730321490/samples/cld-sample-video.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse Categories</h2>
          <CategoryFilter />
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured Stores</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <FeaturedStores />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <TrendingProducts />
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Latest Displays</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <VideoGrid session={session} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                Stay Updated
              </h2>
              <p className="text-primary-foreground/90">
                Get the latest updates on new stores and trending displays.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" variant="secondary">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}