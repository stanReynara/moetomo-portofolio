"use client";

import { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Artist = {
  id: number;
  name: string;
  avatar: string | null;
  polaroid: string | null;
  description: string | null;
  socials: Record<string, string> | null;
};

interface EditArtistModalProps {
  artist: Artist;
}

export default function EditArtistModal({ artist }: EditArtistModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const existingSocials = artist.socials || {};

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // 1. Group the social links into a single JSON string
    const instagram = formData.get("instagram") as string;
    const twitter = formData.get("twitter") as string;
    
    const socialsPayload: Record<string, string> = {};
    if (instagram) socialsPayload.instagram = instagram;
    if (twitter) socialsPayload.twitter = twitter;
    
    // Append socials as a string and remove the individual fields
    formData.set("socials", Object.keys(socialsPayload).length > 0 ? JSON.stringify(socialsPayload) : "");
    formData.delete("instagram");
    formData.delete("twitter");

    // 2. Prevent sending empty files if the user didn't select new images
    const avatarFile = formData.get("avatar") as File;
    if (!avatarFile || avatarFile.size === 0) {
      formData.delete("avatar");
    }

    const polaroidFile = formData.get("polaroid") as File;
    if (!polaroidFile || polaroidFile.size === 0) {
      formData.delete("polaroid");
    }

    try {
      // 3. Send the PATCH request as multipart/form-data
      const response = await fetch("/api/artists", {
        method: "PATCH",
        // Note: Do NOT set "Content-Type" manually when sending FormData.
        // The browser automatically sets it to multipart/form-data with the correct boundary.
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to update artist");
      }

      // 4. Success! Close modal and refresh the parent page
      closeModal();
      router.refresh();
      
    } catch (error) {
      console.error("Failed to update:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-sm btn-outline">
        Edit
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Edit Artist: {artist.name}</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input type="hidden" name="id" value={artist.id} />

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Name</span></label>
              <input 
                type="text" 
                name="name" 
                defaultValue={artist.name} 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Avatar Image</span></label>
                <input 
                  type="file" 
                  name="avatar" 
                  accept="image/*"
                  className="file-input file-input-bordered w-full" 
                />
                {artist.avatar && (
                  <label className="label">
                    <span className="label-text-alt text-gray-500 truncate">Current: {artist.avatar}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Polaroid Image</span></label>
                <input 
                  type="file" 
                  name="polaroid" 
                  accept="image/*"
                  className="file-input file-input-bordered w-full" 
                />
                {artist.polaroid && (
                  <label className="label">
                    <span className="label-text-alt text-gray-500 truncate">Current: {artist.polaroid}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <label htmlFor="description" className="text-sm font-medium px-1">
                Description (Bio)
              </label>
              <textarea 
                id="description"
                name="description" 
                defaultValue={artist.description || ""} 
                className="textarea textarea-bordered h-24 w-full" 
                placeholder="Artist biography..."
              ></textarea>
            </div>

            <div className="bg-base-200 p-4 rounded-lg space-y-3 mt-4">
              <h4 className="font-semibold text-sm">Social Links</h4>
              
              <div className="form-control w-full">
                <label className="label"><span className="label-text text-xs">Instagram URL</span></label>
                <input 
                  type="url" 
                  name="instagram" 
                  defaultValue={existingSocials.instagram || ""} 
                  placeholder="https://instagram.com/..."
                  className="input input-sm input-bordered w-full" 
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text text-xs">Twitter / X URL</span></label>
                <input 
                  type="url" 
                  name="twitter" 
                  defaultValue={existingSocials.twitter || ""} 
                  placeholder="https://twitter.com/..."
                  className="input input-sm input-bordered w-full" 
                />
              </div>
            </div>

            <div className="modal-action mt-8">
              <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </>
  );
}