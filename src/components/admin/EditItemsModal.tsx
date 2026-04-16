// src/components/admin/EditArtistModal.tsx
"use client";

import { useRef, useState, FormEvent } from "react";

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

  // Parse existing socials safely
  const existingSocials = artist.socials || {};

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // We will hook this up to a Server Action next!
    console.log("Submitting updated artist data:", Object.fromEntries(formData));
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  return (
    <>
      {/* The Edit Button that triggers the modal */}
      <button onClick={openModal} className="btn btn-sm btn-outline">
        Edit
      </button>

      {/* The DaisyUI Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Edit Artist: {artist.name}</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Hidden ID field for the server action */}
            <input type="hidden" name="id" value={artist.id} />

            {/* Name */}
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
              {/* Avatar Path */}
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

              {/* Polaroid Path */}
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

            {/* Description */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Description (Bio)</span></label>
              <textarea 
                name="description" 
                defaultValue={artist.description || ""} 
                className="textarea textarea-bordered h-24" 
                placeholder="Artist biography..."
              ></textarea>
            </div>

            {/* Socials (JSON structured visually) */}
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

            {/* Modal Actions */}
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
        
        {/* Clicking outside closes the modal */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </>
  );
}