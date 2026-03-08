"use client";

import { useState } from "react";
import { Search, Package, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "./item-card";
import { useStore, useHydration } from "@/lib/store";
import type { ItemCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categoryOptions: { value: ItemCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "books", label: "Books" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];

export function Dashboard() {
  const hydrated = useHydration();
  const { items } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">("all");

  // Show loading state until hydrated to prevent mismatch
  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lost & Found Dashboard
          </h1>
          <p className="text-muted-foreground">
            Browse reported items and submit claims for your belongings
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-6 w-8 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-10 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 h-48 animate-pulse">
              <div className="h-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Only show lost items that haven't been resolved
  const lostItems = items.filter((item) => item.type === "lost" && item.status !== "resolved");
  
  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: lostItems.length,
    electronics: lostItems.filter((i) => i.category === "electronics").length,
    clothing: lostItems.filter((i) => i.category === "clothing").length,
    books: lostItems.filter((i) => i.category === "books").length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Lost Items
        </h1>
        <p className="text-muted-foreground">
          Browse items that have been reported lost. If you found one of these items, submit a claim to help return it to its owner.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Lost Items</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.electronics}</p>
              <p className="text-sm text-muted-foreground">Electronics</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.clothing}</p>
              <p className="text-sm text-muted-foreground">Clothing</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.books}</p>
              <p className="text-sm text-muted-foreground">Books</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items by name, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categoryOptions.map((option) => {
            const isActive = categoryFilter === option.value;
            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(option.value)}
                className={cn(
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <Badge variant="secondary" className="text-sm">
          {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
        </Badge>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No items found
          </h3>
          <p className="text-muted-foreground max-w-md">
            {search
              ? "Try adjusting your search terms or filters"
              : "No items have been reported yet. Be the first to report a lost or found item!"}
          </p>
        </div>
      )}
    </div>
  );
}
