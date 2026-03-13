import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Note: In OpenNext/Cloudflare, accessing bindings in Server Components 
// might require getting the request context, depending on your exact adapter.
// A common approach using `next-on-pages` or OpenNext looks like this:

export function getDb(env: any) {
  return drizzle(env.DB, { schema }); // 'DB' is the name of your D1 binding in wrangler.toml
}