"use client";

import { useStore, useHydration } from "@/lib/store";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function AdminPortal() {
  const hydrated = useHydration();
  const { isAdmin } = useStore();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
