import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  type: text("type").notNull(), // e.g., Item or Service
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const menus = sqliteTable("menus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  redirectUrl: text("redirect_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const artists = sqliteTable("artists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  avatar: text("avatar"), // URL to the artist's avatar image
  polaroid: text("polaroid"), // URL to the artist's polaroid image
  description: text("description"), // A short bio or description of the artist
  socials: text("socials", { mode: "json" }).$type<Record<string, string>>(), // e.g., { "instagram": "link", "twitter": "link" }
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});



// 3. The Junction Table
export const itemArtists = sqliteTable("item_artists", {
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: 'cascade' }),
}, (t) => ({
  // Composite primary key ensures an artist can't be linked to the same item twice
  pk: primaryKey({ columns: [t.itemId, t.artistId] }), 
}));

export const orders = sqliteTable("orders", {
  // Use UUID instead
  id: text("id").primaryKey(), 
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"), // Great for reaching out via WhatsApp later
  notes: text("notes"),
  status: text("status").notNull().default("PENDING"), // e.g., 'PENDING', 'CONTACTED', 'COMPLETED'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  quantity: integer("quantity").notNull(),
  priceAtTime: integer("price_at_time").notNull(), 
});

// Relations

export const itemsRelations = relations(items, ({ many }) => ({
  itemArtists: many(itemArtists),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  itemArtists: many(itemArtists),
}));

export const itemArtistsRelations = relations(itemArtists, ({ one }) => ({
  item: one(items, {
    fields: [itemArtists.itemId],
    references: [items.id],
  }),
  artist: one(artists, {
    fields: [itemArtists.artistId],
    references: [artists.id],
  }),
}));