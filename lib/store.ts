"use client";

import { create } from "zustand";
import type { Item, Claim } from "./types";

// Sample data for demonstration
const sampleItems: Item[] = [
  {
    id: "1",
    name: "Blue Backpack",
    category: "accessories",
    description: "Navy blue JanSport backpack with laptop compartment",
    location: "Library - 2nd Floor",
    date: "2026-03-05",
    status: "found",
    type: "found",
    reportedBy: "Mrs. Johnson",
    createdAt: "2026-03-05T10:30:00Z",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    category: "electronics",
    description: "Space gray iPhone 15 Pro with blue case",
    location: "Cafeteria",
    date: "2026-03-06",
    status: "lost",
    type: "lost",
    reportedBy: "John Smith",
    createdAt: "2026-03-06T12:00:00Z",
  },
  {
    id: "3",
    name: "Science Textbook",
    category: "books",
    description: "AP Biology textbook, 5th edition",
    location: "Room 204",
    date: "2026-03-04",
    status: "pending",
    type: "found",
    reportedBy: "Mr. Davis",
    createdAt: "2026-03-04T14:15:00Z",
  },
  {
    id: "4",
    name: "Varsity Jacket",
    category: "clothing",
    description: "Blue and gold varsity jacket, size L",
    location: "Gymnasium",
    date: "2026-03-07",
    status: "found",
    type: "found",
    reportedBy: "Coach Williams",
    createdAt: "2026-03-07T09:00:00Z",
  },
  {
    id: "5",
    name: "AirPods Pro",
    category: "electronics",
    description: "White AirPods Pro in charging case",
    location: "Music Room",
    date: "2026-03-03",
    status: "resolved",
    type: "lost",
    reportedBy: "Emily Chen",
    createdAt: "2026-03-03T11:45:00Z",
  },
  {
    id: "6",
    name: "Soccer Ball",
    category: "sports",
    description: "Adidas match ball, slightly worn",
    location: "Soccer Field",
    date: "2026-03-06",
    status: "found",
    type: "found",
    reportedBy: "Sports Office",
    createdAt: "2026-03-06T16:30:00Z",
  },
];

const sampleClaims: Claim[] = [
  {
    id: "c1",
    itemId: "3",
    claimerName: "Sarah Miller",
    claimerEmail: "sarah.miller@school.edu",
    proofOfOwnership: "My name is written inside the front cover in blue ink",
    status: "pending",
    createdAt: "2026-03-05T08:00:00Z",
  },
  {
    id: "c2",
    itemId: "1",
    claimerName: "Mike Thompson",
    claimerEmail: "mike.t@school.edu",
    proofOfOwnership: "The backpack has a keychain with my initials MT attached to the zipper",
    status: "pending",
    createdAt: "2026-03-06T09:30:00Z",
  },
];

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

export const useStore = create<StoreState>((set, get) => ({
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
    // Update item status to pending
    get().updateItemStatus(claimData.itemId, "pending");
  },
  
  updateClaimStatus: (id, status) => {
    set((state) => {
      const claim = state.claims.find((c) => c.id === id);
      if (claim && status === "approved") {
        // Mark item as resolved when claim is approved
        get().updateItemStatus(claim.itemId, "resolved");
      }
      return {
        claims: state.claims.map((c) =>
          c.id === id ? { ...c, status } : c
        ),
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
}));
