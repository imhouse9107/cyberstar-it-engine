import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { blogClusters, getClusterBySlug } from "@/data/blogClusters";

const POSTS_PER_PAGE = 21;

function BlogIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const activeCluster = searchParams.get("topic") || "";
  const [query, setQuery] = useState("");

  // Filter posts
  let filtered = blogPosts;
  if (activeCluster) {
    filtered = filtered.filter((p) => p.cluster === activeCluster);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.metaDescription.toLowerCase().includes(q) ||
        p.primaryKeyword.toLowerCase().includes(q)
    );
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    setSearchParams(params);
  }

  function setTopic(slug: string) {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("topic", slug);
    } else {
      params.delete("topic");
    }
    params.delete("page");
    setSearchParams(params);
  }

  const pageTitle = activeCluster
    ? `${getClusterBySlug(activeCluster)?.title || "Blog"} | CyberStar IT`
    : "Blog | CyberStar IT";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Practical IT guides, cybersecurity tips, and buying advice for small and medium businesses. Written by the CyberStar IT team."
        />
        <link rel="canonical" href="https://cyberstarit.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              CyberStar IT Blog
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Practical guides, honest comparisons, and cybersecurity advice for
              small and medium businesses.
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>

          {/* Cluster Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setTopic("")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeCluster
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Topics
            </button>
            {blogClusters.map((c) => (
              <button
                key={c.slug}
                onClick={() => setTopic(c.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCluster === c.slug
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium mb-2">No articles yet</p>
              <p className="text-sm">
                New content is coming soon. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((post) => {
                const cluster = getClusterBySlug(post.cluster);
                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                  >
                    {cluster && (
                      <span className="inline-block mb-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                        {cluster.title}
                      </span>
                    )}
                    <h2 className="font-bold text-lg mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {post.metaDescription}
                    </p>
                    <time
                      className="text-xs text-gray-400"
                      dateTime={post.publishedDate}
                    >
                      {new Date(post.publishedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pb-12">
              <button
                onClick={() => setPage(safePage - 1)}
                disabled={safePage <= 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === safePage
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogIndex;
