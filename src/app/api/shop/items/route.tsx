import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env } = await getCloudflareContext();
  
  // Change 'DB' to 'moetomo_db'
  const result = await env.moetomo_db.prepare("SELECT * FROM items").all();
  
  return Response.json(result);
}