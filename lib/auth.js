import { request } from "./api";

export const TOKEN_KEY = "learnify_access_token";

export function saveSession(session) {
  if (!session?.token || !session?.user) throw new Error("The server returned an incomplete login response.");
  localStorage.setItem(TOKEN_KEY, session.token);
  return session;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function restoreSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const data = await request("/auth/me", {}, token);
    return { token, user: data.user };
  } catch (error) {
    clearSession();
    if (error.status === 401) return null;
    throw error;
  }
}
