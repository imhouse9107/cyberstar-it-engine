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
