"use client";

import { useCart } from "./CartProvider";
import { useState } from "react";

export default function CartModal() {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNotes, setCustomerNotes] = useState(""); // NEW: Notes state

  // New states for form submission handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 1. Map the cart to match the CartItem type the API expects ({ itemId, quantity })
    const orderItems = cart.map((item) => ({
      itemId: item.id,
      quantity: item.quantity,
    }));

    // 2. Construct the clean payload
    const orderPayload = {
      customerName,
      customerEmail,
      notes: customerNotes, // NEW: Include notes in payload
      items: orderItems,
    };

    // 3. Send it to your API
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      // Cast the response to an object containing an optional 'error' string
      const data = (await response.json()) as { error?: string };

      if (response.ok) {
        // Success: Clear cart, reset form, and close modal
        clearCart();
        setCustomerName("");
        setCustomerEmail("");
        setCustomerNotes(""); // NEW: Reset notes
        (document.getElementById("cart_modal") as HTMLDialogElement)?.close();

        // Optional: Replace this with a nice toast notification
        alert("Order submitted successfully! Check your email for details.");
      } else {
        // Handle API errors (e.g., missing fields, items not found)
        setError(data.error || "Failed to submit order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="btn btn-primary btn-circle btn-lg shadow-2xl relative"
          onClick={() =>
            (
              document.getElementById("cart_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartCount > 0 && (
            <span className="badge badge-sm badge-secondary absolute -top-2 -right-2 font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* DaisyUI Dialog Modal */}
      <dialog id="cart_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 p-0 overflow-hidden">
          <div className="p-6 bg-base-200 border-b border-base-300 flex justify-between items-center">
            <h3 className="font-bold text-2xl">Your Cart</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-6">
                ✕
              </button>
            </form>
          </div>

          <div className="p-6 max-h-[50vh] overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-base-content/50 py-8">
                Your cart is empty.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-4 bg-base-200/50 p-3 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-primary font-mono text-xs">
                        {formatIDR(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="btn btn-xs btn-circle btn-ghost"
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="btn btn-xs btn-circle btn-ghost"
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-xs btn-error btn-square rounded-md"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <form
              onSubmit={handleCheckout}
              className="p-6 bg-base-200 border-t border-base-300 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="font-bold text-xl text-primary font-mono">
                  {formatIDR(cartTotal)}
                </span>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="alert alert-error text-sm p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Your Name</span>
                </label>
                <input
                  type="text"
                  placeholder="cutesy example here :3"
                  className="input input-bordered w-full bg-base-100"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Your Email</span>
                </label>
                <input
                  type="email"
                  placeholder="example@example.com"
                  className="input input-bordered w-full bg-base-100"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* NEW: Optional Notes Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Notes <span className="opacity-50 font-normal">(Optional)</span></span>
                </label>
                <textarea
                  placeholder="Any special requests, links to reference images, or instructions?"
                  className="textarea textarea-bordered w-full bg-base-100 min-h-[80px]"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <p className="text-xs text-base-content/60 leading-relaxed text-center my-2">
                Insert disclamer and terms here.
              </p>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Request Payment Info"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button disabled={isSubmitting}>close</button>
        </form>
      </dialog>
    </>
  );
}