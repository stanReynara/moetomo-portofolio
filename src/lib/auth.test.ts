// @vitest-environment node
import { expect, it, vi } from "vitest";
vi.mock("drizzle-orm/d1", () => ({ drizzle: () => ({}) }));
import { getAuth } from "./auth";

it("rejects direct public signup requests", async () => {
  const auth = getAuth({ DB: {} as D1Database });
  const response = await auth.handler(new Request("http://localhost:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Unapproved", email: "unapproved@example.com", password: "long-enough-password" }),
  }));
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ code: "EMAIL_PASSWORD_SIGN_UP_DISABLED" });
});
