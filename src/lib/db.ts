import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════
// Supabase REST backend with Prisma-compatible API
// This allows all 52+ files using `prisma.model.findMany()` etc.
// to work unchanged, backed by Supabase's PostgREST API.
// ═══════════════════════════════════════════════════════════════════════

// ─── Name Mappings ────────────────────────────────────────────────────

const TABLES: Record<string, string> = {
  user: "users",
  siteSetting: "site_settings",
  navigationItem: "navigation_items",
  media: "media",
  seoMetadata: "seo_metadata",
  page: "pages",
  pageSection: "page_sections",
  homepageSection: "homepage_sections",
  service: "services",
  property: "properties",
  propertyImage: "property_images",
  propertyFeature: "property_features",
  propertyAmenity: "property_amenities",
  project: "projects",
  projectImage: "project_images",
  projectFeature: "project_features",
  teamMember: "team_members",
  testimonial: "testimonials",
  category: "categories",
  post: "posts",
  enquiry: "enquiries",
  contentRevision: "content_revisions",
  activityLog: "activity_logs",
};

// camelCase → snake_case for column names
const FIELDS: Record<string, Record<string, string>> = {
  users: {
    lastLogin: "last_login",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  site_settings: { updatedAt: "updated_at" },
  navigation_items: {
    parentId: "parent_id",
    isVisible: "is_visible",
    isExternal: "is_external",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  media: {
    originalName: "original_name",
    mimeType: "mime_type",
    thumbnailUrl: "thumbnail_url",
    webpUrl: "webp_url",
    altText: "alt_text",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  seo_metadata: {
    entityType: "entity_type",
    entityId: "entity_id",
    seoTitle: "seo_title",
    metaDescription: "meta_description",
    canonicalUrl: "canonical_url",
    ogTitle: "og_title",
    ogDescription: "og_description",
    ogImage: "og_image",
    noIndex: "no_index",
    inSitemap: "in_sitemap",
    updatedAt: "updated_at",
  },
  pages: {
    featuredImage: "featured_image",
    publishedAt: "published_at",
    scheduledAt: "scheduled_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  page_sections: {
    pageId: "page_id",
    sortOrder: "sort_order",
    isVisible: "is_visible",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  homepage_sections: {
    sortOrder: "sort_order",
    isVisible: "is_visible",
    updatedAt: "updated_at",
  },
  services: {
    shortDescription: "short_description",
    fullDescription: "full_description",
    ctaText: "cta_text",
    ctaUrl: "cta_url",
    sortOrder: "sort_order",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  properties: {
    propertyType: "property_type",
    priceLabel: "price_label",
    shortDescription: "short_description",
    fullDescription: "full_description",
    bedrooms: "bedrooms",
    bathrooms: "bathrooms",
    floorArea: "floor_area",
    landSize: "land_size",
    mainImage: "main_image",
    isFeatured: "is_featured",
    isPublished: "is_published",
    publishedAt: "published_at",
    scheduledAt: "scheduled_at",
    mapLat: "map_lat",
    mapLng: "map_lng",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  property_images: {
    propertyId: "property_id",
    thumbnailUrl: "thumbnail_url",
    altText: "alt_text",
    sortOrder: "sort_order",
    createdAt: "created_at",
  },
  property_features: {
    propertyId: "property_id",
    sortOrder: "sort_order",
  },
  property_amenities: {
    propertyId: "property_id",
    sortOrder: "sort_order",
  },
  projects: {
    shortDescription: "short_description",
    fullDescription: "full_description",
    startDate: "start_date",
    completionDate: "completion_date",
    mainImage: "main_image",
    isPublished: "is_published",
    publishedAt: "published_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  project_images: {
    projectId: "project_id",
    thumbnailUrl: "thumbnail_url",
    altText: "alt_text",
    sortOrder: "sort_order",
    createdAt: "created_at",
  },
  project_features: {
    projectId: "project_id",
    sortOrder: "sort_order",
  },
  team_members: {
    facebookUrl: "facebook_url",
    linkedinUrl: "linkedin_url",
    twitterUrl: "twitter_url",
    instagramUrl: "instagram_url",
    sortOrder: "sort_order",
    isVisible: "is_visible",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  testimonials: {
    clientName: "client_name",
    sortOrder: "sort_order",
    isVisible: "is_visible",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  posts: {
    featuredImage: "featured_image",
    authorId: "author_id",
    categoryId: "category_id",
    isFeatured: "is_featured",
    publishedAt: "published_at",
    scheduledAt: "scheduled_at",
    seoTitle: "seo_title",
    metaDescription: "meta_description",
    ogImage: "og_image",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  enquiries: {
    propertyId: "property_id",
    projectId: "project_id",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  content_revisions: {
    entityType: "entity_type",
    entityId: "entity_id",
    userId: "user_id",
    createdAt: "created_at",
  },
  activity_logs: {
    userId: "user_id",
    entityType: "entity_type",
    entityId: "entity_id",
    entityLabel: "entity_label",
    ipAddress: "ip_address",
    createdAt: "created_at",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────

function toSnake(field: string, table?: string): string {
  if (table && FIELDS[table]?.[field]) return FIELDS[table]![field]!;
  // Default: camelCase → snake_case
  return field.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
}

function toSnakeRecord(obj: Record<string, unknown>, table: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[toSnake(k, table)] = v;
  }
  return out;
}

function toCamel(row: Record<string, unknown>, table: string): Record<string, unknown> {
  if (!row) return row;
  const fieldMap = FIELDS[table];
  if (!fieldMap) return row;
  // Build reverse map: snake → camel
  const reverse: Record<string, string> = {};
  for (const [camel, snake] of Object.entries(fieldMap)) {
    reverse[snake] = camel;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[reverse[k] || k] = v;
  }
  return out;
}

function toCamelArray(rows: Record<string, unknown>[], table: string): Record<string, unknown>[] {
  return rows.map((r) => toCamel(r, table));
}

function applyWhere(
  q: ReturnType<SupabaseClient["from"]>,
  where: Record<string, unknown>,
  table: string,
): ReturnType<SupabaseClient["from"]> {
  let query = q;
  for (const [key, value] of Object.entries(where)) {
    if (value === null || value === undefined) {
      query = query.is(toSnake(key, table), null);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const ops = value as Record<string, unknown>;
      for (const [op, val] of Object.entries(ops)) {
        switch (op) {
          case "equals":
            query = val === null ? query.is(toSnake(key, table), null) : query.eq(toSnake(key, table), val);
            break;
          case "not":
            query = val === null ? query.not(toSnake(key, table), "is", null) : query.neq(toSnake(key, table), val);
            break;
          case "gt":
            query = query.gt(toSnake(key, table), val);
            break;
          case "gte":
            query = query.gte(toSnake(key, table), val);
            break;
          case "lt":
            query = query.lt(toSnake(key, table), val);
            break;
          case "lte":
            query = query.lte(toSnake(key, table), val);
            break;
          case "contains":
            query = query.contains(toSnake(key, table), val);
            break;
          case "startsWith":
            query = query.ilike(toSnake(key, table), `${val}%`);
            break;
          case "in":
            query = query.in(toSnake(key, table), val as unknown[]);
            break;
          case "notIn":
            query = query.not(toSnake(key, table), "in", val as unknown[]);
            break;
        }
      }
    } else {
      query = query.eq(toSnake(key, table), value);
    }
  }
  return query;
}

function applyOrderBy(
  q: ReturnType<SupabaseClient["from"]>,
  orderBy: Record<string, string> | Record<string, string>[],
  table: string,
): ReturnType<SupabaseClient["from"]> {
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  let query = q;
  for (const order of orders) {
    for (const [key, dir] of Object.entries(order)) {
      query = query.order(toSnake(key, table), { ascending: dir === "asc" });
    }
  }
  return query;
}

// ─── Supabase Client ──────────────────────────────────────────────────

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase URL and key must be set");
  return createClient(url, key);
}

// ─── Model Delegator ──────────────────────────────────────────────────

interface WhereClause {
  [key: string]: unknown;
}

interface QueryArgs {
  where?: WhereClause;
  orderBy?: Record<string, string> | Record<string, string>[];
  take?: number;
  skip?: number;
  include?: Record<string, unknown>;
  select?: Record<string, boolean>;
  data?: Record<string, unknown>;
  create?: Record<string, unknown>;
  update?: Record<string, unknown>;
  _count?: { where?: WhereClause };
}

function resolveRelatedInclude(
  q: ReturnType<SupabaseClient["from"]>,
  include: Record<string, unknown>,
  primaryTable: string,
): ReturnType<SupabaseClient["from"]> {
  // Build PostgREST embed select string
  // e.g. { images: true } → "*, property_images(*)"
  const embeds: string[] = [];
  for (const [relName, relConfig] of Object.entries(include)) {
    if (relConfig === true) {
      // Simple include - find the related table name
      const relTable = findRelatedTable(primaryTable, relName);
      if (relTable) embeds.push(relTable);
    } else if (typeof relConfig === "object" && relConfig !== null) {
      const relTable = findRelatedTable(primaryTable, relName);
      if (relTable) {
        let embed = relTable + "(";
        const subInclude = (relConfig as Record<string, unknown>).include;
        const subSelect = (relConfig as Record<string, unknown>).select;
        if (typeof subInclude === "object" && subInclude !== null) {
          const subEmbeds: string[] = [];
          for (const [subRel, subConf] of Object.entries(subInclude as Record<string, unknown>)) {
            if (subConf === true) {
              const subRelTable = findRelatedTable(relTable, subRel);
              if (subRelTable) subEmbeds.push(subRelTable);
            }
          }
          embed += "*" + (subEmbeds.length ? "," + subEmbeds.join(",") : "");
        } else if (typeof subSelect === "object" && subSelect !== null) {
          const cols = Object.entries(subSelect as Record<string, boolean>)
            .filter(([, v]) => v)
            .map(([k]) => toSnake(k, relTable))
            .join(",");
          embed += cols || "*";
        } else {
          embed += "*";
        }
        embed += ")";
        embeds.push(embed);
      }
    }
  }
  if (embeds.length > 0) {
    return q.select("*, " + embeds.join(", "));
  }
  return q;
}

function findRelatedTable(parentTable: string, relName: string): string | null {
  // Map Prisma relation names to actual table names
  const RELATIONS: Record<string, Record<string, string>> = {
    properties: {
      images: "property_images",
      features: "property_features",
      amenities: "property_amenities",
      enquiries: "enquiries",
    },
    projects: {
      images: "project_images",
      features: "project_features",
      enquiries: "enquiries",
    },
    posts: {
      category: "categories",
      author: "users",
    },
    pages: {
      sections: "page_sections",
    },
    users: {
      posts: "posts",
      activityLogs: "activity_logs",
      contentRevisions: "content_revisions",
    },
    categories: {
      posts: "posts",
    },
    navigation_items: {
      parent: "navigation_items",
      children: "navigation_items",
    },
  };

  return RELATIONS[parentTable]?.[relName] || null;
}

function applyPostInsertRelations(
  row: Record<string, unknown>,
  include: Record<string, unknown>,
  primaryTable: string,
  sb: SupabaseClient,
): Record<string, unknown> {
  // If PostgREST embeds didn't work, fetch related data separately
  const result = { ...row };

  for (const [relName, relConfig] of Object.entries(include)) {
    if (relConfig === true || (typeof relConfig === "object" && relConfig !== null)) {
      const relTable = findRelatedTable(primaryTable, relName);
      if (!relTable) continue;
      // Find the FK column
      const fkCol = Object.keys(FIELDS[relTable] || {}).find((fk) => {
        const snake = toSnake(fk, relTable);
        return snake.endsWith("_id") && snake.replace("_id", "") === primaryTable.replace(/s$/, "");
      });
      if (fkCol) {
        const pkValue = row.id;
        if (pkValue) {
          const { data: relData } = await sb
            .from(relTable)
            .select("*")
            .eq(toSnake(fkCol, relTable), pkValue)
            .order("sort_order", { ascending: true });
          if (relData) result[relName] = toCamelArray(relData, relTable);
        }
      }
    }
  }

  return result;
}

// ─── Model Delegator Implementation ───────────────────────────────────

function createModelDelegator(modelName: string) {
  const table = TABLES[modelName] || modelName;

  return {
    async findMany(args?: QueryArgs) {
      const sb = getSupabase();
      let q = sb.from(table).select("*");

      if (args?.where) q = applyWhere(q, args.where, table);
      if (args?.orderBy) q = applyOrderBy(q, args.orderBy, table);
      if (args?.take) q = q.limit(args.take);
      if (args?.skip) q = q.range(args.skip, args.skip + (args.take || 50) - 1);

      // Handle includes with embeds
      if (args?.include) q = resolveRelatedInclude(q, args.include, table);

      // Handle select
      if (args?.select && !args.include) {
        const cols = Object.entries(args.select)
          .filter(([, v]) => v)
          .map(([k]) => {
            // If it's a relation name, handle separately
            if (args.include?.[k]) return null;
            return toSnake(k, table);
          })
          .filter(Boolean)
          .join(",");
        if (cols) q = q.select(cols);
      }

      const { data, error } = await q;
      if (error) {
        console.error(`[db] findMany(${modelName}):`, error.message);
        throw error;
      }
      return toCamelArray(data || [], table);
    },

    async findUnique(args: { where: WhereClause; include?: Record<string, unknown>; select?: Record<string, boolean> }) {
      const sb = getSupabase();
      let q = sb.from(table).select("*");

      if (args.include) q = resolveRelatedInclude(q, args.include, table);

      q = applyWhere(q, args.where, table);
      q = q.limit(1);

      const { data, error } = await q;
      if (error) {
        console.error(`[db] findUnique(${modelName}):`, error.message);
        throw error;
      }
      const row = data?.[0];
      if (!row) return null;
      const result = toCamel(row, table);

      // Handle nested includes if PostgREST didn't embed them
      if (args.include) {
        for (const [relName, relConfig] of Object.entries(args.include)) {
          if (relConfig === true || (typeof relConfig === "object" && relConfig !== null)) {
            if (!result[relName]) {
              const relTable = findRelatedTable(table, relName);
              if (!relTable) continue;
              const fkCol = Object.keys(FIELDS[relTable] || {}).find((fk) => {
                const snake = toSnake(fk, relTable);
                return snake.endsWith("_id") && snake.replace("_id", "") === table.replace(/s$/, "");
              });
              if (fkCol) {
                const pkValue = result.id;
                if (pkValue) {
                  const { data: relData } = await sb
                    .from(relTable)
                    .select("*")
                    .eq(toSnake(fkCol, relTable), pkValue)
                    .order("sort_order", { ascending: true });

                  // Handle sub-includes
                  if (typeof relConfig === "object" && relConfig !== null && relConfig.include) {
                    for (const row of relData || []) {
                      for (const [subRel, subConf] of Object.entries(relConfig.include as Record<string, unknown>)) {
                        if (subConf === true) {
                          const subRelTable = findRelatedTable(relTable, subRel);
                          if (subRelTable) {
                            const subFk = Object.keys(FIELDS[subRelTable] || {}).find((fk) => {
                              const snake = toSnake(fk, subRelTable);
                              return snake.endsWith("_id") && snake.replace("_id", "") === relTable.replace(/s$/, "");
                            });
                            if (subFk) {
                              const { data: subData } = await sb
                                .from(subRelTable)
                                .select("*")
                                .eq(toSnake(subFk, subRelTable), row.id);
                              if (subData) row[subRel] = toCamelArray(subData, subRelTable);
                            }
                          }
                        }
                      }
                    }
                  }

                  result[relName] = toCamelArray(relData || [], relTable);
                }
              }
            }
          }
        }
      }

      return result as Record<string, unknown>;
    },

    async findFirst(args?: QueryArgs) {
      const result = await this.findMany({ ...args, take: 1 });
      return result[0] || null;
    },

    async create(args: { data: Record<string, unknown>; select?: Record<string, boolean> }) {
      const sb = getSupabase();
      const snakeData = toSnakeRecord(args.data, table);

      // Handle nested creates: features: { create: [...] }
      const nestedCreates: Array<{ table: string; fkCol: string; items: Record<string, unknown>[] }> = [];
      for (const [key, value] of Object.entries(snakeData)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          const obj = value as Record<string, unknown>;
          if (obj.create && Array.isArray(obj.create)) {
            // This is a nested create - remove from main data and create separately
            const relTable = findRelatedTable(table, key.replace(/_id$/, ""));
            if (relTable) {
              const fkCol = key; // e.g. property_id
              nestedCreates.push({ table: relTable, fkCol, items: obj.create as Record<string, unknown>[] });
              delete snakeData[key];
            }
          }
        }
      }

      const { data, error } = await sb.from(table).insert(snakeData).select().single();
      if (error) {
        console.error(`[db] create(${modelName}):`, error.message);
        throw error;
      }

      // Execute nested creates
      for (const nc of nestedCreates) {
        for (const item of nc.items) {
          const snakeItem = toSnakeRecord(item, nc.table);
          snakeItem[nc.fkCol] = data.id;
          const { error: relErr } = await sb.from(nc.table).insert(snakeItem);
          if (relErr) {
            console.error(`[db] nested create(${nc.table}):`, relErr.message);
          }
        }
      }

      // Fetch with includes if requested
      const result = toCamel(data, table);
      return result as Record<string, unknown>;
    },

    async update(args: { where: WhereClause; data: Record<string, unknown> }) {
      const sb = getSupabase();
      const snakeData = toSnakeRecord(args.data, table);
      // Remove undefined values
      for (const [k, v] of Object.entries(snakeData)) {
        if (v === undefined) delete snakeData[k];
      }

      let q = sb.from(table).update(snakeData);

      // Apply where clause - try id first, then generic
      if (args.where.id) {
        q = q.eq("id", args.where.id);
      } else {
        q = applyWhere(q, args.where, table);
      }

      q = q.select().single();
      const { data, error } = await q;
      if (error) {
        console.error(`[db] update(${modelName}):`, error.message);
        throw error;
      }
      return toCamel(data, table) as Record<string, unknown>;
    },

    async delete(args: { where: WhereClause }) {
      const sb = getSupabase();
      let q = sb.from(table).delete();

      if (args.where.id) {
        q = q.eq("id", args.where.id);
      } else {
        q = applyWhere(q, args.where, table);
      }

      const { error } = await q;
      if (error) {
        console.error(`[db] delete(${modelName}):`, error.message);
        throw error;
      }
      return { success: true };
    },

    async upsert(args: { where: WhereClause; create: Record<string, unknown>; update: Record<string, unknown> }) {
      const sb = getSupabase();
      const snakeCreate = toSnakeRecord(args.create, table);
      const snakeUpdate = toSnakeRecord(args.update, table);
      // Remove undefined from update
      for (const [k, v] of Object.entries(snakeUpdate)) {
        if (v === undefined) delete snakeUpdate[k];
      }

      // Try to find existing first
      let q = sb.from(table).select("id").limit(1);
      q = applyWhere(q, args.where, table);
      const { data: existing } = await q;

      if (existing && existing.length > 0) {
        // Update
        const id = existing[0].id;
        const { data, error } = await sb
          .from(table)
          .update(snakeUpdate)
          .eq("id", id)
          .select()
          .single();
        if (error) {
          console.error(`[db] upsert update(${modelName}):`, error.message);
          throw error;
        }
        return toCamel(data, table) as Record<string, unknown>;
      } else {
        // Create
        const { data, error } = await sb.from(table).insert(snakeCreate).select().single();
        if (error) {
          console.error(`[db] upsert create(${modelName}):`, error.message);
          throw error;
        }
        return toCamel(data, table) as Record<string, unknown>;
      }
    },

    async count(args?: { where?: WhereClause }) {
      const sb = getSupabase();
      let q = sb.from(table).select("id", { count: "exact", head: true });
      if (args?.where) q = applyWhere(q, args.where, table);
      const { count, error } = await q;
      if (error) {
        console.error(`[db] count(${modelName}):`, error.message);
        throw error;
      }
      return count || 0;
    },

    async deleteMany(args?: { where?: WhereClause }) {
      const sb = getSupabase();
      let q = sb.from(table).delete();
      if (args?.where) q = applyWhere(q, args.where, table);
      const { error } = await q;
      if (error) {
        console.error(`[db] deleteMany(${modelName}):`, error.message);
        throw error;
      }
      return { success: true };
    },
  };
}

// ─── Proxy ────────────────────────────────────────────────────────────

const modelCache = new Map<string, ReturnType<typeof createModelDelegator>>();

const prisma = new Proxy(
  {} as Record<string, unknown>,
  {
    get(_target, prop: string) {
      if (prop === "$disconnect" || prop === "$connect") return () => Promise.resolve();

      if (!modelCache.has(prop)) {
        modelCache.set(prop, createModelDelegator(prop));
      }
      return modelCache.get(prop);
    },
  },
);

export default prisma;
