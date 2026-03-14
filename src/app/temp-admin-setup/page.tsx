"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function TempAdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      alert(`Error creating admin: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      alert("Admin account created successfully! Check your D1 database.");
      router.push("/"); // Redirect home after success
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error mb-4">
            ⚠️ Temporary Admin Setup
          </h2>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Admin Name (e.g., John Doe)"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Admin Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Secure Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary mt-2"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4">
            Remember to delete this page after creating the account to secure the order form!
          </p>
        </div>
      </div>
    </div>
  );
}