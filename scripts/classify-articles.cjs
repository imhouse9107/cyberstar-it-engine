#!/usr/bin/env node
/**
 * Cyberstar IT — Article Funnel Stage Classifier
 * Auto-classifies articles into buying stages based on keyword signals.
 * Adds `buyingStage` field to each article across all batch files.
 *
 * Usage: node scripts/classify-articles.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const DRY_RUN = process.argv.includes('--dry-run');

const BATCH_FILES = [
  'blogPosts.ts',
  'blogPosts-batch2.ts',
  'blogPosts-batch3.ts',
  'blogPosts-batch4.ts',
  'blogPosts-batch5.ts',
  'blogPosts-batch6.ts',
];

// ── Classification rules (checked in priority order) ──
const RULES = [
  {
    stage: 'decision',
    patterns: [
      /pricing/i, /cost/i, /price/i, /review/i, /near me/i, /worth it/i,
      /alternative/i, /\bvs\b/i, /roi\b/i, /buy/i, /how much/i,
    ],
    clusterHints: ['it-buying-guide'],
  },
  {
    stage: 'consideration',
    patterns: [
      /\bbest\b/i, /comparison/i, /how to choose/i, /which\b/i, /top \d/i,
      /pros and cons/i, /vs\b/i, /framework/i, /benchmark/i,
    ],
    clusterHints: [],
  },
  {
    stage: 'retention',
    patterns: [
      /onboarding/i, /training/i, /scaling/i, /retention/i, /compliance/i,
      /manage/i, /best practices/i, /checklist/i, /policy/i, /automate/i,
    ],
    clusterHints: ['patch-management'],
  },
  {
    stage: 'awareness',
    patterns: [
      /what is/i, /guide/i, /explained/i, /definition/i, /introduction/i,
      /101\b/i, /statistics/i, /how does/i, /overview/i,
    ],
    clusterHints: [],
  },
];

function classify(article) {
  const text = `${article.title} ${article.primaryKeyword} ${article.cluster}`.toLowerCase();

  for (const rule of RULES) {
    if (rule.clusterHints.some(h => article.cluster === h)) return rule.stage;
  }
  for (const rule of RULES) {
    for (const pat of rule.patterns) {
      if (pat.test(text)) return rule.stage;
    }
  }
  return 'awareness';
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractArticles(source) {
  const slugs = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const titles = [...source.matchAll(/title:\s*["']([^"']*?)["']/g)].map(m => m[1]);
  const keywords = [...source.matchAll(/primaryKeyword:\s*["']([^"']*?)["']/g)].map(m => m[1]);
  const clusters = [...source.matchAll(/cluster:\s*["']([^"']*?)["']/g)].map(m => m[1]);

  return slugs.map((slug, i) => ({
    slug,
    title: titles[i] || '',
    primaryKeyword: keywords[i] || '',
    cluster: clusters[i] || '',
  }));
}

function main() {
  console.log('[Cyberstar Classifier] Reading articles...');

  const stats = { awareness: 0, consideration: 0, decision: 0, retention: 0 };
  let totalArticles = 0;

  for (const file of BATCH_FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    let source = fs.readFileSync(filePath, 'utf8');
    const articles = extractArticles(source);
    totalArticles += articles.length;

    for (const article of articles) {
      const stage = classify(article);
      stats[stage]++;

      if (!DRY_RUN) {
        // Check if buyingStage already exists
        const blockStart = source.indexOf(`slug: "${article.slug}"`);
        if (blockStart === -1) continue;
        const blockEnd = source.indexOf(`slug: "`, blockStart + 1);
        const block = blockEnd > -1 ? source.substring(blockStart, blockEnd) : source.substring(blockStart);
        if (block.includes('buyingStage:')) continue;

        const clusterPattern = new RegExp(
          `(slug:\\s*["']${escapeRegex(article.slug)}["'][\\s\\S]*?cluster:\\s*["'][^"']*["'],?\\s*\\n)(\\s*)(content:|publishedDate:)`,
        );
        source = source.replace(clusterPattern, `$1$2buyingStage: "${stage}",\n$2$3`);
      }
    }

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, source);
      console.log(`  ${file}: classified ${articles.length} articles`);
    }
  }

  console.log(`\n  Total: ${totalArticles} articles`);
  console.log(`    Awareness:     ${stats.awareness}`);
  console.log(`    Consideration: ${stats.consideration}`);
  console.log(`    Decision:      ${stats.decision}`);
  console.log(`    Retention:     ${stats.retention}`);

  if (DRY_RUN) console.log('\n  [DRY RUN] No files modified.');
  console.log('  Done.');
}

main();
