export type ItemStatus = "lost" | "found" | "pending" | "resolved";

export type ItemCategory =
  | "electronics"
  | "clothing"
  | "accessories"
  | "books"
  | "sports"
  | "other";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  status: ItemStatus;
  type: "lost" | "found";
  reportedBy: string;
  claimedBy?: string;
  claimProof?: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  itemId: string;
  claimerName: string;
  claimerEmail: string;
  proofOfOwnership: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
