import { getAuth } from "@/lib/auth"; 
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const auth = getAuth(env);
  const authHandler = toNextJsHandler(auth);
  
  if (request.method === "POST") return authHandler.POST(request);
  return authHandler.GET(request);
}

export { handler as GET, handler as POST };