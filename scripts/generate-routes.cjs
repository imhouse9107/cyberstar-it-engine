/**
 * generate-routes.cjs
 * Extracts all blog post slugs from data files and updates package.json
 * with the full list of routes for react-snap pre-rendering.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

// Files containing blog posts
const BLOG_FILES = [
  "blogPosts.ts",
  "blogPosts-batch2.ts",
  "blogPosts-batch3.ts",
  "blogPosts-batch4.ts",
];

// Extract slugs via regex from all blog post files
function extractSlugs() {
  const slugs = new Set();

  for (const file of BLOG_FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${file} not found, skipping`);
      continue;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    // Match slug: "some-slug" patterns
    const matches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
    for (const match of matches) {
      slugs.add(match[1]);
    }
  }

  return [...slugs];
}

// Static routes
const staticRoutes = [
  "/",
  "/blog",
];

// Cluster routes
const clusterRoutes = [
  "/blog/topic/phone-systems-voip",
  "/blog/topic/business-hardware",
  "/blog/topic/endpoint-security",
  "/blog/topic/managed-detection-response",
  "/blog/topic/backup-disaster-recovery",
  "/blog/topic/patch-management",
  "/blog/topic/cybersecurity-smb",
  "/blog/topic/it-buying-guide",
];

// City routes
const cityRoutes = [
  "/new-york",
  "/los-angeles",
  "/chicago",
  "/dallas",
  "/atlanta",
  "/miami",
  "/houston",
  "/san-francisco",
];

// Build full route list
const blogSlugs = extractSlugs();
const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

const allRoutes = [
  ...staticRoutes,
  ...clusterRoutes,
  ...cityRoutes,
  ...blogRoutes,
];

console.log(`Found ${blogSlugs.length} blog post slugs`);
console.log(`Total routes to pre-render: ${allRoutes.length}`);

// Update package.json
const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

pkg.reactSnap = {
  include: allRoutes,
  headless: true,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  skipThirdPartyRequests: true,
  crawl: false,
  concurrency: 4,
  fixInsertionPoint: true,
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("Updated package.json with reactSnap config");
console.log("\nRoutes:");
allRoutes.forEach((r) => console.log(`  ${r}`));
