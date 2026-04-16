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
  const router = useRouter(); // Initialize router for refreshing the page

  const existingSocials = artist.socials || {};

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // 1. Group the social links into a single object
    const instagram = formData.get("instagram") as string;
    const twitter = formData.get("twitter") as string;
    
    const socialsPayload: Record<string, string> = {};
    if (instagram) socialsPayload.instagram = instagram;
    if (twitter) socialsPayload.twitter = twitter;

    // 2. Build the payload matching your API's expected UpdateArtist type
    const updateData = {
      id: artist.id, // ID is required for the PATCH request
      name: formData.get("name") as string,
      avatar: (formData.get("avatar") as string) || null,
      polaroid: (formData.get("polaroid") as string) || null,
      description: (formData.get("description") as string) || null,
      socials: Object.keys(socialsPayload).length > 0 ? socialsPayload : null,
    };

    try {
      // 3. Send the PATCH request to your API route
      const response = await fetch("/api/artists", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to update artist");
      }

      // 4. Success! Close modal and refresh the parent page
      closeModal();
      router.refresh(); // This tells Next.js to re-run the server component and fetch fresh D1 data
      
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
            {/* Hidden ID field is technically no longer needed in the HTML since we grab it from props, but keeping it is harmless */}
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
                <label className="label"><span className="label-text font-medium">Avatar Path</span></label>
                <input 
                  type="text" 
                  name="avatar" 
                  defaultValue={artist.avatar || ""} 
                  placeholder="/avatar/name.png"
                  className="input input-bordered w-full" 
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Polaroid Path</span></label>
                <input 
                  type="text" 
                  name="polaroid" 
                  defaultValue={artist.polaroid || ""} 
                  placeholder="/polaroids/name.png"
                  className="input input-bordered w-full" 
                />
              </div>
            </div>

            {/* Description using the flex-col fix */}
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