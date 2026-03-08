"use client";

import { useState } from "react";
import { Search, Package, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "./item-card";
import { useStore, useHydration } from "@/lib/store";
import type { ItemStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const filterOptions: { value: ItemStatus | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All Items", icon: Package },
  { value: "lost", label: "Lost", icon: AlertCircle },
  { value: "found", label: "Found", icon: CheckCircle2 },
  { value: "pending", label: "Pending", icon: Clock },
];

export function Dashboard() {
  const hydrated = useHydration();
  const { items } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ItemStatus | "all">("all");

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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    lost: items.filter((i) => i.status === "lost").length,
    found: items.filter((i) => i.status === "found").length,
    resolved: items.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Lost & Found Dashboard
        </h1>
        <p className="text-muted-foreground">
          Browse reported items and submit claims for your belongings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.lost}</p>
              <p className="text-sm text-muted-foreground">Lost Items</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.found}</p>
              <p className="text-sm text-muted-foreground">Found Items</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
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
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = filter === option.value;
            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
                className={cn(
                  "gap-2",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
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
