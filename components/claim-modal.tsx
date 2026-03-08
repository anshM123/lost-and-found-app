"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Item } from "@/lib/types";

interface ClaimModalProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimModal({ item, open, onOpenChange }: ClaimModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [proof, setProof] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addClaim } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !proof) return;

    addClaim({
      itemId: item.id,
      claimerName: name,
      claimerEmail: email,
      proofOfOwnership: proof,
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after modal closes
    setTimeout(() => {
      setName("");
      setEmail("");
      setProof("");
      setSubmitted(false);
    }, 200);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Claim Submitted!</h3>
              <p className="text-muted-foreground text-sm">
                Your claim for &quot;{item.name}&quot; has been submitted. An
                administrator will review your proof of ownership and contact
                you at {email}.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Item</DialogTitle>
          <DialogDescription>
            Please provide proof of ownership for &quot;{item.name}&quot;. This
            helps us verify that you are the rightful owner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">School Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof">Proof of Ownership</Label>
            <Textarea
              id="proof"
              placeholder="Describe unique identifying features only the owner would know (e.g., scratches, stickers, contents, custom modifications...)"
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific! Include details that only the owner would know.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !email || !proof}>
              Submit Claim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
