"use client";

import { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Defined based on your SQLite schema
type Item = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: string;
  imageUrl: string | null;
};

interface EditItemModalProps {
  item: Item;
}

export default function EditItemModal({ item }: EditItemModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const openModal = (): void => { dialogRef.current?.showModal(); };
  const closeModal = (): void => { dialogRef.current?.close(); };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Build the payload matching the Items schema
    const updateData = {
      id: item.id,
      name: formData.get("name") as string,
      price: parseInt(formData.get("price") as string, 10), // Convert to integer
      type: formData.get("type") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      description: (formData.get("description") as string) || null,
    };

    try {
      // Send the PATCH request to your items API route
      // (Make sure you create src/app/api/items/route.ts similar to your artists one!)
      const response = await fetch("/api/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to update item");
      }

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
          <h3 className="font-bold text-2xl mb-6">Edit Item: {item.name}</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input type="hidden" name="id" value={item.id} />

            {/* Name */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Item Name</span></label>
              <input 
                type="text" 
                name="name" 
                defaultValue={item.name} 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Price (IDR)</span></label>
                <input 
                  type="number" 
                  name="price" 
                  defaultValue={item.price} 
                  min="0"
                  className="input input-bordered w-full font-mono" 
                  required 
                />
              </div>

              {/* Type (Dropdown) */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Item Type</span></label>
                <select 
                  name="type" 
                  defaultValue={item.type} 
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Item">Physical Item</option>
                  <option value="Service">Service / Commission</option>
                  <option value="Digital">Digital Download</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Image Path</span></label>
              <input 
                type="text" 
                name="imageUrl" 
                defaultValue={item.imageUrl || ""} 
                placeholder="/items/merch-1.png"
                className="input input-bordered w-full" 
              />
            </div>

            {/* Description (Using the flex-col fix so the label sits on top) */}
            <div className="flex flex-col w-full gap-2 mt-2">
              <label htmlFor="item-description" className="text-sm font-medium px-1">
                Description
              </label>
              <textarea 
                id="item-description"
                name="description" 
                defaultValue={item.description || ""} 
                className="textarea textarea-bordered h-24 w-full" 
                placeholder="Describe the item or service..."
              ></textarea>
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