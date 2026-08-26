"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { venue } from "@/lib/config";
import { DEMO_PASSWORD, setAdminAuthed } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setAdminAuthed();
      router.push("/admin");
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-charcoal">
            <Lock size={18} />
          </span>
          <h1 className="font-serif-display text-2xl mb-1">{venue.name} Admin</h1>
          <p className="text-sm text-charcoal-soft/60">Operations dashboard — authorized staff only</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-hairline p-8">
          <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold mb-2"
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mb-3">Incorrect password.</p>}
          <button type="submit" className="btn btn-primary w-full mt-3">
            Enter Dashboard
          </button>
          <p className="text-[11px] text-charcoal-soft/45 mt-5 text-center leading-relaxed">
            Demo password: <span className="font-mono">{DEMO_PASSWORD}</span>
            <br />
            Replace with real staff authentication before launch.
          </p>
        </form>
      </div>
    </div>
  );
}
