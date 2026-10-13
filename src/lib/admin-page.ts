import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "./admin-auth";

export async function requireAdminPage() {
  const { env } = await getCloudflareContext({ async: true });
  const access = await getAdminAccess(env, await headers());
  if (!access.authorized) {
    if (access.status === 401) redirect("/login");
    notFound();
  }
}
