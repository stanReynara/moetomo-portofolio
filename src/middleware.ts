import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminAccess } from "@/lib/admin-auth";

export default async function middleware(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const access = await getAdminAccess(env, request.headers);
  if (!access.authorized) {
    if (access.status === 401) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return new NextResponse("Admin access required", { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};
