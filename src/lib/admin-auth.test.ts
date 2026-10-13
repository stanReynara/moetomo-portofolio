// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, database, env } = vi.hoisted(() => ({
  getSession: vi.fn(),
  database: vi.fn(),
  env: { DB: {} as D1Database, ADMIN_EMAILS: "admin@example.com" },
}));
vi.mock("./auth", () => ({ getAuth: () => ({ api: { getSession } }) }));
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: async () => ({ env }) }));
vi.mock("drizzle-orm/d1", () => ({ drizzle: database }));
import { getAdminAccess } from "./admin-auth";
import * as items from "@/app/api/items/route";
import * as artists from "@/app/api/artists/route";
import * as orders from "@/app/api/orders/route";
import middleware from "@/middleware";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.clearAllMocks();
  env.ADMIN_EMAILS = "admin@example.com";
  getSession.mockResolvedValue(null);
});

describe("admin allowlist", () => {
  it("allows explicitly approved accounts and forwards session headers", async () => {
    env.ADMIN_EMAILS = " other@example.com, ADMIN@example.com ";
    getSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    const headers = new Headers({ cookie: "session=example" });
    expect((await getAdminAccess(env, headers)).authorized).toBe(true);
    expect(getSession).toHaveBeenCalledWith({ headers });
  });
  it.each([undefined, "", "someone@example.com", "admin@example.com.evil"])("denies unapproved accounts with config %s", async (allowlist) => {
    getSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    expect(await getAdminAccess({ DB: env.DB, ADMIN_EMAILS: allowlist }, new Headers())).toMatchObject({ authorized: false, status: 403 });
  });
});

const protectedRoutes = [
  ["items POST", items.POST], ["items PATCH", items.PATCH], ["items DELETE", items.DELETE],
  ["artists POST", artists.POST], ["artists PATCH", artists.PATCH], ["artists DELETE", artists.DELETE],
  ["orders GET", orders.GET],
] as const;

describe.each(protectedRoutes)("%s", (_name, handler) => {
  it.each([401, 403])("rejects with %s before accessing storage or parsing input", async (status) => {
    getSession.mockResolvedValue(status === 401 ? null : { user: { email: "visitor@example.com" } });
    const response = await handler(new Request("http://localhost/api/test"));
    expect(response.status).toBe(status);
    expect(database).not.toHaveBeenCalled();
  });
});

it("allows an admin to list orders", async () => {
  getSession.mockResolvedValue({ user: { email: "admin@example.com" } });
  const query = { select: vi.fn(), from: vi.fn(), orderBy: vi.fn(), all: vi.fn().mockResolvedValue([]) };
  query.select.mockReturnValue(query);
  query.from.mockReturnValue(query);
  query.orderBy.mockReturnValue(query);
  database.mockReturnValue(query);
  expect((await orders.GET(new Request("http://localhost/api/orders"))).status).toBe(200);
  expect(query.all).toHaveBeenCalled();
});

it.each(["/admin", "/admin/items", "/admin/orders", "/admin/artists"])("protects page %s", async (path) => {
  const request = new NextRequest(`http://localhost${path}`);
  expect((await middleware(request)).headers.get("location")).toBe("http://localhost/login");
  getSession.mockResolvedValue({ user: { email: "visitor@example.com" } });
  expect((await middleware(request)).status).toBe(403);
  getSession.mockResolvedValue({ user: { email: "admin@example.com" } });
  expect((await middleware(request)).headers.get("x-middleware-next")).toBe("1");
});
