import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Check if the user is trying to access the restricted area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    
    // Ping the auth API to verify the session cookie
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    // If no valid session exists, redirect to the hidden login page
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

// Tell Next.js to only run this middleware on /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};