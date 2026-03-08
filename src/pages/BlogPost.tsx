import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { getClusterBySlug } from "@/data/blogClusters";

/* ---------- helpers ---------- */

function extractHeadings(markdown: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const regex = /^## (.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text });
  }
  return headings;
}

function extractFAQs(
  markdown: string
): { question: string; answer: string }[] {
  const faqSection = markdown.split(/## Frequently Asked Questions/i)[1];
  if (!faqSection) return [];

  const faqs: { question: string; answer: string }[] = [];
  const blocks = faqSection.split(/### /);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const newlineIdx = trimmed.indexOf("\n");
    if (newlineIdx === -1) continue;
    const question = trimmed.slice(0, newlineIdx).trim();
    const answer = trimmed.slice(newlineIdx).trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

/* ---------- component ---------- */

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const cluster = getClusterBySlug(post.cluster);
  const related = getRelatedPosts(post.slug, 3);
  const headings = extractHeadings(post.content);
  const faqs = extractFAQs(post.content);
  const minutes = readingTime(post.content);
  const canonicalUrl = `https://cyberstarit.com/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      "@type": "Person",
      name: "Mike Chen",
      jobTitle: "Director of IT Solutions",
      url: "https://cyberstarit.com/about",
      image: "https://cyberstarit.com/authors/mike-chen.jpg",
      worksFor: { "@type": "Organization", name: "Cyberstar IT" },
    },
    publisher: {
      "@type": "Organization",
      name: "Cyberstar IT",
      url: "https://cyberstarit.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cyberstarit.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://cyberstarit.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Helmet>
        <title>{post.title} | Cyberstar IT Blog</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OG */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Cyberstar IT" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />

        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <article className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-1 text-sm text-gray-500">
              <Link to="/" className="hover:text-[var(--color-accent)]">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-[var(--color-accent)]">
                Blog
              </Link>
              {cluster && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <Link
                    to={`/blog/topic/${cluster.slug}`}
                    className="hover:text-[var(--color-accent)]"
                  >
                    {cluster.title}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 truncate max-w-[200px]">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {cluster && (
            <Link
              to={`/blog/topic/${cluster.slug}`}
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            >
              {cluster.title}
            </Link>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {minutes} min read
            </span>
          </div>

          {/* Author Byline */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-lg shrink-0">
              MC
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Mike Chen</p>
              <p className="text-xs text-gray-500">Director of IT Solutions at Cyberstar IT</p>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        {headings.length > 2 && (
          <nav className="max-w-4xl mx-auto px-6 mb-10">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-[var(--color-primary)] hover:text-[var(--color-accent)] text-sm"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <h2 id={id} {...props}>
                      {children}
                    </h2>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Author Box */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-xl shrink-0">
                MC
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">About the Author</p>
                <p className="text-lg font-bold text-gray-900 mb-1">Mike Chen</p>
                <p className="text-sm font-medium text-[var(--color-accent)] mb-3">Director of IT Solutions at Cyberstar IT</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mike Chen leads IT solutions at Cyberstar IT, helping SMBs across the US build resilient technology infrastructure. With 12+ years in IT consulting and cybersecurity, Mike specializes in phone systems, endpoint security, and disaster recovery for businesses under 200 employees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] py-16">
          <div className="max-w-3xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">
              Get a Free IT Assessment
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Not sure where your IT gaps are? Let our team evaluate your
              current setup and recommend solutions tailored to your business
              size and budget.
            </p>
            <a
              href="https://cyberstarit.com/#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Request Your Free Assessment
            </a>
          </div>
        </section>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => {
                  const rCluster = getClusterBySlug(r.cluster);
                  return (
                    <Link
                      key={r.slug}
                      to={`/blog/${r.slug}`}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {rCluster && (
                        <span className="inline-block mb-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                          {rCluster.title}
                        </span>
                      )}
                      <h3 className="font-bold text-lg group-hover:text-[var(--color-accent)] transition-colors mb-2">
                        {r.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {r.metaDescription}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}

export default BlogPost;
