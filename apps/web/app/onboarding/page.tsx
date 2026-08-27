'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // 1. Basic Details
    name: "",
    city: "",
    state: "",
    googleMapsLink: "",
    
    // 2. Contact & Routing
    whatsappNumber: "",
    secondaryNumbers: "", // Comma separated
    primaryLanguage: "hindi",
    focusArea: "wedding",
    teamSize: "solo",
    
    // 3. Property Details & Pricing
    roomCount: "",
    roomTypesAndPricing: "",
    banquetPackages: "",
    amenities: "",
    
    // 4. Policies
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    cancellationPolicy: "",
    faqs: "",
  });

  const [mediaFiles, setMediaFiles] = useState<{ file: File; label: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        label: "", // Starts empty so the user is forced to type it
      }));
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    // Clear the input so the user can select the same file again if needed
    e.target.value = ""; 
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    setMediaFiles((prev) => {
      const updated = [...prev];
      updated[index].label = newLabel;
      return updated;
    });
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // For V1, we will send the text data. Image uploads to Supabase Storage 
      // require a slightly different multipart/form-data approach which we can wire up next.
      await fetchWithAuth('/api/hotels', getToken, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          roomCount: parseInt(formData.roomCount) || 0,
        }),
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create hotel profile.");
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  // Reusable Tailwind classes for textareas to match Shadcn inputs
  const textareaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl animate-slide-up">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 size-8 rounded-sm bg-primary" />
          <h1 className="font-serif text-4xl tracking-tight text-foreground">
            Configure Your AI Agent
          </h1>
          <p className="mt-2 text-muted-foreground">
            The more details you provide, the better your AI can close leads.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            {/* SECTION 1: Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">1. Hotel Details</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold">Hotel Name</label>
                  <Input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rama Continental" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">City</label>
                  <Input required name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Prayagraj" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">State</label>
                  <Input required name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Uttar Pradesh" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold">Google Maps Link</label>
                  <Input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} placeholder="https://maps.google.com/..." />
                </div>
              </div>
            </div>

            {/* SECTION 2: Communications */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">2. Communications</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Primary WhatsApp Number *</label>
                  <Input required name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="+91 98765 43210" />
                  <p className="text-[11px] text-muted-foreground">The AI will run on this number.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Secondary Contact Numbers</label>
                  <Input name="secondaryNumbers" value={formData.secondaryNumbers} onChange={handleChange} placeholder="Comma separated for staff" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Primary Language</label>
                  <select name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} className={textareaClasses.replace('min-h-[80px]', 'h-10')}>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="bilingual">Bilingual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Primary Focus Area</label>
                  <select name="focusArea" value={formData.focusArea} onChange={handleChange} className={textareaClasses.replace('min-h-[80px]', 'h-10')}>
                    <option value="wedding">Weddings & Banquets</option>
                    <option value="corporate">Corporate Events</option>
                    <option value="pilgrimage">Pilgrimage / Dharamshala</option>
                    <option value="tourism">Tourism / Resort</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Pricing & Offerings */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">3. Pricing & Packages</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Room Types & Pricing</label>
                  <textarea name="roomTypesAndPricing" value={formData.roomTypesAndPricing} onChange={handleChange} className={textareaClasses} placeholder="e.g. Deluxe Room: ₹2500/night (includes breakfast)&#10;Suite: ₹4500/night" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Banquet & Event Packages</label>
                  <textarea name="banquetPackages" value={formData.banquetPackages} onChange={handleChange} className={textareaClasses} placeholder="e.g. Silver Package (Veg): ₹1200/plate&#10;Hall capacity: 500 pax" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Key Amenities (Restaurant, Spa, Parking, etc.)</label>
                  <textarea name="amenities" value={formData.amenities} onChange={handleChange} className={textareaClasses} placeholder="24/7 Room Service, Free Valet Parking, Pure Veg Restaurant..." />
                </div>
              </div>
            </div>

            {/* SECTION 4: Policies */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">4. Hotel Policies</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Check-in Time</label>
                  <Input name="checkInTime" value={formData.checkInTime} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Check-out Time</label>
                  <Input name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold">Cancellation & Refund Policy</label>
                  <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} className={textareaClasses} placeholder="e.g. Free cancellation up to 48 hours before check-in. 50% refund after..." />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold">Frequently Asked Questions (Internal Notes for AI)</label>
                  <textarea name="faqs" value={formData.faqs} onChange={handleChange} className={textareaClasses} placeholder="e.g. Q: Do you allow unmarried couples? A: Yes, with valid local ID." />
                </div>
              </div>
            </div>

            {/* SECTION 5: Media */}
            {/* SECTION 5: Media */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">5. Photos & Brochures</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold">Upload Property Images (Rooms, Banquets, Exterior)</label>
                  
                  {/* File Selector */}
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*,.pdf" 
                    onChange={handleImageChange}
                    className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Select your files, then label them below so the AI knows what they are.
                  </p>

                  {/* Dynamic List of Selected Files */}
                  {mediaFiles.length > 0 && (
                    <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Label your files for the AI
                      </h3>
                      {mediaFiles.map((media, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="truncate w-1/3 text-sm font-medium">
                            {media.file.name}
                          </div>
                          <Input
                            required
                            placeholder="e.g. Deluxe Room, Banquet Hall 1, Menu PDF"
                            value={media.label}
                            onChange={(e) => handleLabelChange(index, e.target.value)}
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Button type="submit" className="w-full text-base font-bold h-12" disabled={isLoading}>
                {isLoading ? "Saving Knowledge Base..." : "Complete Setup & Open Dashboard"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}