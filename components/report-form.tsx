"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Calendar,
  FileText,
  ImagePlus,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { ItemCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Item Type", icon: Package },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Review", icon: Check },
];

const categories: { value: ItemCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "books", label: "Books & Supplies" },
  { value: "sports", label: "Sports Equipment" },
  { value: "other", label: "Other" },
];

const locations = [
  "Library - 1st Floor",
  "Library - 2nd Floor",
  "Cafeteria",
  "Main Office",
  "Gymnasium",
  "Auditorium",
  "Science Building",
  "Art Building",
  "Music Room",
  "Soccer Field",
  "Parking Lot",
  "Other",
];

export function ReportForm() {
  const router = useRouter();
  const { addItem } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [itemType, setItemType] = useState<"lost" | "found">("found");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reporterName, setReporterName] = useState("");

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return itemType;
      case 2:
        return name && category && description;
      case 3:
        return (location && location !== "Other") || (location === "Other" && customLocation);
      case 4:
        return reporterName;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!canProceed()) return;

    addItem({
      name,
      category: category as ItemCategory,
      description,
      location: location === "Other" ? customLocation : location,
      date,
      status: itemType === "lost" ? "lost" : "found",
      type: itemType,
      reportedBy: reporterName,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Report Submitted!
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Your {itemType} item report has been successfully submitted. It will now
          appear on the dashboard for others to see.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/")}>
            View Dashboard
          </Button>
          <Button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setName("");
              setCategory("");
              setDescription("");
              setLocation("");
              setCustomLocation("");
              setDate(new Date().toISOString().split("T")[0]);
              setReporterName("");
            }}
          >
            Report Another Item
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Report an Item</h1>
        <p className="text-muted-foreground">
          Help reunite lost items with their owners by submitting a report
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-success text-success-foreground",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium hidden sm:block",
                      isActive && "text-primary",
                      isCompleted && "text-success",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2",
                      isCompleted ? "bg-success" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Item Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Are you reporting a lost item or something you found?
              </p>
              <RadioGroup
                value={itemType}
                onValueChange={(value) => setItemType(value as "lost" | "found")}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="lost"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    itemType === "lost"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="lost" id="lost" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">I Lost Something</p>
                      <p className="text-sm text-muted-foreground">
                        Report a missing item
                      </p>
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="found"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    itemType === "found"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="found" id="found" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">I Found Something</p>
                      <p className="text-sm text-muted-foreground">
                        Report a found item
                      </p>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Item Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Blue Backpack, iPhone 15, Science Textbook"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ItemCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details that would help identify this item (color, brand, distinguishing features...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Date {itemType === "lost" ? "Lost" : "Found"}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">
                  Where was the item {itemType === "lost" ? "last seen" : "found"}? *
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {location === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customLocation">Specify Location *</Label>
                  <Input
                    id="customLocation"
                    placeholder="Enter the location"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                  />
                </div>
              )}

              <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-accent-foreground">Location Tips</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Be as specific as possible. Include room numbers, floor levels,
                      or nearby landmarks to help others locate the item.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Your Name *</Label>
                <Input
                  id="reporterName"
                  placeholder="Enter your name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be shown as the reporter for this item
                </p>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 border-b border-border">
                  <h3 className="font-medium">Report Summary</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{itemType} Item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item Name</span>
                    <span className="font-medium">{name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">
                      {categories.find((c) => c.value === category)?.label || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">
                      {location === "Other" ? customLocation : location || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {date ? new Date(date).toLocaleDateString() : "-"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground text-sm">Description</span>
                    <p className="mt-1 text-sm">{description || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="gap-2 bg-success text-success-foreground hover:bg-success/90"
              >
                <Check className="w-4 h-4" />
                Submit Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
