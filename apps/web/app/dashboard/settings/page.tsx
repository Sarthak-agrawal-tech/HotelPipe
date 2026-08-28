'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [formData, setFormData] = useState({
    // 1. Basic Details
    name: "", city: "", state: "", googleMapsLink: "",
    // 2. Contact & Routing
    whatsappNumber: "", secondaryNumbers: "", primaryLanguage: "hindi", focusArea: "wedding", teamSize: "solo",
    // 3. Property Details & Pricing
    roomCount: "", roomTypesAndPricing: "", banquetPackages: "", amenities: "",
    // 4. Policies
    checkInTime: "", checkOutTime: "", cancellationPolicy: "", faqs: "",
  });

  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; label: string }[]>([]);

  // Fetch existing hotel data on load
  useEffect(() => {
    async function loadHotel() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/hotels/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const safeData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = data[key] !== null ? String(data[key]) : "";
            return acc;
          }, {} as any);
          setFormData(safeData);
          if (data.media) setExistingMedia(data.media);
        }
      } catch (error) {
        console.error("Failed to load hotel", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadHotel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, getToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        label: "", 
      }));
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = ""; 
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    setMediaFiles((prev) => {
      const updated = [...prev];
      updated[index].label = newLabel;
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const token = await getToken();
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "roomCount" && !value) value = "0";
        payload.append(key, value as string);
      });

      mediaFiles.forEach((media, index) => {
        payload.append("files", media.file);
        payload.append("labels", media.label || `Unlabeled File ${index + 1}`);
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/hotels/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to update hotel profile.");
      }
      
      setMessage({ type: 'success', text: 'Updated successfully! Redirecting to dashboard...' });
      setMediaFiles([]); 
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
      const updatedData = await response.json();
      if (updatedData.media) setExistingMedia(updatedData.media);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>;
  }

  const textareaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl animate-slide-up">
        
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl tracking-tight text-foreground">
            Hotel Knowledge Base
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your AI's knowledge base and settings.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {message && (
              <div className={`rounded-md p-4 text-sm font-bold ${message.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                {message.text}
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
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-2">5. Photos & Brochures</h2>
              
              {/* Show Existing Media */}
              {existingMedia.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground">Current Files in Knowledge Base</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {existingMedia.map((media) => (
                      <div key={media.id} className="relative aspect-square rounded-md border border-border bg-muted overflow-hidden">
                        <img src={media.url} alt={media.label} className="object-cover w-full h-full" />
                        <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-[10px] font-bold text-center truncate">
                          {media.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold">Upload New Property Images (Rooms, Banquets, Exterior)</label>
                  
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*,.pdf" 
                    onChange={handleImageChange}
                    className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Select new files, then label them below so the AI knows what they are.
                  </p>

                  {mediaFiles.length > 0 && (
                    <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Label your new files
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
              <Button type="submit" className="w-full text-base font-bold h-12" disabled={isSaving}>
                {isSaving ? "Saving Updates..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}