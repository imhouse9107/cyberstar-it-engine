#!/usr/bin/env node
/**
 * Cyberstar IT SEO Engine — Daily Report Generator
 * CommonJS module (.cjs) because package.json uses "type": "module"
 *
 * Reads blogPosts.ts + sitemap.xml, audits content health,
 * scores AI-citation readiness, tracks keyword rankings,
 * and outputs a branded HTML email + plain-text summary.
 */

const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────
const DOMAIN = "https://cyberstarit.com";
const BRAND = "Cyberstar IT SEO Engine";
const GSC_SUBMIT_DATE = new Date("2026-03-08");

const ROOT = path.resolve(__dirname, "..");
const BLOG_POSTS_PATH = path.join(ROOT, "src", "data", "blogPosts.ts");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const OUT_HTML = "/tmp/cyberstar-seo-report.html";
const OUT_TXT = "/tmp/cyberstar-seo-report.txt";

const CLUSTER_SLUGS = [
  "phone-systems-voip",
  "business-hardware",
  "endpoint-security",
  "managed-detection-response",
  "backup-disaster-recovery",
  "patch-management",
  "cybersecurity-smb",
  "it-buying-guide",
];

const CITY_SLUGS = [
  "new-york",
  "los-angeles",
  "chicago",
  "dallas",
  "atlanta",
  "miami",
  "houston",
  "san-francisco",
];

// ─── Keyword Database (est. monthly US search volume) ────────────────────────
const KEYWORD_DB = [
  // Phone Systems / VoIP (highest priority)
  { keyword: "best business phone system small business", volume: 2900, cluster: "phone-systems-voip", difficulty: 45 },
  { keyword: "voip vs landline business", volume: 1800, cluster: "phone-systems-voip", difficulty: 32 },
  { keyword: "how much does business phone system cost", volume: 1600, cluster: "phone-systems-voip", difficulty: 28 },
  { keyword: "best voip providers small business", volume: 1500, cluster: "phone-systems-voip", difficulty: 48 },
  { keyword: "cloud phone system small business", volume: 1200, cluster: "phone-systems-voip", difficulty: 38 },
  { keyword: "voip phone system for office", volume: 1100, cluster: "phone-systems-voip", difficulty: 35 },
  { keyword: "business phone system setup guide", volume: 880, cluster: "phone-systems-voip", difficulty: 22 },
  { keyword: "ringcentral vs nextiva", volume: 850, cluster: "phone-systems-voip", difficulty: 40 },
  { keyword: "ucaas vs voip", volume: 720, cluster: "phone-systems-voip", difficulty: 30 },
  { keyword: "hosted pbx vs voip", volume: 680, cluster: "phone-systems-voip", difficulty: 28 },
  { keyword: "voip for remote teams", volume: 640, cluster: "phone-systems-voip", difficulty: 25 },
  { keyword: "auto attendant phone system small business", volume: 590, cluster: "phone-systems-voip", difficulty: 20 },
  { keyword: "business voip cost per line", volume: 540, cluster: "phone-systems-voip", difficulty: 22 },
  { keyword: "switch from landline to voip business", volume: 480, cluster: "phone-systems-voip", difficulty: 18 },
  { keyword: "best desk phones for voip", volume: 460, cluster: "phone-systems-voip", difficulty: 30 },

  // Business Hardware
  { keyword: "best business laptops 2026", volume: 2400, cluster: "business-hardware", difficulty: 55 },
  { keyword: "it hardware for small business", volume: 900, cluster: "business-hardware", difficulty: 30 },
  { keyword: "best small business server", volume: 880, cluster: "business-hardware", difficulty: 38 },
  { keyword: "business desktop vs laptop", volume: 720, cluster: "business-hardware", difficulty: 22 },
  { keyword: "network switch for small business", volume: 680, cluster: "business-hardware", difficulty: 28 },
  { keyword: "how to set up business network", volume: 640, cluster: "business-hardware", difficulty: 25 },
  { keyword: "best firewall for small business", volume: 1300, cluster: "business-hardware", difficulty: 42 },
  { keyword: "business wifi setup guide", volume: 580, cluster: "business-hardware", difficulty: 20 },
  { keyword: "refurbished vs new business laptops", volume: 520, cluster: "business-hardware", difficulty: 18 },
  { keyword: "enterprise vs consumer hardware", volume: 440, cluster: "business-hardware", difficulty: 15 },
  { keyword: "best monitors for office work", volume: 1100, cluster: "business-hardware", difficulty: 40 },
  { keyword: "server rack setup small business", volume: 390, cluster: "business-hardware", difficulty: 20 },

  // EDR / Endpoint Security
  { keyword: "what is edr", volume: 3600, cluster: "endpoint-security", difficulty: 52 },
  { keyword: "edr vs antivirus", volume: 2100, cluster: "endpoint-security", difficulty: 38 },
  { keyword: "best endpoint protection small business", volume: 1300, cluster: "endpoint-security", difficulty: 42 },
  { keyword: "edr solutions comparison", volume: 1100, cluster: "endpoint-security", difficulty: 45 },
  { keyword: "crowdstrike vs sentinelone", volume: 980, cluster: "endpoint-security", difficulty: 48 },
  { keyword: "endpoint security best practices", volume: 880, cluster: "endpoint-security", difficulty: 35 },
  { keyword: "do small businesses need edr", volume: 720, cluster: "endpoint-security", difficulty: 22 },
  { keyword: "edr cost small business", volume: 640, cluster: "endpoint-security", difficulty: 25 },
  { keyword: "next gen antivirus vs edr", volume: 580, cluster: "endpoint-security", difficulty: 30 },
  { keyword: "ransomware protection small business", volume: 1200, cluster: "endpoint-security", difficulty: 38 },
  { keyword: "endpoint security for remote workers", volume: 540, cluster: "endpoint-security", difficulty: 28 },
  { keyword: "how edr works", volume: 480, cluster: "endpoint-security", difficulty: 20 },

  // MDR / Managed Security
  { keyword: "what is mdr cybersecurity", volume: 2900, cluster: "managed-detection-response", difficulty: 40 },
  { keyword: "mdr vs edr", volume: 1900, cluster: "managed-detection-response", difficulty: 35 },
  { keyword: "best mdr providers", volume: 1400, cluster: "managed-detection-response", difficulty: 48 },
  { keyword: "managed detection and response cost", volume: 1100, cluster: "managed-detection-response", difficulty: 32 },
  { keyword: "mdr vs siem", volume: 880, cluster: "managed-detection-response", difficulty: 30 },
  { keyword: "mdr vs mssp", volume: 780, cluster: "managed-detection-response", difficulty: 28 },
  { keyword: "do small businesses need mdr", volume: 640, cluster: "managed-detection-response", difficulty: 20 },
  { keyword: "24 7 security monitoring small business", volume: 580, cluster: "managed-detection-response", difficulty: 25 },
  { keyword: "soc as a service small business", volume: 520, cluster: "managed-detection-response", difficulty: 30 },
  { keyword: "mdr pricing per endpoint", volume: 460, cluster: "managed-detection-response", difficulty: 22 },
  { keyword: "managed security services small business", volume: 440, cluster: "managed-detection-response", difficulty: 35 },

  // Backup & Disaster Recovery
  { keyword: "best backup solution small business", volume: 1600, cluster: "backup-disaster-recovery", difficulty: 42 },
  { keyword: "disaster recovery plan small business", volume: 1100, cluster: "backup-disaster-recovery", difficulty: 35 },
  { keyword: "cloud backup vs local backup business", volume: 880, cluster: "backup-disaster-recovery", difficulty: 28 },
  { keyword: "what is rto and rpo", volume: 1400, cluster: "backup-disaster-recovery", difficulty: 30 },
  { keyword: "business continuity plan template", volume: 1200, cluster: "backup-disaster-recovery", difficulty: 45 },
  { keyword: "ransomware backup strategy", volume: 780, cluster: "backup-disaster-recovery", difficulty: 32 },
  { keyword: "3 2 1 backup rule", volume: 720, cluster: "backup-disaster-recovery", difficulty: 25 },
  { keyword: "how often should business backup data", volume: 580, cluster: "backup-disaster-recovery", difficulty: 18 },
  { keyword: "disaster recovery testing checklist", volume: 520, cluster: "backup-disaster-recovery", difficulty: 22 },
  { keyword: "best cloud backup for business", volume: 1300, cluster: "backup-disaster-recovery", difficulty: 45 },
  { keyword: "backup as a service small business", volume: 440, cluster: "backup-disaster-recovery", difficulty: 28 },
  { keyword: "immutable backup explained", volume: 390, cluster: "backup-disaster-recovery", difficulty: 20 },

  // Patch Management
  { keyword: "what is patch management", volume: 1800, cluster: "patch-management", difficulty: 35 },
  { keyword: "automated patch management", volume: 900, cluster: "patch-management", difficulty: 32 },
  { keyword: "patch management best practices", volume: 780, cluster: "patch-management", difficulty: 30 },
  { keyword: "patch management tools small business", volume: 640, cluster: "patch-management", difficulty: 28 },
  { keyword: "why is patch management important", volume: 580, cluster: "patch-management", difficulty: 20 },
  { keyword: "patch management policy template", volume: 520, cluster: "patch-management", difficulty: 25 },
  { keyword: "how to automate windows updates business", volume: 480, cluster: "patch-management", difficulty: 22 },
  { keyword: "patch management vs vulnerability management", volume: 440, cluster: "patch-management", difficulty: 28 },
  { keyword: "third party patch management", volume: 390, cluster: "patch-management", difficulty: 25 },
  { keyword: "patch management compliance", volume: 360, cluster: "patch-management", difficulty: 30 },

  // General Cybersecurity / SMB IT
  { keyword: "cybersecurity cost small business", volume: 1400, cluster: "cybersecurity-smb", difficulty: 35 },
  { keyword: "managed it vs in house", volume: 1100, cluster: "cybersecurity-smb", difficulty: 30 },
  { keyword: "cybersecurity checklist small business", volume: 980, cluster: "cybersecurity-smb", difficulty: 32 },
  { keyword: "phishing training for employees", volume: 880, cluster: "cybersecurity-smb", difficulty: 35 },
  { keyword: "how to set up mfa business", volume: 720, cluster: "cybersecurity-smb", difficulty: 22 },
  { keyword: "small business cybersecurity statistics", volume: 640, cluster: "cybersecurity-smb", difficulty: 28 },
  { keyword: "cybersecurity insurance small business", volume: 580, cluster: "cybersecurity-smb", difficulty: 32 },
  { keyword: "zero trust for small business", volume: 520, cluster: "cybersecurity-smb", difficulty: 25 },
  { keyword: "password policy best practices business", volume: 480, cluster: "cybersecurity-smb", difficulty: 22 },
  { keyword: "how to prevent data breach small business", volume: 440, cluster: "cybersecurity-smb", difficulty: 25 },
  { keyword: "security awareness training roi", volume: 390, cluster: "cybersecurity-smb", difficulty: 20 },
  { keyword: "cmmc compliance small business", volume: 360, cluster: "cybersecurity-smb", difficulty: 35 },

  // IT Buying Guides / Comparisons
  { keyword: "managed it services pricing", volume: 1600, cluster: "it-buying-guide", difficulty: 42 },
  { keyword: "how to choose an it provider", volume: 880, cluster: "it-buying-guide", difficulty: 28 },
  { keyword: "it support cost per employee", volume: 780, cluster: "it-buying-guide", difficulty: 25 },
  { keyword: "break fix vs managed it", volume: 720, cluster: "it-buying-guide", difficulty: 22 },
  { keyword: "it budget template small business", volume: 640, cluster: "it-buying-guide", difficulty: 30 },
  { keyword: "questions to ask it provider", volume: 540, cluster: "it-buying-guide", difficulty: 18 },
  { keyword: "it vendor comparison template", volume: 480, cluster: "it-buying-guide", difficulty: 20 },
  { keyword: "technology refresh cycle planning", volume: 420, cluster: "it-buying-guide", difficulty: 22 },
  { keyword: "it procurement best practices", volume: 390, cluster: "it-buying-guide", difficulty: 28 },
  { keyword: "total cost of ownership it equipment", volume: 360, cluster: "it-buying-guide", difficulty: 25 },

  // Additional keywords to round out coverage
  { keyword: "microsoft teams phone system", volume: 1100, cluster: "phone-systems-voip", difficulty: 42 },
  { keyword: "business internet phone service", volume: 680, cluster: "phone-systems-voip", difficulty: 30 },
  { keyword: "ups battery backup for server room", volume: 520, cluster: "business-hardware", difficulty: 18 },
  { keyword: "endpoint detection and response explained", volume: 480, cluster: "endpoint-security", difficulty: 22 },
  { keyword: "xdr vs edr vs mdr", volume: 880, cluster: "managed-detection-response", difficulty: 32 },
  { keyword: "offsite backup best practices", volume: 440, cluster: "backup-disaster-recovery", difficulty: 20 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readBlogPosts() {
  const posts = [];
  // Read all blog post files (main + batches)
  const postFiles = [
    BLOG_POSTS_PATH,
    path.join(path.dirname(BLOG_POSTS_PATH), 'blogPosts-batch2.ts'),
    path.join(path.dirname(BLOG_POSTS_PATH), 'blogPosts-batch3.ts'),
    path.join(path.dirname(BLOG_POSTS_PATH), 'blogPosts-batch4.ts'),
  ];

  for (const filePath of postFiles) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf-8");
    extractPostsFromSource(raw, posts);
  }
  return posts;
}

function extractPostsFromSource(raw, posts) {
  // Match slug: "..." patterns to find article boundaries
  const slugMatches = [...raw.matchAll(/slug:\s*["']([^"']+)["']/g)];
  const titleMatches = [...raw.matchAll(/title:\s*["']([^"']+)["']/g)];
  const metaMatches = [...raw.matchAll(/metaDescription:\s*["']([^"']+)["']/g)];
  const kwMatches = [...raw.matchAll(/primaryKeyword:\s*["']([^"']+)["']/g)];
  const clusterMatches = [...raw.matchAll(/cluster:\s*["']([^"']+)["']/g)];
  const contentMatches = [...raw.matchAll(/content:\s*`/g)];

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i]?.[1] || "";
    const title = titleMatches[i]?.[1] || "";
    const metaDescription = metaMatches[i]?.[1] || "";
    const primaryKeyword = kwMatches[i]?.[1] || "";
    const cluster = clusterMatches[i]?.[1] || "";
    // Extract content between backticks
    let content = "";
    if (contentMatches[i]) {
      const startIdx = contentMatches[i].index + contentMatches[i][0].length;
      const endIdx = raw.indexOf("`", startIdx);
      if (endIdx > startIdx) content = raw.substring(startIdx, endIdx);
    }
    if (slug) posts.push({ slug, title, metaDescription, primaryKeyword, cluster, publishedDate: "2026-03-08", content });
  }
}

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) return [];
  const raw = fs.readFileSync(SITEMAP_PATH, "utf-8");
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(raw)) !== null) urls.push(m[1]);
  return urls;
}

function daysSince(date) {
  return Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
}

// ─── Content Health Audit ────────────────────────────────────────────────────

function auditPosts(posts) {
  const issues = [];
  let score = 100;

  posts.forEach((p) => {
    if (!p.title || p.title.trim() === "") {
      issues.push({ slug: p.slug, issue: "Empty title", severity: "critical" });
      score -= 10;
    }
    if (!p.metaDescription || p.metaDescription.trim() === "") {
      issues.push({ slug: p.slug, issue: "Empty meta description", severity: "critical" });
      score -= 8;
    } else if (p.metaDescription.length < 50) {
      issues.push({ slug: p.slug, issue: `Short meta description (${p.metaDescription.length} chars)`, severity: "warning" });
      score -= 3;
    } else if (p.metaDescription.length > 160) {
      issues.push({ slug: p.slug, issue: `Long meta description (${p.metaDescription.length} chars — may truncate)`, severity: "warning" });
      score -= 2;
    }
    if (!p.primaryKeyword || p.primaryKeyword.trim() === "") {
      issues.push({ slug: p.slug, issue: "Empty primary keyword", severity: "critical" });
      score -= 8;
    }
    if (!p.cluster || p.cluster.trim() === "") {
      issues.push({ slug: p.slug, issue: "No cluster assigned", severity: "warning" });
      score -= 3;
    }

    // Check for double-path URLs in content
    const doublePaths = p.content.match(/\/blog\/blog\//g);
    if (doublePaths) {
      issues.push({ slug: p.slug, issue: `Double-path URLs found (${doublePaths.length}x /blog/blog/)`, severity: "critical" });
      score -= 5;
    }
  });

  // Check for orphan cluster pages (clusters with no articles)
  const populatedClusters = new Set(posts.map((p) => p.cluster));
  CLUSTER_SLUGS.forEach((cs) => {
    if (!populatedClusters.has(cs) && posts.length > 0) {
      issues.push({ slug: cs, issue: "Cluster page has no articles", severity: "info" });
      score -= 1;
    }
  });

  // Sitemap cross-check
  const sitemapUrls = readSitemapUrls();
  const sitemapSlugs = sitemapUrls
    .map((u) => u.replace(DOMAIN, "").replace(/^\//, "").replace(/\/$/, ""))
    .filter(Boolean);
  posts.forEach((p) => {
    const expected = `blog/${p.cluster}/${p.slug}`;
    if (!sitemapSlugs.includes(expected) && !sitemapSlugs.includes(`blog/${p.slug}`)) {
      issues.push({ slug: p.slug, issue: "Not in sitemap.xml", severity: "warning" });
      score -= 2;
    }
  });

  // Check internal links
  posts.forEach((p) => {
    const internalLinks = p.content.match(/\[([^\]]+)\]\(\/blog\/[^)]+\)/g) || [];
    internalLinks.forEach((link) => {
      const href = (link.match(/\]\((\/blog\/[^)]+)\)/) || [])[1];
      if (href) {
        const target = href.replace(/^\/blog\//, "").replace(/\/$/, "");
        const targetExists = posts.some(
          (pp) => pp.slug === target || `${pp.cluster}/${pp.slug}` === target
        );
        const clusterExists = CLUSTER_SLUGS.includes(target);
        if (!targetExists && !clusterExists) {
          issues.push({ slug: p.slug, issue: `Broken internal link: ${href}`, severity: "critical" });
          score -= 5;
        }
      }
    });
  });

  return { score: Math.max(0, Math.min(100, score)), issues };
}

// ─── AI Citation Readiness ───────────────────────────────────────────────────

function aiCitationScore(posts) {
  if (posts.length === 0) return { score: 0, breakdown: { faq: 0, tables: 0, quotes: 0, sources: 0, steps: 0 } };

  let faq = 0, tables = 0, quotes = 0, sources = 0, steps = 0;

  posts.forEach((p) => {
    const c = p.content;
    if (/##.*FAQ/i.test(c) || /##.*frequently asked/i.test(c) || /\*\*Q:/i.test(c)) faq++;
    if (/\|.*\|.*\|/g.test(c)) tables++;
    if (/>\s*.+/g.test(c) || /\*\*"/g.test(c)) quotes++;
    if (/source/i.test(c) || /according to/i.test(c) || /\[\d+\]/g.test(c)) sources++;
    if (/step\s*\d/i.test(c) || /##.*step/i.test(c) || /1\.\s/g.test(c)) steps++;
  });

  const total = posts.length;
  const pctFaq = (faq / total) * 100;
  const pctTables = (tables / total) * 100;
  const pctQuotes = (quotes / total) * 100;
  const pctSources = (sources / total) * 100;
  const pctSteps = (steps / total) * 100;

  // Weighted score (out of 100)
  const score = Math.round(
    pctFaq * 0.25 + pctTables * 0.20 + pctQuotes * 0.15 + pctSources * 0.25 + pctSteps * 0.15
  );

  return { score: Math.min(100, score), breakdown: { faq, tables, quotes, sources, steps } };
}

// ─── Cluster Summary ─────────────────────────────────────────────────────────

function clusterSummary(posts) {
  return CLUSTER_SLUGS.map((slug) => {
    const articles = posts.filter((p) => p.cluster === slug);
    const clusterKeywords = KEYWORD_DB.filter((k) => k.cluster === slug);
    const totalVolume = clusterKeywords.reduce((s, k) => s + k.volume, 0);
    return {
      slug,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      articleCount: articles.length,
      keywordCount: clusterKeywords.length,
      totalSearchVolume: totalVolume,
    };
  });
}

// ─── Ranking Projections ─────────────────────────────────────────────────────

function rankingProjections() {
  const gscAge = daysSince(GSC_SUBMIT_DATE);
  const milestones = [
    { day: 0, label: "GSC Submitted", status: gscAge >= 0 ? "complete" : "pending", detail: "Sitemap submitted to Google Search Console" },
    { day: 7, label: "Indexing Begins", status: gscAge >= 7 ? "complete" : "pending", detail: "Google starts crawling and indexing pages" },
    { day: 30, label: "Initial Rankings", status: gscAge >= 30 ? "complete" : "pending", detail: "Low-competition keywords start appearing in SERPs (page 3-5)" },
    { day: 60, label: "Content Traction", status: gscAge >= 60 ? "complete" : "pending", detail: "Medium-difficulty keywords gain traction, AI crawlers discover content" },
    { day: 90, label: "Authority Building", status: gscAge >= 90 ? "complete" : "pending", detail: "Domain authority starts building, page 1-2 for easy keywords" },
    { day: 120, label: "Competitive Keywords", status: gscAge >= 120 ? "complete" : "pending", detail: "Harder keywords start moving, brand queries appear" },
    { day: 180, label: "Steady Growth", status: gscAge >= 180 ? "complete" : "pending", detail: "Consistent organic traffic, AI citations increase" },
    { day: 365, label: "Full Maturity", status: gscAge >= 365 ? "complete" : "pending", detail: "Established authority, page 1 for primary clusters" },
  ];
  return { gscAge, milestones };
}

// ─── HTML Report Builder ─────────────────────────────────────────────────────

function buildHtml(posts, audit, aiScore, clusters, projections) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const scoreColor = audit.score >= 80 ? "#10b981" : audit.score >= 60 ? "#f59e0b" : "#ef4444";
  const aiColor = aiScore.score >= 70 ? "#10b981" : aiScore.score >= 40 ? "#f59e0b" : "#ef4444";

  const totalSearchVolume = KEYWORD_DB.reduce((s, k) => s + k.volume, 0);
  const avgDifficulty = Math.round(KEYWORD_DB.reduce((s, k) => s + k.difficulty, 0) / KEYWORD_DB.length);

  const criticalIssues = audit.issues.filter((i) => i.severity === "critical");
  const warnings = audit.issues.filter((i) => i.severity === "warning");
  const infos = audit.issues.filter((i) => i.severity === "info");

  // Priority actions
  const actions = [];
  if (posts.length === 0) actions.push("Publish first article to start building organic authority");
  if (posts.length < 5) actions.push("Target 5+ articles within first 30 days for initial indexing momentum");
  CLUSTER_SLUGS.forEach((cs) => {
    if (!posts.some((p) => p.cluster === cs)) {
      actions.push(`Write first article for "${cs.replace(/-/g, " ")}" cluster`);
    }
  });
  if (criticalIssues.length > 0) actions.push(`Fix ${criticalIssues.length} critical content issue(s)`);
  if (projections.gscAge < 7) actions.push("Submit sitemap to Google Search Console if not done");
  if (projections.gscAge < 30) actions.push("Build initial backlinks from relevant IT directories and forums");
  actions.push("Ensure all articles have FAQ sections for AI citation readiness");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND} — Daily Report</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:720px;margin:0 auto;background:#ffffff;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0ea5e9 100%);padding:40px 32px;text-align:center;">
      <h1 style="color:#ffffff;font-size:28px;margin:0 0 4px 0;letter-spacing:-0.5px;">${BRAND}</h1>
      <p style="color:#94a3b8;font-size:14px;margin:0;">Daily SEO Intelligence Report</p>
      <p style="color:#64748b;font-size:12px;margin:8px 0 0 0;">${dateStr}</p>
    </div>

    <!-- Health Score Hero -->
    <div style="text-align:center;padding:32px 24px;background:#fafbfc;border-bottom:1px solid #e5e7eb;">
      <div style="display:inline-block;width:120px;height:120px;border-radius:50%;border:6px solid ${scoreColor};line-height:108px;font-size:48px;font-weight:800;color:${scoreColor};">
        ${audit.score}
      </div>
      <p style="color:#374151;font-size:18px;font-weight:600;margin:12px 0 4px 0;">Content Health Score</p>
      <p style="color:#6b7280;font-size:13px;margin:0;">
        ${audit.score >= 80 ? "Excellent — your content is well-optimized" : audit.score >= 60 ? "Good — a few issues to address" : "Needs attention — fix critical issues first"}
      </p>
    </div>

    <!-- KPI Cards -->
    <div style="padding:24px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      ${[
        { label: "Articles Published", value: posts.length, icon: "&#128221;" },
        { label: "Clusters Active", value: new Set(posts.map((p) => p.cluster)).size + "/" + CLUSTER_SLUGS.length, icon: "&#128230;" },
        { label: "Keywords Tracked", value: KEYWORD_DB.length, icon: "&#128270;" },
        { label: "Total Search Volume", value: totalSearchVolume.toLocaleString() + "/mo", icon: "&#128200;" },
        { label: "Avg Keyword Difficulty", value: avgDifficulty + "/100", icon: "&#127919;" },
        { label: "GSC Age", value: projections.gscAge + " days", icon: "&#128197;" },
        { label: "AI Citation Score", value: aiScore.score + "/100", icon: "&#129302;" },
        { label: "Critical Issues", value: criticalIssues.length, icon: "&#9888;&#65039;" },
      ]
        .map(
          (kpi) => `
        <div style="flex:1 1 140px;max-width:160px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:24px;margin-bottom:4px;">${kpi.icon}</div>
          <div style="font-size:24px;font-weight:700;color:#111827;">${kpi.value}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${kpi.label}</div>
        </div>`
        )
        .join("")}
    </div>

    <!-- Keyword Rankings Table -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Keyword Rankings Database</h2>
      <p style="font-size:13px;color:#6b7280;margin:0 0 12px 0;">Tracking ${KEYWORD_DB.length} keywords across ${CLUSTER_SLUGS.length} clusters &bull; Total addressable volume: ${totalSearchVolume.toLocaleString()}/mo</p>

      ${CLUSTER_SLUGS.map((cs) => {
        const kws = KEYWORD_DB.filter((k) => k.cluster === cs);
        if (kws.length === 0) return "";
        const clusterTitle = cs.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const clusterVolume = kws.reduce((s, k) => s + k.volume, 0);
        return `
        <div style="margin-bottom:20px;">
          <h3 style="font-size:14px;color:#1e3a5f;margin:0 0 8px 0;">${clusterTitle} <span style="color:#6b7280;font-weight:400;">(${clusterVolume.toLocaleString()}/mo total)</span></h3>
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <tr style="background:#f1f5f9;">
              <th style="text-align:left;padding:6px 8px;color:#374151;border-bottom:1px solid #e5e7eb;">Keyword</th>
              <th style="text-align:right;padding:6px 8px;color:#374151;border-bottom:1px solid #e5e7eb;">Volume</th>
              <th style="text-align:right;padding:6px 8px;color:#374151;border-bottom:1px solid #e5e7eb;">Difficulty</th>
              <th style="text-align:center;padding:6px 8px;color:#374151;border-bottom:1px solid #e5e7eb;">Covered</th>
            </tr>
            ${kws
              .sort((a, b) => b.volume - a.volume)
              .map((k) => {
                const covered = posts.some(
                  (p) => p.primaryKeyword === k.keyword || (p.content && p.content.toLowerCase().includes(k.keyword.toLowerCase()))
                );
                const diffColor = k.difficulty >= 40 ? "#ef4444" : k.difficulty >= 25 ? "#f59e0b" : "#10b981";
                return `
              <tr>
                <td style="padding:5px 8px;border-bottom:1px solid #f3f4f6;color:#374151;">${k.keyword}</td>
                <td style="padding:5px 8px;border-bottom:1px solid #f3f4f6;color:#374151;text-align:right;">${k.volume.toLocaleString()}</td>
                <td style="padding:5px 8px;border-bottom:1px solid #f3f4f6;text-align:right;"><span style="color:${diffColor};font-weight:600;">${k.difficulty}</span></td>
                <td style="padding:5px 8px;border-bottom:1px solid #f3f4f6;text-align:center;">${covered ? '<span style="color:#10b981;">&#10003;</span>' : '<span style="color:#d1d5db;">&#8212;</span>'}</td>
              </tr>`;
              })
              .join("")}
          </table>
        </div>`;
      }).join("")}
    </div>

    <!-- Cluster Summary -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Cluster Summary</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#f1f5f9;">
          <th style="text-align:left;padding:8px;color:#374151;">Cluster</th>
          <th style="text-align:center;padding:8px;color:#374151;">Articles</th>
          <th style="text-align:center;padding:8px;color:#374151;">Keywords</th>
          <th style="text-align:right;padding:8px;color:#374151;">Search Volume</th>
        </tr>
        ${clusters
          .map(
            (c) => `
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:8px;color:#374151;font-weight:500;">${c.title}</td>
            <td style="padding:8px;text-align:center;color:${c.articleCount > 0 ? "#10b981" : "#ef4444"};font-weight:600;">${c.articleCount}</td>
            <td style="padding:8px;text-align:center;color:#6b7280;">${c.keywordCount}</td>
            <td style="padding:8px;text-align:right;color:#374151;">${c.totalSearchVolume.toLocaleString()}/mo</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>

    <!-- Ranking Projections Timeline -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 4px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Ranking Projections</h2>
      <p style="font-size:13px;color:#6b7280;margin:0 0 16px 0;">GSC submitted ${projections.gscAge} day(s) ago &bull; ${GSC_SUBMIT_DATE.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
      ${projections.milestones
        .map(
          (m) => `
        <div style="display:flex;align-items:flex-start;margin-bottom:12px;">
          <div style="flex:0 0 28px;text-align:center;margin-right:12px;">
            <div style="width:20px;height:20px;border-radius:50%;background:${m.status === "complete" ? "#10b981" : "#e5e7eb"};margin:0 auto;display:flex;align-items:center;justify-content:center;">
              ${m.status === "complete" ? '<span style="color:#fff;font-size:12px;">&#10003;</span>' : '<span style="color:#9ca3af;font-size:10px;">&#9679;</span>'}
            </div>
            ${m.day < 365 ? '<div style="width:2px;height:16px;background:#e5e7eb;margin:2px auto 0;"></div>' : ""}
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;color:${m.status === "complete" ? "#10b981" : "#374151"};">Day ${m.day}: ${m.label}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:1px;">${m.detail}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>

    <!-- Content Health Audit -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Content Health Audit</h2>
      ${audit.issues.length === 0
        ? '<p style="font-size:13px;color:#10b981;font-weight:500;">No issues found — all content passes audit checks.</p>'
        : `
        ${criticalIssues.length > 0 ? `<div style="margin-bottom:12px;"><h3 style="font-size:13px;color:#ef4444;margin:0 0 6px 0;">Critical (${criticalIssues.length})</h3>${criticalIssues.map((i) => `<div style="font-size:12px;color:#374151;padding:4px 0;border-bottom:1px solid #fef2f2;">&#9888; <strong>${i.slug}</strong>: ${i.issue}</div>`).join("")}</div>` : ""}
        ${warnings.length > 0 ? `<div style="margin-bottom:12px;"><h3 style="font-size:13px;color:#f59e0b;margin:0 0 6px 0;">Warnings (${warnings.length})</h3>${warnings.map((i) => `<div style="font-size:12px;color:#374151;padding:4px 0;border-bottom:1px solid #fffbeb;">&#9670; <strong>${i.slug}</strong>: ${i.issue}</div>`).join("")}</div>` : ""}
        ${infos.length > 0 ? `<div style="margin-bottom:12px;"><h3 style="font-size:13px;color:#6b7280;margin:0 0 6px 0;">Info (${infos.length})</h3>${infos.map((i) => `<div style="font-size:12px;color:#6b7280;padding:4px 0;border-bottom:1px solid #f3f4f6;">&#8226; <strong>${i.slug}</strong>: ${i.issue}</div>`).join("")}</div>` : ""}
      `}
    </div>

    <!-- AI Citation Readiness -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">AI Citation Readiness</h2>
      <div style="text-align:center;margin-bottom:16px;">
        <div style="display:inline-block;width:80px;height:80px;border-radius:50%;border:4px solid ${aiColor};line-height:72px;font-size:32px;font-weight:700;color:${aiColor};">
          ${aiScore.score}
        </div>
        <p style="font-size:13px;color:#6b7280;margin:8px 0 0 0;">
          ${aiScore.score >= 70 ? "Strong — content is well-structured for AI citation" : aiScore.score >= 40 ? "Moderate — add more structured elements" : posts.length === 0 ? "No articles published yet" : "Low — prioritize FAQ sections, data tables, and cited sources"}
        </p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#f1f5f9;">
          <th style="text-align:left;padding:8px;color:#374151;">Element</th>
          <th style="text-align:center;padding:8px;color:#374151;">Articles With</th>
          <th style="text-align:center;padding:8px;color:#374151;">Coverage</th>
        </tr>
        ${[
          { label: "FAQ Sections", count: aiScore.breakdown.faq },
          { label: "Data Tables", count: aiScore.breakdown.tables },
          { label: "Quote Blocks", count: aiScore.breakdown.quotes },
          { label: "Sources Cited", count: aiScore.breakdown.sources },
          { label: "Step-by-Step Guides", count: aiScore.breakdown.steps },
        ]
          .map(
            (e) => `
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:8px;color:#374151;">${e.label}</td>
            <td style="padding:8px;text-align:center;color:#374151;">${e.count}/${posts.length}</td>
            <td style="padding:8px;text-align:center;color:${posts.length > 0 && e.count / posts.length >= 0.5 ? "#10b981" : "#f59e0b"};">${posts.length > 0 ? Math.round((e.count / posts.length) * 100) : 0}%</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>

    <!-- Priority Actions -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Priority Actions</h2>
      ${actions
        .slice(0, 8)
        .map(
          (a, i) => `
        <div style="display:flex;align-items:flex-start;margin-bottom:10px;">
          <div style="flex:0 0 24px;width:24px;height:24px;border-radius:50%;background:${i < 3 ? "#0ea5e9" : "#e5e7eb"};color:${i < 3 ? "#fff" : "#6b7280"};font-size:12px;font-weight:600;text-align:center;line-height:24px;margin-right:10px;">${i + 1}</div>
          <div style="font-size:13px;color:#374151;line-height:24px;">${a}</div>
        </div>`
        )
        .join("")}
    </div>

    <!-- Recent Activity -->
    <div style="padding:24px;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px 0;padding-bottom:8px;border-bottom:2px solid #0ea5e9;">Recent Activity</h2>
      ${posts.length === 0
        ? '<p style="font-size:13px;color:#6b7280;">No articles published yet. Your first article will appear here.</p>'
        : posts
            .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
            .slice(0, 5)
            .map(
              (p) => `
          <div style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
            <div style="font-size:13px;font-weight:500;color:#374151;">${p.title}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px;">
              /${p.cluster}/${p.slug} &bull; ${p.publishedDate} &bull; Keyword: "${p.primaryKeyword}"
            </div>
          </div>`
            )
            .join("")}
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:24px 32px;text-align:center;">
      <p style="color:#64748b;font-size:12px;margin:0 0 4px 0;">${BRAND} &bull; cyberstarit.com</p>
      <p style="color:#475569;font-size:11px;margin:0;">Automated daily report &bull; ${dateStr}</p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Plain Text Report ───────────────────────────────────────────────────────

function buildPlainText(posts, audit, aiScore, clusters, projections) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const totalVolume = KEYWORD_DB.reduce((s, k) => s + k.volume, 0);

  let txt = `
${"=".repeat(60)}
${BRAND} — Daily SEO Report
${dateStr}
${"=".repeat(60)}

HEALTH SCORE: ${audit.score}/100
AI CITATION SCORE: ${aiScore.score}/100
ARTICLES PUBLISHED: ${posts.length}
CLUSTERS ACTIVE: ${new Set(posts.map((p) => p.cluster)).size}/${CLUSTER_SLUGS.length}
KEYWORDS TRACKED: ${KEYWORD_DB.length}
TOTAL SEARCH VOLUME: ${totalVolume.toLocaleString()}/mo
GSC AGE: ${projections.gscAge} days

${"-".repeat(60)}
CLUSTER SUMMARY
${"-".repeat(60)}
${clusters.map((c) => `  ${c.title.padEnd(35)} ${String(c.articleCount).padStart(3)} articles  ${c.totalSearchVolume.toLocaleString().padStart(8)}/mo`).join("\n")}

${"-".repeat(60)}
KEYWORD RANKINGS (Top 20 by Volume)
${"-".repeat(60)}
${KEYWORD_DB.sort((a, b) => b.volume - a.volume)
  .slice(0, 20)
  .map((k) => `  ${k.keyword.padEnd(45)} ${String(k.volume).padStart(5)}/mo  KD:${String(k.difficulty).padStart(3)}`)
  .join("\n")}

${"-".repeat(60)}
RANKING PROJECTIONS (GSC Age: ${projections.gscAge} days)
${"-".repeat(60)}
${projections.milestones.map((m) => `  [${m.status === "complete" ? "X" : " "}] Day ${String(m.day).padStart(3)}: ${m.label} — ${m.detail}`).join("\n")}

${"-".repeat(60)}
CONTENT HEALTH ISSUES (${audit.issues.length})
${"-".repeat(60)}
${audit.issues.length === 0 ? "  No issues found." : audit.issues.map((i) => `  [${i.severity.toUpperCase()}] ${i.slug}: ${i.issue}`).join("\n")}

${"-".repeat(60)}
AI CITATION READINESS
${"-".repeat(60)}
  FAQ Sections:       ${aiScore.breakdown.faq}/${posts.length}
  Data Tables:        ${aiScore.breakdown.tables}/${posts.length}
  Quote Blocks:       ${aiScore.breakdown.quotes}/${posts.length}
  Sources Cited:      ${aiScore.breakdown.sources}/${posts.length}
  Step-by-Step Guides: ${aiScore.breakdown.steps}/${posts.length}

${"=".repeat(60)}
End of Report
${"=".repeat(60)}
`;

  return txt.trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log(`[${BRAND}] Generating daily SEO report...`);

  const posts = readBlogPosts();
  console.log(`  Found ${posts.length} blog post(s)`);

  const audit = auditPosts(posts);
  console.log(`  Health score: ${audit.score}/100 (${audit.issues.length} issues)`);

  const aiScore = aiCitationScore(posts);
  console.log(`  AI citation score: ${aiScore.score}/100`);

  const clusters = clusterSummary(posts);
  const projections = rankingProjections();
  console.log(`  GSC age: ${projections.gscAge} days`);

  const html = buildHtml(posts, audit, aiScore, clusters, projections);
  const txt = buildPlainText(posts, audit, aiScore, clusters, projections);

  fs.writeFileSync(OUT_HTML, html, "utf-8");
  fs.writeFileSync(OUT_TXT, txt, "utf-8");

  console.log(`  HTML report: ${OUT_HTML}`);
  console.log(`  Text report: ${OUT_TXT}`);
  console.log(`  Done.`);

  // Output score for GitHub Actions (can be captured)
  console.log(`::set-output name=health_score::${audit.score}`);
}

main();
