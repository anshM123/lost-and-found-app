"use client";

import { useStore } from "@/lib/store";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";

export function AdminPortal() {
  const { isAdmin } = useStore();

  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
