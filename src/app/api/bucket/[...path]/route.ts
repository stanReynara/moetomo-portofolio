import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    // Make sure BUCKET matches the binding name in your wrangler.toml
    const r2Bucket = env.BUCKET as R2Bucket | undefined;
    
    if (!r2Bucket) {
      return new Response("R2 Binding not found", { status: 500 });
    }

    const resolvedParams = await params;
    const filePath = resolvedParams.path.join("/");
    
    // Fetch the object from the local mocked R2 bucket
    const object = await r2Bucket.get(filePath);

    if (!object) {
      return new Response("Image not found", { status: 404 });
    }

    const headers = new Headers();
    
    // --- THE FIX ---
    // Manually extract the content type instead of using object.writeHttpMetadata()
    if (object.httpMetadata && object.httpMetadata.contentType) {
      headers.set("Content-Type", object.httpMetadata.contentType);
    } else {
      // Fallback just in case the file was uploaded without a mimetype
      headers.set("Content-Type", "application/octet-stream"); 
    }

    headers.set("ETag", object.httpEtag);

    // Return the image stream
    return new Response(object.body as ReadableStream, { headers });
    
  } catch (error) {
    console.error("Failed to fetch local bucket image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}