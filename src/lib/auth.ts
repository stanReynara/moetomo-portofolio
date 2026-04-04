import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema"; // Adjust to your actual schema path

export function getAuth(env: any) {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite", 
    }),
    emailAndPassword: {
      enabled: true,
      // We leave this enabled so you can create the initial account,
      // but we simply won't build a public "Sign Up" page on the frontend.
    },
  });
}