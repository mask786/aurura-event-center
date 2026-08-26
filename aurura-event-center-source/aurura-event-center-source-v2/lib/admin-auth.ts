// Placeholder admin auth for the prototype. Swap for real authenticated
// sessions (NextAuth, Clerk, etc.) before this ever handles real customer
// data — this exists only so /admin isn't wide open in the demo.

const KEY = "aurura_admin_auth";
export const DEMO_PASSWORD = "aurura2026";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEY) === "true";
}

export function setAdminAuthed() {
  window.sessionStorage.setItem(KEY, "true");
}

export function clearAdminAuthed() {
  window.sessionStorage.removeItem(KEY);
}
