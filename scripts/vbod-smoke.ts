// scripts/vbod-smoke.ts
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const services = ["design","fabrication","installation","maintenance","permitting","project-management"];
const industries = ["construction","corporate","retail","healthcare","education","events","hospitality"];
const products = ["vinyl-banner","aluminum-sign","door-hours-decal"];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const check = async (path: string) => {
    const url = `${BASE}${path}`;
    const res = await page.goto(url, { waitUntil: "networkidle" });
    const ok = !!res && res.status() < 400;
    console.log(`${ok ? "✅" : "❌"} ${res?.status()} ${path}`);
    if (!ok) throw new Error(`Fail ${path}`);
    
    // sanity: page has a single primary CTA
    const ctas = await page.locator('a:has-text("Request a Quote"), a:has-text("Start Your Design"), a:has-text("Schedule Install"), a:has-text("Contact a PM"), button:has-text("Request a Quote")').count();
    console.log(`   CTAs found: ${ctas}`);
    
    // Check for hero image
    const heroImage = await page.locator('img[alt*="hero"], img[alt*="Hero"]').count();
    console.log(`   Hero images: ${heroImage}`);
    
    // Check for proper heading structure
    const h1 = await page.locator('h1').count();
    console.log(`   H1 tags: ${h1}`);
  };

  console.log(`🚀 Running VBOD smoke test on ${BASE}`);
  console.log("=".repeat(50));

  // Homepage
  console.log("\n📄 Testing Homepage...");
  await check("/");

  // Services
  console.log("\n🔧 Testing Services...");
  for (const s of services) await check(`/services/${s}`);

  // Industries  
  console.log("\n🏭 Testing Industries...");
  for (const i of industries) await check(`/industries/${i}`);

  // Products
  console.log("\n📦 Testing Products...");
  await check(`/products`);
  for (const p of products) await check(`/products/${p}`);

  // RFQ prefill
  console.log("\n📝 Testing RFQ prefill...");
  await check(`/request-a-quote?service=design&industry=construction&product=vinyl-banner&utm_source=qa&utm_campaign=smoke`);

  // Test some homepage CTAs
  console.log("\n🔗 Testing Homepage CTAs...");
  await page.goto(`${BASE}/`);
  
  // Click a service CTA
  await page.click('a[href*="/services/design"]');
  await page.waitForLoadState('networkidle');
  const serviceUrl = page.url();
  console.log(`✅ Service CTA works: ${serviceUrl}`);
  
  // Go back and test industry CTA
  await page.goto(`${BASE}/`);
  await page.click('a[href*="/industries/construction"]');
  await page.waitForLoadState('networkidle');
  const industryUrl = page.url();
  console.log(`✅ Industry CTA works: ${industryUrl}`);

  await browser.close();
  console.log("\n🎉 VBOD smoke test complete!");
  console.log("=".repeat(50));
})();
