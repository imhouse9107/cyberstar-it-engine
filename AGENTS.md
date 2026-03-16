## Project Overview

Cyberstar IT (cyberstarit.com) — cybersecurity value-added reseller (VAR) targeting US SMBs (up to 200 employees). Vite + React + TypeScript site deployed on Netlify. Pre-rendered via Puppeteer (`scripts/prerender.cjs`). Sitemap auto-generated on build and via GitHub Actions (`rebuild-sitemap.yml`).

## Architecture

- `src/pages/` — page components: Index, BlogIndex, BlogPost, BlogCluster, CityLanding, NotFound
- `src/data/` — content data: blogPosts.ts (main index + phonePosts), batch2-6 files, blogClusters.ts, cityPages.ts
- `public/` — static assets: sitemap.xml, robots.txt, llms.txt, og-default.png, _headers
- `scripts/` — build scripts: prerender.cjs, generate-routes.cjs, generate-seo-report.cjs
- `.github/workflows/` — rebuild-sitemap.yml, daily-seo-report.yml

## Content Structure

- **100 articles** across 8 clusters in 6 files (blogPosts.ts + batch2 through batch6)
- **BlogPost interface** (line 7-15 of blogPosts.ts): slug, title, metaDescription, primaryKeyword, cluster, publishedDate, content
- **Author persona:** Mike Chen, Director of IT Solutions
- **Branded methodology:** "The 5-Star Cyber Shield" (Protect, Detect, Recover, Comply, Train)

### 8 Clusters

| Slug | Title |
|------|-------|
| phone-systems-voip | Phone Systems & VoIP |
| business-hardware | Business Hardware & IT Equipment |
| endpoint-security | EDR & Endpoint Security |
| managed-detection-response | MDR & Managed Security |
| backup-disaster-recovery | Backup & Disaster Recovery |
| patch-management | Patch Management & Updates |
| cybersecurity-smb | Cybersecurity for Small Business |
| it-buying-guide | IT Buying Guides & Comparisons |

### 8 City Pages

new-york, los-angeles, chicago, dallas, atlanta, miami, houston, san-francisco

## Key File Locations

- **Blog data:** src/data/blogPosts.ts (main index + phonePosts), blogPosts-batch2.ts, blogPosts-batch3.ts, blogPosts-batch4.ts, blogPosts-batch5.ts, blogPosts-batch6.ts
- **Blog interface:** src/data/blogPosts.ts lines 7-15
- **Cluster data:** src/data/blogClusters.ts
- **City data:** src/data/cityPages.ts
- **Netlify config:** netlify.toml
- **Security headers:** public/_headers
- **Sitemap workflow:** .github/workflows/rebuild-sitemap.yml
- **SEO report workflow:** .github/workflows/daily-seo-report.yml

### Helmet (all pages have it)

Every page component in src/pages/ uses `<Helmet>` from react-helmet-async.

### JSON-LD Schema Locations

- `src/pages/Index.tsx` — @graph with Organization + WebSite + ProfessionalService
- `src/pages/BlogPost.tsx` — Article schema + BreadcrumbList + FAQPage (if applicable)
- `src/pages/BlogCluster.tsx` — CollectionPage schema
- `src/pages/CityLanding.tsx` — LocalBusiness + BreadcrumbList
- `src/pages/BlogIndex.tsx` — none (Helmet only)

## Commands

- `npm run dev` — start dev server
- `npm run build` — TypeScript check + Vite build + prerender + sitemap
- `npx tsc --noEmit` — type check only
- `npx @ast-grep/cli run -p 'PATTERN' --lang tsx src/` — structural code search

## Adding New Articles

1. Create `src/data/blogPosts-batch7.ts` (follow batch5/6 format)
2. Import in `blogPosts.ts` and add to the spread array
3. Update `.github/workflows/rebuild-sitemap.yml` to include new file
4. Stagger publishedDates on Mon/Wed/Fri cadence
5. Run `npm run build` to verify

## SEO Checklist for New Pages

- Helmet with title, meta description, canonical URL
- og:image, og:image:width/height/type, twitter:card, twitter:image
- JSON-LD schema in `<script type="application/ld+json">`
- Internal links to 2+ related articles

## Don't

- Don't read blogPosts batch files unless editing content (they're huge)
- Don't re-read Index.tsx just to check schema — it's @graph with Organization + WebSite + ProfessionalService
- Don't manually edit public/sitemap.xml — it auto-generates on build
- Use `npx @ast-grep/cli` (or `sg`) for structural searches instead of reading whole files

---

## Self-Improvement Protocol

This project runs a self-improving SEO engine. Every session follows this sequence before doing any work.

### Phase 1: Intelligence Gathering (runs every session)

Every session, before doing any work, run ALL of these research sweeps. Summarise findings in a file called `INTELLIGENCE-LOG-[DATE].md` inside a new `intel/` directory.

#### 1A: Reddit Intelligence

Search the web for results from these subreddits. Look for posts with high upvotes and real results (traffic screenshots, ranking proof, revenue numbers). Ignore generic advice. Only capture tactics where someone shows proof it worked.

Sources to scrape:
- reddit.com/r/SEO — filter by top posts this month
- reddit.com/r/bigseo — advanced practitioner discussions
- reddit.com/r/juststart — niche site builders sharing real traffic data
- reddit.com/r/SaaS — founders talking about organic growth
- reddit.com/r/Entrepreneur — SEO case studies from real businesses
- reddit.com/r/digital_marketing — tactical SEO discussions

What to extract:
- Specific tactics that drove measurable traffic increases (with numbers)
- Tools or workflows people are using successfully
- Content formats that are outperforming (long-form vs short, listicles vs guides, video vs text)
- Internal linking strategies that moved the needle
- Programmatic SEO approaches that are working in 2026
- AI content strategies that are ranking (and which ones got penalised)
- Backlink tactics that are actually working (not theoretical)

#### 1B: Twitter/X Intelligence

Search the web for tweets and threads from known SEO practitioners. Focus on people sharing data, not opinions.

Key accounts to monitor:
- @liloray (Lily Ray) — algorithm updates, E-E-A-T analysis
- @gabordev (Glenn Gabe) — core update impact analysis with data
- @searchliaison (Google Search Liaison) — official Google communications
- @JohnMu (John Mueller, Google) — crawling, indexing, technical guidance
- @patrickstox (Patrick Stox, Ahrefs) — technical SEO and tooling
- @brodieseo (Brodie Clark) — SERP feature tracking
- @NicheDown — niche site data and case studies

Also search for:
- "SEO case study 2026" site:twitter.com
- "traffic increase SEO" site:twitter.com
- "AI content ranking" site:twitter.com
- "programmatic SEO results" site:twitter.com

What to extract:
- Algorithm update confirmations and impact data
- Specific ranking factors that are gaining or losing weight
- New SERP features to optimise for
- AI Overview optimisation tactics with proof
- Content velocity benchmarks (how fast are winning sites publishing?)

#### 1C: GitHub and Open Source Intelligence

Search for SEO automation tools, scripts, and frameworks that practitioners are building and sharing.

Search queries:
- "SEO automation" site:github.com
- "programmatic SEO" site:github.com
- "AI SEO tool" site:github.com
- "search console API" site:github.com
- "content generation SEO" site:github.com
- "internal linking tool" site:github.com

What to extract:
- Automation scripts we could adapt for our pipeline
- APIs or tools that could feed data into our system
- Technical SEO audit tools we're not using
- Schema generation tools
- Sitemap optimisation approaches
- Any open source SEO dashboards or reporting tools

#### 1D: SEO Industry Publications

Search for the latest from these sources. Focus on data-driven articles, not opinion pieces.

- Search Engine Journal — latest algorithm analysis
- Search Engine Land — Google announcements and feature changes
- Ahrefs Blog — studies with data (they publish original research)
- Semrush Blog — keyword and ranking trend data
- Moz Blog — domain authority studies and link building research
- Google Search Central Blog — official documentation changes
- Detailed.com — niche site teardowns and case studies
- Growth Memo by Kevin Indig — strategic SEO analysis
- Marie Haynes newsletter — E-E-A-T and quality updates

#### 1E: Competitor Intelligence

For this project (Cyberstar IT), research:

1. Search for our top 10 target keywords. Note who ranks in positions 1-5.
2. For each competing page that outranks us:
   - What is their word count?
   - Do they have FAQ schema?
   - How many internal links do they have?
   - Do they have original data, charts, or proprietary research?
   - What is their domain authority (estimate)?
   - Are they getting AI Overview citations?
3. Identify content gaps: keywords where competitors rank and we have no content.
4. Identify format gaps: are competitors using video, tools, calculators, or interactive content that we're not?

#### 1F: AI Search Optimisation (GEO)

This is the fastest-growing opportunity. Search for:

- "how to get cited by Perplexity AI"
- "ChatGPT web search citation optimisation"
- "Google AI Overviews optimisation 2026"
- "generative engine optimisation case study"
- "AI search citation strategy"

What to extract:
- Content structures that get cited (quote blocks, FAQ, tables, definitions)
- Entity and schema requirements for AI citation
- Which types of content AI systems prefer to cite
- How to test whether your content is being cited
- Differences between optimising for Google AI Overviews vs Perplexity vs ChatGPT

---

### Phase 2: Intelligence Processing

After gathering, process everything into actionable updates:

#### Update the Skill File

Open the skill file. For each new finding from Phase 1:
1. Does it contradict something in the current skill file? If yes, update it.
2. Does it add something the skill file doesn't cover? If yes, add it.
3. Is it a temporary tactic or a lasting principle? Label it accordingly.
4. Bump the version number and add a changelog entry with the date and source.

#### Update the Competitive Intel File

If a `competitive-intel.md` exists, update it with new competitor data. If it doesn't exist, create one.

#### Create an Opportunities List

In each intelligence log, include a section called "New Opportunities" with:
- Tactics we're not using that competitors or Reddit practitioners are succeeding with
- Tools or scripts we could adopt from GitHub
- Content formats we should test
- Quick wins (things we could implement in under an hour with high potential impact)

---

### Phase 3: Benchmark Tracking

Maintain a file called `BENCHMARK-TRACKER.md` that tracks progress over time:

```
## Weekly Benchmark — [DATE]

### Cyberstar IT (cyberstarit.com)
- Total articles: X
- Indexed pages (GSC): X
- Pages discovered not indexed: X
- Total impressions (last 7 days): X
- Total clicks (last 7 days): X
- Average position: X
- Top 5 performing keywords: [list]
- Backlinks: X
- Domain authority estimate: X
- AI Overview citations confirmed: X

### Competitor Benchmark
- Top competitor domain authority: X
- Their indexed pages: X
- Their estimated monthly traffic: X
- Gap to close: X
```

Update this every Monday. Over time this becomes the proof that the system is working.

---

### Phase 4: Self-Grading

At the end of every intelligence gathering session, grade the current state:

**Content Quality Score (out of 10)**
- Are our articles better than what's ranking in positions 1-3?
- Do our articles have proprietary data or unique angles?
- Are our articles structured for AI citation?

**Technical SEO Score (out of 10)**
- Are all pages indexed?
- Is schema markup complete and valid?
- Are there crawl errors, redirect chains, or broken links?
- Is page speed acceptable?

**Authority Score (out of 10)**
- How many quality backlinks do we have?
- Are we getting AI citations?
- Are we referenced on Reddit, Twitter, or industry publications?
- Is branded search volume growing?

**Velocity Score (out of 10)**
- Are we publishing at least 3 articles per week?
- Are new articles getting indexed within 7 days?
- Is the keyword backlog being consumed on schedule?

Total score out of 40. Track weekly in BENCHMARK-TRACKER.md.

---

### Phase 5: Audit (runs every session)

After intelligence gathering, audit the current state:

1. Read SEO-REPORT.md and article-tracker.md for current status
2. Read keyword-backlog.txt for upcoming work
3. If Google Search Console data is available, check:
   - Which pages are indexed vs discovered vs not indexed
   - Which keywords are generating impressions
   - Which pages have the highest click-through rate
   - Which pages are declining in position
4. Check the internal-links-report.txt for orphan pages or weak linking
5. Read the BACKLINK-STRATEGY.md for current backlink status

Produce a brief status summary covering: articles published, articles indexed, top performing keywords, underperforming pages, and new opportunities spotted during Phase 1.

### Phase 6: Recommend (runs every session)

Based on Phases 1-5, produce a ranked list of the top 5 actions for this session. Each action should include:

- What to do
- Why it matters (tied to something specific from the Intelligence Gathering phase)
- Expected impact (high/medium/low)
- Estimated time

Present this list and wait for approval before executing. If the operator says "just go", execute all 5 in order.

### Phase 7: Execute

Do the approved work. After completing each action:

1. Update article-tracker.md if articles were created or modified
2. Update keyword-backlog.txt if keywords were consumed
3. Update internal-link-map.md if linking changed
4. Update SEO-REPORT.md with new metrics
5. Log what was done in a SESSION-LOG with today's date

### Phase 8: Report

At the end of every session, produce:

1. A summary of what was done
2. Updated SEO scorecard (articles, indexed pages, backlinks, orphans, broken links)
3. What the operator needs to do manually (if anything)
4. What the next session should prioritise
5. Save this as SESSION-PICKUP-[DATE].md so the next session can pick up seamlessly

---

### Daily Cron Behaviour

When running via the daily cron job (no operator present):

1. Run Phase 1 (Intelligence Gathering) silently, update the skill file if needed
2. Run Phase 2 (Intelligence Processing) silently
3. Run Phase 5 (Audit) silently
4. Execute the top-priority automated tasks:
   - Generate next articles from keyword backlog
   - Convert and push to live site
   - Run internal link audit and fix any orphans
   - Update sitemap
   - Update BENCHMARK-TRACKER.md if it's Monday
5. Write the session log and pickup file
6. Send a summary report to the operator's email (if email automation is configured) or save to logs/

---

### What This Agent Needs From the Operator

After completing the intelligence cycle, the agent presents:

1. "Here's what I learned this session" — 3-5 bullet summary of the most impactful findings
2. "Here's what I updated" — changes made to skill file, competitive intel, or strategy
3. "Here are the top 5 actions for this session" — ranked by impact
4. "Here's what I need from you" — anything requiring human input, credentials, or proprietary data

The agent will flag these when it needs human input:

- "APPROVAL NEEDED" — a strategic decision (e.g. adding a new cluster, changing brand positioning)
- "CONTENT NEEDED" — proprietary data, case studies, or quotes that only the operator can provide
- "ACCESS NEEDED" — something requiring login credentials (e.g. Search Console data export, GBP update)
- "REVIEW NEEDED" — a published article that should be reviewed before promotion

The operator reviews, approves, and the agent executes. If the operator isn't present (cron job), the agent executes automated tasks only and saves the intelligence report for review.

---

### Weekly Operator Briefing Format

Every Monday, produce a brief called `WEEKLY-BRIEFING-[DATE].md`:

```
# SEO Weekly Briefing — [DATE]

## What Happened This Week
- Articles published: X
- New pages indexed: X
- Impressions change: +X% / -X%
- Clicks change: +X% / -X%
- New backlinks: X

## Intelligence Highlights
- [Most important thing learned this week]
- [Second most important]
- [Third most important]

## Score Card
- Content: X/10
- Technical: X/10
- Authority: X/10
- Velocity: X/10
- Total: X/40 (last week: X/40)

## Recommended Actions for Next Week
1. [Action] — [Why] — [Expected impact]
2. [Action] — [Why] — [Expected impact]
3. [Action] — [Why] — [Expected impact]

## What I Need From You
- [Anything requiring operator input]
```

This is the report you read with your morning coffee on Mondays. Everything else runs autonomously.

---

### Knowledge Sources to Monitor

- Google Search Central Blog (developers.google.com/search/blog)
- Search Engine Journal (searchenginejournal.com)
- Ahrefs Blog (ahrefs.com/blog)
- Google Search Status Dashboard (status.search.google.com)
- Marie Haynes newsletter (mariehaynes.com)
- Lily Ray on Twitter/X (@liloray) for algorithm update tracking
- Glenn Gabe on Twitter/X (@gabordev) for core update analysis

### Skill File Versioning

The skill file should have a version number and changelog at the top:

```
# SEO Engine Skill File
## Version: 3.1
## Last Updated: 2026-03-14

### Changelog
- v3.1 (2026-03-13): Added Gemini 4.0 Semantic Filter guidance, AI Overview stats
- v3.0 (2026-03-07): Initial skill file with Pierre Herubel + Sarvesh 5-R + GEO frameworks
```

Every time the Intelligence Gathering phase discovers something new, bump the minor version and add a changelog entry.
