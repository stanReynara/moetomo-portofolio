// src/components/admin/AddArtistModal.tsx
"use client";

import { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddArtistModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const openModal = () => dialogRef.current?.showModal();
  
  const closeModal = () => {
    dialogRef.current?.close();
    formRef.current?.reset(); // Clear the form when closing
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Group the social links
    const instagram = formData.get("instagram") as string;
    const twitter = formData.get("twitter") as string;
    
    const socialsPayload: Record<string, string> = {};
    if (instagram) socialsPayload.instagram = instagram;
    if (twitter) socialsPayload.twitter = twitter;

    // Build the insert payload (no ID needed for POST)
    const newArtistData = {
      name: formData.get("name") as string,
      avatar: (formData.get("avatar") as string) || null,
      polaroid: (formData.get("polaroid") as string) || null,
      description: (formData.get("description") as string) || null,
      socials: Object.keys(socialsPayload).length > 0 ? socialsPayload : null,
    };

    try {
      // Send the POST request to your existing API route
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArtistData),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to add artist");
      }

      // Success! Close, clear, and refresh
      closeModal();
      router.refresh();
      
    } catch (error) {
      console.error("Failed to add:", error);
      alert("An error occurred while adding the artist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* The Add Button that triggers the modal */}
      <button onClick={openModal} className="btn btn-primary">
        + Add New Artist
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Add New Artist</h3>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left">
            
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Name</span></label>
              <input 
                type="text" 
                name="name" 
                className="input input-bordered w-full" 
                placeholder="Artist Name"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Avatar Path</span></label>
                <input 
                  type="text" 
                  name="avatar" 
                  placeholder="/avatars/name.png"
                  className="input input-bordered w-full" 
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Polaroid Path</span></label>
                <input 
                  type="text" 
                  name="polaroid" 
                  placeholder="/polaroids/name.png"
                  className="input input-bordered w-full" 
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <label htmlFor="new-description" className="text-sm font-medium px-1">
                Description (Bio)
              </label>
              <textarea 
                id="new-description"
                name="description" 
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
                  placeholder="https://instagram.com/..."
                  className="input input-sm input-bordered w-full" 
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text text-xs">Twitter / X URL</span></label>
                <input 
                  type="url" 
                  name="twitter" 
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
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Add Artist"}
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