"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, FileText, Shield, ArrowRight, Package, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore, useHydration } from "@/lib/store";

export function LandingPage() {
  const hydrated = useHydration();
  const { items } = useStore();

  const stats = hydrated
    ? {
        totalItems: items.length,
        resolvedItems: items.filter((i) => i.status === "resolved").length,
        pendingItems: items.filter((i) => i.status === "pending").length,
      }
    : { totalItems: 0, resolvedItems: 0, pendingItems: 0 };

  const features = [
    {
      icon: Search,
      title: "Browse Items",
      description: "Search through all reported lost and found items at Alliance Academy",
      href: "/dashboard",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: FileText,
      title: "Report an Item",
      description: "Found something? Lost something? Submit a report in seconds",
      href: "/report",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Shield,
      title: "Admin Portal",
      description: "Staff access to manage claims and verify ownership",
      href: "/admin",
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/logo.png"
              alt="Alliance Academy for Innovation Logo"
              width={120}
              height={120}
              className="mb-6 rounded-full shadow-lg"
              priority
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Lost & Found Portal
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 text-pretty">
              Alliance Academy for Innovation&apos;s official system for reporting and recovering lost items. 
              Helping reunite students with their belongings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8">
                  <Search className="w-5 h-5" />
                  Browse Items
                </Button>
              </Link>
              <Link href="/report">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  <FileText className="w-5 h-5" />
                  Report an Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {hydrated ? stats.totalItems : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Total Items Reported</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {hydrated ? stats.resolvedItems : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Items Returned</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {hydrated ? stats.pendingItems : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple system makes it easy to report, search, and claim lost items
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <div className="flex items-center text-primary font-medium">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Lost Something?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Check the dashboard regularly or report your lost item so others can help you find it.
            Our community-driven approach helps reunite items with their owners quickly.
          </p>
          <Link href="/report">
            <Button size="lg" variant="secondary" className="gap-2">
              <FileText className="w-5 h-5" />
              Report a Lost Item
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Alliance Academy Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-foreground">Alliance Academy for Innovation</p>
                <p className="text-sm text-muted-foreground">Lost & Found Portal</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for FBLA Website Design Competition
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <a 
              href="https://alliance.forsyth.k12.ga.us/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Visit Alliance Academy for Innovation Official Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
