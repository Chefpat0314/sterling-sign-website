// Simple smoke test without Playwright
const https = require('https');
const http = require('http');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const isHttps = BASE.startsWith('https');

const services = ["design","fabrication","installation","maintenance","permitting","project-management"];
const industries = ["construction","corporate","retail","healthcare","education","events","hospitality"];
const products = ["vinyl-banner","aluminum-sign","door-hours-decal"];

const check = (path) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE}${path}`;
    const client = isHttps ? https : http;
    
    client.get(url, (res) => {
      const ok = res.statusCode >= 200 && res.statusCode < 400;
      console.log(`${ok ? "✅" : "❌"} ${res.statusCode} ${path}`);
      resolve(ok);
    }).on('error', (err) => {
      console.log(`❌ ERROR ${path}: ${err.message}`);
      resolve(false);
    });
  });
};

(async () => {
  console.log(`🚀 Running simple smoke test on ${BASE}`);
  console.log("=".repeat(50));

  let passed = 0;
  let total = 0;

  // Homepage
  console.log("\n📄 Testing Homepage...");
  total++;
  if (await check("/")) passed++;

  // Services
  console.log("\n🔧 Testing Services...");
  for (const s of services) {
    total++;
    if (await check(`/services/${s}`)) passed++;
  }

  // Industries  
  console.log("\n🏭 Testing Industries...");
  for (const i of industries) {
    total++;
    if (await check(`/industries/${i}`)) passed++;
  }

  // Products
  console.log("\n📦 Testing Products...");
  total++;
  if (await check("/products")) passed++;
  
  for (const p of products) {
    total++;
    if (await check(`/products/${p}`)) passed++;
  }

  // RFQ
  console.log("\n📝 Testing RFQ...");
  total++;
  if (await check("/request-a-quote")) passed++;

  console.log("\n🎉 Smoke test complete!");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
  
  if (passed === total) {
    console.log("🎯 All tests passed! Production is ready.");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Check the URLs above.");
    process.exit(1);
  }
})();
