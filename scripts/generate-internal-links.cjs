#!/usr/bin/env node
/**
 * Cyberstar IT — Internal Link Generator
 * Reads all blog articles (main + batch2-6), matches by cluster + keyword overlap,
 * and injects 2-3 internal links as a "Related Articles" section.
 *
 * Usage: node scripts/generate-internal-links.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const REPORT_OUT = path.join(ROOT, 'internal-links-report.txt');
const DRY_RUN = process.argv.includes('--dry-run');

const BATCH_FILES = [
  'blogPosts.ts',
  'blogPosts-batch2.ts',
  'blogPosts-batch3.ts',
  'blogPosts-batch4.ts',
  'blogPosts-batch5.ts',
  'blogPosts-batch6.ts',
];

// ── Extract articles from a source file ──
function extractArticles(source) {
  const articles = [];
  const slugs = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const titles = [...source.matchAll(/title:\s*["']([^"']*?)["']/g)].map(m => m[1]);
  const keywords = [...source.matchAll(/primaryKeyword:\s*["']([^"']*?)["']/g)].map(m => m[1]);
  const clusters = [...source.matchAll(/cluster:\s*["']([^"']*?)["']/g)].map(m => m[1]);

  for (let i = 0; i < slugs.length; i++) {
    articles.push({
      slug: slugs[i],
      title: titles[i] || '',
      primaryKeyword: keywords[i] || '',
      cluster: clusters[i] || '',
    });
  }
  return articles;
}

// ── Read all articles from all batch files ──
function readAllArticles() {
  const all = [];
  for (const file of BATCH_FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const source = fs.readFileSync(filePath, 'utf8');
    all.push(...extractArticles(source));
  }
  return all;
}

// ── Compute keyword overlap score ──
function overlapScore(a, b) {
  if (a.slug === b.slug) return -1;
  let score = 0;
  if (a.cluster && a.cluster === b.cluster) score += 3;

  const aWords = new Set((a.primaryKeyword + ' ' + a.title).toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const bWords = new Set((b.primaryKeyword + ' ' + b.title).toLowerCase().split(/\s+/).filter(w => w.length > 3));
  for (const w of aWords) {
    if (bWords.has(w)) score += 1;
  }
  return score;
}

// ── Pick anchor text ──
function anchorText(target) {
  const t = target.title;
  if (t.length <= 60) return t;
  if (target.primaryKeyword && target.primaryKeyword.length <= 60) return target.primaryKeyword;
  return t.substring(0, 57) + '...';
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Main ──
function main() {
  console.log('[Cyberstar Internal Links] Reading articles...');
  const articles = readAllArticles();
  console.log(`  Found ${articles.length} articles`);

  // Build link recommendations
  const recommendations = [];
  const linkMap = new Map();

  for (const article of articles) {
    const scored = articles
      .map(b => ({ target: b, score: overlapScore(article, b) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    linkMap.set(article.slug, scored.map(s => ({
      targetSlug: s.target.slug,
      anchor: anchorText(s.target),
      score: s.score,
    })));

    for (const s of scored) {
      recommendations.push({
        from: article.slug,
        to: s.target.slug,
        anchor: anchorText(s.target),
        score: s.score,
      });
    }
  }

  // ── Generate report ──
  let report = `CYBERSTAR IT — INTERNAL LINK REPORT\nGenerated: ${new Date().toISOString()}\nArticles: ${articles.length}\nRecommended links: ${recommendations.length}\n\n`;

  for (const article of articles) {
    const links = linkMap.get(article.slug) || [];
    if (links.length === 0) continue;
    report += `\n${article.slug}\n`;
    for (const l of links) {
      report += `  → ${l.targetSlug} (score: ${l.score}) anchor: "${l.anchor}"\n`;
    }
  }

  fs.writeFileSync(REPORT_OUT, report);
  console.log(`  Report: ${REPORT_OUT}`);

  if (DRY_RUN) {
    console.log('  [DRY RUN] No files modified.');
    return;
  }

  // ── Inject into each batch file ──
  let totalInjected = 0;

  for (const file of BATCH_FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    let source = fs.readFileSync(filePath, 'utf8');
    const fileArticles = extractArticles(source);
    let injected = 0;

    for (const article of fileArticles) {
      const links = linkMap.get(article.slug) || [];
      if (links.length === 0) continue;

      const relatedPattern = new RegExp(`(slug:\\s*["']${escapeRegex(article.slug)}["'][\\s\\S]*?content:\\s*\`)([\\s\\S]*?)(\`)`);
      const match = source.match(relatedPattern);
      if (!match) continue;

      const content = match[2];
      if (content.includes('## Related Articles') || content.includes('## Further Reading')) continue;

      const relatedSection = '\n\n---\n\n## Related Articles\n\n' +
        links.map(l => `- [${l.anchor}](/blog/${l.targetSlug})`).join('\n') +
        '\n';

      source = source.replace(relatedPattern, `$1${content}${relatedSection}$3`);
      injected++;
    }

    if (injected > 0) {
      fs.writeFileSync(filePath, source);
      console.log(`  ${file}: injected into ${injected} articles`);
      totalInjected += injected;
    }
  }

  console.log(`  Total injected: ${totalInjected} articles`);
  console.log('  Done.');
}

main();
