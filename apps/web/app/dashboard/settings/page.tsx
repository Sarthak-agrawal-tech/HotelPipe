'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/lib/api";

export default function SettingsPage() {
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; label: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "", city: "", state: "", googleMapsLink: "",
    whatsappNumber: "", secondaryNumbers: "", primaryLanguage: "hindi",
    focusArea: "wedding", teamSize: "solo", roomCount: "",
    roomTypesAndPricing: "", banquetPackages: "", amenities: "",
    checkInTime: "", checkOutTime: "", cancellationPolicy: "", faqs: "",
  });

  // Load existing data
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
          // Pre-fill the form, converting nulls to empty strings
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
  }, [isLoaded, getToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({ file, label: "" }));
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = ""; 
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
        method: 'PUT', // We use PUT for the update route
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!response.ok) throw new Error("Failed to update profile.");
      
      setMessage({ type: 'success', text: 'Hotel profile updated successfully!' });
      setMediaFiles([]); // Clear the new files array so they don't upload twice
      
      // Reload the existing media array from the response to show the newly added images
      const updatedData = await response.json();
      if (updatedData.media) setExistingMedia(updatedData.media);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading settings...</div>;

  const textareaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-serif font-bold mb-8">Hotel Knowledge Base</h1>
      
      {message && (
        <div className={`mb-6 rounded-md p-4 text-sm font-bold ${message.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">1. Hotel Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold">Hotel Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">City</label>
              <Input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">State</label>
              <Input name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Pricing & Offerings */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">2. Pricing & Packages</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Room Types & Pricing</label>
              <textarea name="roomTypesAndPricing" value={formData.roomTypesAndPricing} onChange={handleChange} className={textareaClasses} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Banquet Packages</label>
              <textarea name="banquetPackages" value={formData.banquetPackages} onChange={handleChange} className={textareaClasses} />
            </div>
          </div>
        </div>

        {/* Existing Media Display */}
        {existingMedia.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold border-b border-border pb-2">Current Media Files</h2>
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

        {/* Append New Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">Add New Photos</h2>
          <Input type="file" multiple accept="image/*,.pdf" onChange={handleImageChange} className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary" />
          
          {mediaFiles.length > 0 && (
            <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
              {mediaFiles.map((media, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="truncate w-1/3 text-sm font-medium">{media.file.name}</div>
                  <Input required placeholder="Label (e.g. Pool View)" value={media.label} onChange={(e) => {
                    const updated = [...mediaFiles];
                    updated[index].label = e.target.value;
                    setMediaFiles(updated);
                  }} className="flex-1" />
                  <button type="button" onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))} className="h-10 w-10 text-destructive border border-destructive rounded-md">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border">
          <Button type="submit" className="w-full text-base font-bold h-12" disabled={isSaving}>
            {isSaving ? "Saving Updates..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}