"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";
import type { Item, Claim } from "./types";

// Sample data for demonstration - all items are "lost" type (reported by students who lost items)
const sampleItems: Item[] = [
  {
    id: "1",
    name: "Blue Backpack",
    category: "accessories",
    description: "Navy blue JanSport backpack with laptop compartment and a small tear on the side pocket",
    location: "Library - 2nd Floor",
    date: "2026-03-05",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "Alex Thompson",
    createdAt: "2026-03-05T10:30:00Z",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    category: "electronics",
    description: "Space gray iPhone 15 Pro with blue silicone case, has a small crack on the corner",
    location: "Cafeteria",
    date: "2026-03-06",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "John Smith",
    createdAt: "2026-03-06T12:00:00Z",
  },
  {
    id: "3",
    name: "Science Notebook",
    category: "books",
    description: "Green spiral notebook with AP Chemistry notes, name written inside cover",
    location: "Room 204",
    date: "2026-03-04",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "Sarah Miller",
    createdAt: "2026-03-04T14:15:00Z",
  },
  {
    id: "4",
    name: "Varsity Jacket",
    category: "clothing",
    description: "Blue and gold Alliance Academy varsity jacket, size L, number 12 on back",
    location: "Gymnasium",
    date: "2026-03-07",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "Marcus Williams",
    createdAt: "2026-03-07T09:00:00Z",
  },
  {
    id: "5",
    name: "AirPods Pro",
    category: "electronics",
    description: "White AirPods Pro in charging case with small scratch on lid",
    location: "Music Room",
    date: "2026-03-03",
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop",
    status: "resolved",
    type: "lost",
    reportedBy: "Emily Chen",
    createdAt: "2026-03-03T11:45:00Z",
  },
  {
    id: "6",
    name: "TI-84 Calculator",
    category: "electronics",
    description: "Texas Instruments TI-84 Plus CE graphing calculator, has stickers on back",
    location: "Math Building - Room 108",
    date: "2026-03-06",
    imageUrl: "https://images.unsplash.com/photo-1564473185935-5c4ee5c2d2df?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "David Park",
    createdAt: "2026-03-06T16:30:00Z",
  },
  {
    id: "7",
    name: "Water Bottle",
    category: "accessories",
    description: "Hydro Flask 32oz bottle, dark blue with Alliance Academy sticker",
    location: "Soccer Field",
    date: "2026-03-07",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "Jessica Lee",
    createdAt: "2026-03-07T15:00:00Z",
  },
  {
    id: "8",
    name: "House Keys",
    category: "accessories",
    description: "Set of 3 keys on a blue lanyard with car fob",
    location: "Parking Lot B",
    date: "2026-03-08",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop",
    status: "lost",
    type: "lost",
    reportedBy: "Ryan Cooper",
    createdAt: "2026-03-08T08:30:00Z",
  },
];

const sampleClaims: Claim[] = [];

interface StoreState {
  items: Item[];
  claims: Claim[];
  isAdmin: boolean;
  
  // Item actions
  addItem: (item: Omit<Item, "id" | "createdAt">) => void;
  updateItemStatus: (id: string, status: Item["status"]) => void;
  
  // Claim actions
  addClaim: (claim: Omit<Claim, "id" | "createdAt" | "status">) => void;
  updateClaimStatus: (id: string, status: Claim["status"]) => void;
  
  // Auth actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: sampleItems,
      claims: sampleClaims,
      isAdmin: false,
      
      addItem: (itemData) => {
        const newItem: Item = {
          ...itemData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },
      
      updateItemStatus: (id, status) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }));
      },
      
      addClaim: (claimData) => {
        const newClaim: Claim = {
          ...claimData,
          id: crypto.randomUUID(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ claims: [...state.claims, newClaim] }));
        // Note: Item stays visible until claim is approved by admin
      },
      
      updateClaimStatus: (id, status) => {
        const claim = get().claims.find((c) => c.id === id);
        
        // Update both claim and item status atomically
        set((state) => {
          const updatedClaims = state.claims.map((c) =>
            c.id === id ? { ...c, status } : c
          );
          
          // If approved, also mark the item as resolved
          let updatedItems = state.items;
          if (claim && status === "approved") {
            updatedItems = state.items.map((item) =>
              item.id === claim.itemId ? { ...item, status: "resolved" } : item
            );
          }
          
          return {
            claims: updatedClaims,
            items: updatedItems,
          };
        });
      },
      
      login: (username, password) => {
        if (username === "Admin" && password === "12345678") {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAdmin: false });
      },
    }),
    {
      name: "lost-found-storage",
      // Only persist claims and items, not admin status
      partialize: (state) => ({ 
        items: state.items, 
        claims: state.claims 
      }),
    }
  )
);

// Hook to handle hydration - prevents hydration mismatch
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
