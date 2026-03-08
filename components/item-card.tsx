"use client";

import { useState } from "react";
import { Package, MapPin, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClaimModal } from "./claim-modal";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: Item;
}

const categoryLabels: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  accessories: "Accessories",
  books: "Books",
  sports: "Sports",
  other: "Other",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  lost: {
    label: "Lost",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  found: {
    label: "Found",
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning-foreground border-warning/30",
  },
  resolved: {
    label: "Resolved",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function ItemCard({ item }: ItemCardProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const status = statusConfig[item.status];

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
        <CardHeader className="p-0">
          <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Package className="w-12 h-12" />
                <span className="text-xs">No Image</span>
              </div>
            )}
            <Badge
              variant="outline"
              className={cn(
                "absolute top-3 right-3 font-medium",
                status.className
              )}
            >
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">
              {item.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {item.type === "lost" ? "Lost" : "Found"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4 shrink-0" />
              <span>{categoryLabels[item.category]}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {item.status === "resolved" ? (
            <Button variant="secondary" className="w-full" disabled>
              Claimed
            </Button>
          ) : item.status === "pending" ? (
            <Button variant="secondary" className="w-full" disabled>
              Claim Pending
            </Button>
          ) : (
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowClaimModal(true)}
            >
              Claim Item
            </Button>
          )}
        </CardFooter>
      </Card>

      <ClaimModal
        item={item}
        open={showClaimModal}
        onOpenChange={setShowClaimModal}
      />
    </>
  );
}
