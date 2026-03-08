/**
 * prerender.cjs
 * Custom Puppeteer-based pre-rendering script.
 * Spins up a local static server for dist/, visits each route with headless Chrome,
 * waits for React to render, captures the HTML, and writes it back to dist/.
 */

const puppeteer = require("puppeteer");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 45680;
const CONCURRENCY = 4;

// ── Route list ──────────────────────────────────────────────────────────────

function getRoutes() {
  const dataDir = path.join(ROOT, "src", "data");
  const blogFiles = [
    "blogPosts.ts",
    "blogPosts-batch2.ts",
    "blogPosts-batch3.ts",
    "blogPosts-batch4.ts",
  ];

  const slugs = new Set();
  for (const file of blogFiles) {
    const fp = path.join(dataDir, file);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, "utf-8");
    for (const m of content.matchAll(/slug:\s*["']([^"']+)["']/g)) {
      slugs.add(m[1]);
    }
  }

  return [
    "/",
    "/blog",
    "/blog/topic/phone-systems-voip",
    "/blog/topic/business-hardware",
    "/blog/topic/endpoint-security",
    "/blog/topic/managed-detection-response",
    "/blog/topic/backup-disaster-recovery",
    "/blog/topic/patch-management",
    "/blog/topic/cybersecurity-smb",
    "/blog/topic/it-buying-guide",
    "/new-york",
    "/los-angeles",
    "/chicago",
    "/dallas",
    "/atlanta",
    "/miami",
    "/houston",
    "/san-francisco",
    ...[...slugs].map((s) => `/blog/${s}`),
  ];
}

// ── Static file server (SPA fallback to index.html) ─────────────────────────

function createServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  return http.createServer((req, res) => {
    let filePath = path.join(DIST, req.url === "/" ? "index.html" : req.url);

    // If the file doesn't exist, serve index.html (SPA fallback)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, "index.html");
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}

// ── Pre-render a single route ───────────────────────────────────────────────

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route}`;

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for React to render content inside #root
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        return root && root.children.length > 0;
      },
      { timeout: 15000 }
    );

    // Small extra delay for any async rendering
    await new Promise((r) => setTimeout(r, 500));

    const html = await page.content();

    // Determine output path
    let outputPath;
    if (route === "/") {
      outputPath = path.join(DIST, "index.html");
    } else {
      // /blog/some-slug -> dist/blog/some-slug/index.html
      const dir = path.join(DIST, route);
      fs.mkdirSync(dir, { recursive: true });
      outputPath = path.join(dir, "index.html");
    }

    fs.writeFileSync(outputPath, html);
    return { route, status: "ok" };
  } catch (err) {
    return { route, status: "error", error: err.message };
  } finally {
    await page.close();
  }
}

// ── Sitemap generation ──────────────────────────────────────────────────────

function generateSitemap() {
  const dataDir = path.join(ROOT, "src", "data");
  const BASE = "https://cyberstarit.com";

  // Read blog slugs and their publishedDates
  const blogFiles = [
    "blogPosts.ts",
    "blogPosts-batch2.ts",
    "blogPosts-batch3.ts",
    "blogPosts-batch4.ts",
  ];

  const articles = []; // { slug, date }
  for (const file of blogFiles) {
    const fp = path.join(dataDir, file);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, "utf-8");
    // Match slug/publishedDate pairs by finding each post block
    const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
    const dateMatches = [...content.matchAll(/publishedDate:\s*["']([^"']+)["']/g)];
    for (let i = 0; i < slugMatches.length; i++) {
      articles.push({
        slug: slugMatches[i][1],
        date: dateMatches[i] ? dateMatches[i][1] : new Date().toISOString().slice(0, 10),
      });
    }
  }

  // Read cluster slugs
  const clusterSlugs = [];
  const clusterFile = path.join(dataDir, "blogClusters.ts");
  if (fs.existsSync(clusterFile)) {
    const content = fs.readFileSync(clusterFile, "utf-8");
    for (const m of content.matchAll(/^\s*slug:\s*["']([^"']+)["']/gm)) {
      clusterSlugs.push(m[1]);
    }
  }

  // Read city slugs
  const citySlugs = [];
  const cityFile = path.join(dataDir, "cityPages.ts");
  if (fs.existsSync(cityFile)) {
    const content = fs.readFileSync(cityFile, "utf-8");
    for (const m of content.matchAll(/^\s*slug:\s*["']([^"']+)["']/gm)) {
      citySlugs.push(m[1]);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  // Build URL entries
  const urls = [];

  // Homepage and blog index
  urls.push(`  <url>\n    <loc>${BASE}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  urls.push(`  <url>\n    <loc>${BASE}/blog</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);

  // Cluster pages — /blog/topic/{slug}
  for (const slug of clusterSlugs) {
    urls.push(`  <url>\n    <loc>${BASE}/blog/topic/${slug}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  }

  // City pages — /{slug}
  for (const slug of citySlugs) {
    urls.push(`  <url>\n    <loc>${BASE}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  }

  // Blog posts — /blog/{slug}
  for (const { slug, date } of articles) {
    urls.push(`  <url>\n    <loc>${BASE}/blog/${slug}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

  const sitemapPath = path.join(DIST, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap written to ${sitemapPath} (${urls.length} URLs)`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const routes = getRoutes();
  console.log(`Pre-rendering ${routes.length} routes...`);

  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let done = 0;
  let errors = 0;

  // Process in batches
  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const batch = routes.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((route) => renderRoute(browser, route))
    );

    for (const r of results) {
      done++;
      if (r.status === "ok") {
        console.log(`  [${done}/${routes.length}] ${r.route}`);
      } else {
        errors++;
        console.error(`  [${done}/${routes.length}] FAILED ${r.route}: ${r.error}`);
      }
    }
  }

  await browser.close();
  server.close();

  // Generate sitemap.xml in dist/
  generateSitemap();

  console.log(`\nDone! ${done - errors}/${routes.length} routes pre-rendered successfully.`);
  if (errors > 0) {
    console.error(`${errors} routes failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
