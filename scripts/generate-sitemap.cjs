#!/usr/bin/env node
/**
 * Cyberstar IT — Sitemap Generator
 * Reads all blog post files, extracts slugs + dates,
 * and writes a complete sitemap.xml to public/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'https://cyberstarit.com';

const CLUSTER_SLUGS = [
  'phone-systems-voip',
  'business-hardware',
  'endpoint-security',
  'managed-detection-response',
  'backup-disaster-recovery',
  'patch-management',
  'cybersecurity-smb',
  'it-buying-guide',
];

const CITY_SLUGS = [
  'new-york', 'los-angeles', 'chicago', 'dallas',
  'atlanta', 'miami', 'houston', 'san-francisco',
];

const BLOG_FILES = [
  'src/data/blogPosts.ts',
  'src/data/blogPosts-batch2.ts',
  'src/data/blogPosts-batch3.ts',
  'src/data/blogPosts-batch4.ts',
  'src/data/blogPosts-batch5.ts',
  'src/data/blogPosts-batch6.ts',
];

function extractPosts() {
  const posts = [];
  for (const file of BLOG_FILES) {
    const fp = path.join(ROOT, file);
    if (!fs.existsSync(fp)) continue;
    const raw = fs.readFileSync(fp, 'utf-8');
    const slugMatches = [...raw.matchAll(/slug:\s*["']([^"']+)["']/g)];
    const dateMatches = [...raw.matchAll(/publishedDate:\s*["']([^"']+)["']/g)];

    for (let i = 0; i < slugMatches.length; i++) {
      const slug = slugMatches[i][1];
      if (slug === 'string') continue;
      const date = dateMatches[i] ? dateMatches[i][1] : '2026-03-08';
      posts.push({ slug, date });
    }
  }
  return posts;
}

function buildXml(posts) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  xml += `  <url>\n    <loc>${DOMAIN}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${DOMAIN}/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  // City pages
  for (const city of CITY_SLUGS) {
    xml += `  <url>\n    <loc>${DOMAIN}/${city}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // Cluster pages
  for (const slug of CLUSTER_SLUGS) {
    xml += `  <url>\n    <loc>${DOMAIN}/blog/topic/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // Blog posts
  for (const post of posts) {
    xml += `  <url>\n    <loc>${DOMAIN}/blog/${post.slug}</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }

  xml += '</urlset>\n';
  return xml;
}

const posts = extractPosts();
const xml = buildXml(posts);
const outputPath = path.join(ROOT, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf-8');

const totalUrls = 2 + CITY_SLUGS.length + CLUSTER_SLUGS.length + posts.length;
console.log(`Sitemap rebuilt: ${totalUrls} URLs (${posts.length} articles) -> public/sitemap.xml`);
