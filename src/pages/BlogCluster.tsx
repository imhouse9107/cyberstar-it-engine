import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { getClusterBySlug } from "@/data/blogClusters";
import { getPostsByCluster } from "@/data/blogPosts";

function BlogCluster() {
  const { slug } = useParams<{ slug: string }>();
  const cluster = slug ? getClusterBySlug(slug) : undefined;

  if (!cluster) return <Navigate to="/blog" replace />;

  const posts = getPostsByCluster(cluster.slug);
  const canonicalUrl = `https://cyberstarit.com/blog/topic/${cluster.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cluster.title,
    description: cluster.metaDescription,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "CyberStar IT",
      url: "https://cyberstarit.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://cyberstarit.com/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <Helmet>
        <title>{cluster.title} | CyberStar IT Blog</title>
        <meta name="description" content={cluster.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`${cluster.title} | CyberStar IT`} />
        <meta property="og:description" content={cluster.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CyberStar IT" />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${cluster.title} | CyberStar IT`}
        />
        <meta name="twitter:description" content={cluster.metaDescription} />

        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Topics
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {cluster.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              {cluster.description}
            </p>
          </div>
        </section>

        {/* Articles */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium mb-2">
                No articles in this topic yet
              </p>
              <p className="text-sm mb-6">
                We are working on new content for this category. Check back
                soon.
              </p>
              <Link
                to="/blog"
                className="text-[var(--color-accent)] hover:underline text-sm font-medium"
              >
                Browse all articles
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                >
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
                    {new Date(post.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogCluster;
