import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { env } = await getCloudflareContext({ async: true });
  const filename = params.filename;

  // 1. Fetch the object from the bound R2 bucket
  const object = await env.BUCKET.get(filename);

  // 2. If it doesn't exist, return a 404
  if (!object) {
    return new Response("Image not found", { status: 404 });
  }

  // 3. Set the correct headers so the browser knows it's an image
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  // 4. Return the image stream
  return new Response(object.body as ReadableStream, {
    headers,
  });
}