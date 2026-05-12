// src/components/admin/AddItemModal.tsx
"use client";

import { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddItemModal() {
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

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Prevent sending an empty file if the user didn't upload an image
    const imageFile = formData.get("image") as File;
    if (!imageFile || imageFile.size === 0) {
      formData.delete("image");
    }

    try {
      // Send the POST request to your items API route
      // Note: We send the raw FormData to handle the file upload
      const response = await fetch("/api/items", {
        method: "POST",
        body: formData, // Automatically sets Content-Type to multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to add item");
      }

      // Success! Close, clear, and refresh
      closeModal();
      router.refresh();
      
    } catch (error) {
      console.error("Failed to add:", error);
      alert("An error occurred while adding the item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-primary">
        + Add New Item
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Add New Item</h3>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left">
            
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Item Name</span></label>
              <input 
                type="text" 
                name="name" 
                className="input input-bordered w-full" 
                placeholder="e.g., Commission Portrait"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Price (IDR)</span></label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="50000"
                  className="input input-bordered w-full" 
                  required
                  min="0"
                />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Type</span></label>
                <select name="type" className="select select-bordered w-full" required defaultValue="">
                  <option value="" disabled>Select Type</option>
                  <option value="Item">Item (Physical/Digital)</option>
                  <option value="Service">Service (Commission)</option>
                </select>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Image Upload</span></label>
              <input 
                type="file" 
                name="image" 
                accept="image/*"
                className="file-input file-input-bordered w-full" 
              />
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <label htmlFor="new-description" className="text-sm font-medium px-1">
                Description
              </label>
              <textarea 
                id="new-description"
                name="description" 
                className="textarea textarea-bordered h-24 w-full" 
                placeholder="Describe the item or service..."
              ></textarea>
            </div>

            <div className="modal-action mt-8">
              <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Add Item"}
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