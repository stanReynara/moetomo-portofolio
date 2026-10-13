import { getAuth } from "./auth";

type AdminEnv = { DB: D1Database; ADMIN_EMAILS?: string };

export async function getAdminAccess(env: AdminEnv, headers: Headers) {
  const session = await getAuth(env).api.getSession({ headers });
  if (!session) {
    return { authorized: false, status: 401, error: "Authentication required" } as const;
  }
  const allowedEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!allowedEmails.includes(session.user.email.toLowerCase())) {
    return { authorized: false, status: 403, error: "Admin access required" } as const;
  }
  return { authorized: true, session } as const;
}
