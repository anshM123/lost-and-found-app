"use client";

import { useState } from "react";
import {
  Shield,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  FileText,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { Claim } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { items, claims, updateClaimStatus, logout } = useStore();
  const [search, setSearch] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const pendingClaims = claims.filter((c) => c.status === "pending");
  const resolvedClaims = claims.filter((c) => c.status !== "pending");

  const filteredClaims = pendingClaims.filter((claim) => {
    const item = items.find((i) => i.id === claim.itemId);
    const searchLower = search.toLowerCase();
    return (
      claim.claimerName.toLowerCase().includes(searchLower) ||
      claim.claimerEmail.toLowerCase().includes(searchLower) ||
      (item && item.name.toLowerCase().includes(searchLower))
    );
  });

  const getItemForClaim = (claim: Claim) => {
    return items.find((i) => i.id === claim.itemId);
  };

  const handleAction = (claim: Claim, action: "approve" | "reject") => {
    setSelectedClaim(claim);
    setConfirmAction(action);
  };

  const confirmActionHandler = () => {
    if (!selectedClaim || !confirmAction) return;
    updateClaimStatus(selectedClaim.id, confirmAction === "approve" ? "approved" : "rejected");
    setSelectedClaim(null);
    setConfirmAction(null);
  };

  const stats = {
    pendingClaims: pendingClaims.length,
    totalItems: items.length,
    resolvedToday: claims.filter(
      (c) =>
        c.status !== "pending" &&
        new Date(c.createdAt).toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage pending claims and review item reports
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pendingClaims}</p>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalItems}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.resolvedToday}</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Claims */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Claims ({pendingClaims.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClaims.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Claimer</TableHead>
                    <TableHead className="hidden md:table-cell">Proof of Ownership</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => {
                    const item = getItemForClaim(claim);
                    return (
                      <TableRow key={claim.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{item?.name || "Unknown Item"}</p>
                              <p className="text-xs text-muted-foreground">
                                {item?.location}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{claim.claimerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {claim.claimerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {claim.proofOfOwnership}
                          </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-success border-success/30 hover:bg-success/10"
                              onClick={() => handleAction(claim, "approve")}
                            >
                              <CheckCircle2 className="w-4 h-4 sm:mr-1" />
                              <span className="hidden sm:inline">Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => handleAction(claim, "reject")}
                            >
                              <XCircle className="w-4 h-4 sm:mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Pending Claims</h3>
              <p className="text-muted-foreground">
                {search
                  ? "No claims match your search"
                  : "All claims have been reviewed. Great job!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {resolvedClaims.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolvedClaims.slice(0, 5).map((claim) => {
                const item = getItemForClaim(claim);
                return (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          claim.status === "approved"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        )}
                      >
                        {claim.status === "approved" ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {item?.name} - {claim.claimerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {claim.status === "approved" ? "Approved" : "Rejected"} on{" "}
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        claim.status === "approved"
                          ? "border-success/30 text-success"
                          : "border-destructive/30 text-destructive"
                      )}
                    >
                      {claim.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedClaim && !!confirmAction}
        onOpenChange={() => {
          setSelectedClaim(null);
          setConfirmAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "approve" ? "Approve Claim" : "Reject Claim"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "Are you sure you want to approve this claim? The item will be marked as resolved."
                : "Are you sure you want to reject this claim? The claimer will be notified."}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedClaim.claimerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedClaim.claimerEmail}</span>
              </div>
              <div className="flex gap-3">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {selectedClaim.proofOfOwnership}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedClaim(null);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmActionHandler}
              className={cn(
                confirmAction === "approve"
                  ? "bg-success text-success-foreground hover:bg-success/90"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
            >
              {confirmAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
