// scripts/seedSmoke.js
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function slugify(s) {
  return String(s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
function toFloat(n) {
  if (typeof n === "number" && Number.isFinite(n)) return Number(n.toFixed(2));
  if (typeof n === "string" && n.trim() !== "" && !isNaN(Number(n))) return Number(Number(n).toFixed(2));
  return 0;
}
function toSKU(name, sku) {
  const base = String(sku || "").trim();
  if (base) return base.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const fromName = String(name || "PROD").toUpperCase().replace(/\s+/g, "-").replace(/[^A-Z0-9-]/g, "");
  return `${fromName}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function isLikelyProductName(name) {
  if (!name || typeof name !== "string") return false;
  const n = name.trim();
  if (n.length < 2) return false;
  if (n.includes(':"') || n.includes('\\"') || n.includes('"]') || n.includes('":{"')) return false;
  return true;
}

(async () => {
  try {
    const jsonPath = path.join(process.cwd(), "prisma", "seeds", "products_for_seed.json");
    if (!fs.existsSync(jsonPath)) {
      console.error("Missing JSON:", jsonPath);
      process.exit(1);
    }
    let items = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!Array.isArray(items)) {
      items = Array.isArray(items?.products)
        ? items.products
        : (() => { throw new Error("JSON must be an array or { products: [...] }"); })();
    }

    const total = items.length;
    const mapped = items.map((p) => {
      const name = String(p?.name ?? "").trim();
      const slug = slugify(p?.slug || name || p?.sku || "product");
      return { name: name || "Untitled Product", slug, sku: toSKU(name || slug, p?.sku), basePrice: toFloat(p?.basePrice) };
    });

    const valid = mapped.filter((r) => isLikelyProductName(r.name));
    const invalidCount = mapped.length - valid.length;

    const seen = new Set();
    const deduped = [];
    for (const r of valid) {
      if (!seen.has(r.slug)) { seen.add(r.slug); deduped.push(r); }
    }
    const dupesDropped = valid.length - deduped.length;
    console.log({ total, invalidCount, dupesDropped, toInsert: deduped.length });

    let inserted = 0;
    try {
      const res = await prisma.product.createMany({ data: deduped });
      inserted = res?.count ?? 0;
      console.log("createMany inserted:", inserted);
    } catch (e) {
      console.warn("createMany failed, falling back to upsert loop:", e?.message || e);
      for (const row of deduped) {
        await prisma.product.upsert({
          where: { slug: row.slug },
          create: row,
          update: { name: row.name, sku: row.sku, basePrice: row.basePrice },
        });
        inserted++;
      }
      console.log("upsert fallback inserted/updated:", inserted);
    }

    const count_after = await prisma.product.count();
    console.log("count_after =", count_after);

    const sampleRows = await prisma.product.findMany({
      take: 10,
      orderBy: { slug: "asc" },
      select: { id: true, name: true, sku: true, slug: true, basePrice: true },
    });
    console.log("sampleRows:", sampleRows);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();