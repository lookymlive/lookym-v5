"use client";
import { FC, useState } from "react";
import { Icons } from "@/components/ui/icons";

interface Category {
  name: string;
  icon: keyof typeof Icons;
  count: number;
}

const categories: Category[] = [
  { name: "Clothing", icon: "shirt", count: 1234 },
  { name: "Shoes", icon: "bag", count: 856 },
  { name: "Watches", icon: "watch", count: 432 },
  { name: "Accessories", icon: "star", count: 765 },
  { name: "Electronics", icon: "smartphone", count: 543 },
  { name: "Home", icon: "home", count: 987 },
];

const CategoryFilter: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Browse Categories</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => {
          const Icon = Icons[category.icon];
          return (
            <button
              key={category.name}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {category.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
