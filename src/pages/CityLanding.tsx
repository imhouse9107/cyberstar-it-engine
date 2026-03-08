import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Shield,
  Phone,
  Monitor,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getCityBySlug, cityPages } from "@/data/cityPages";
import { getPostBySlug } from "@/data/blogPosts";

function CityLanding() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, "");
  const city = getCityBySlug(slug);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find a page for that location.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:underline"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Cyberstar IT",
    url: `https://cyberstarit.com/${city.slug}`,
    description: city.metaDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: city.city,
    },
    email: "info@cyberstarit.com",
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "IT Solutions" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cybersecurity" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Phone Systems" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hardware Procurement" } },
    ],
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
        name: `IT Solutions ${city.city}`,
        item: `https://cyberstarit.com/${city.slug}`,
      },
    ],
  };

  const otherCities = cityPages.filter((c) => c.slug !== city.slug);

  const services = [
    {
      icon: Phone,
      title: "Phone Systems & VoIP",
      description: `Modern cloud-based phone systems and UCaaS solutions for ${city.city} businesses. We source, deploy, and support VoIP from top vendors — giving your team crystal-clear communications whether they're in the office or working remotely.`,
      features: [
        "Cloud PBX & hosted VoIP",
        "Unified Communications (UCaaS)",
        "Auto-attendants & call routing",
        "Mobile & remote extensions",
      ],
    },
    {
      icon: Monitor,
      title: "Hardware & Infrastructure",
      description: `Enterprise-grade hardware procurement and IT infrastructure for ${city.city} SMBs. From servers and networking to workstations and peripherals — sourced at competitive pricing, configured to your specs, and supported long-term.`,
      features: [
        "Server & network equipment",
        "Workstations & laptops",
        "Switches, firewalls & access points",
        "Lifecycle management & refresh",
      ],
    },
    {
      icon: Shield,
      title: "Cybersecurity Solutions",
      description: `Comprehensive cybersecurity for ${city.city} businesses including EDR, MDR, backup, and patch management. We build a layered defense that protects your endpoints, data, and reputation against modern threats.`,
      features: [
        "EDR & endpoint protection",
        "MDR (managed detection & response)",
        "Cloud backup & disaster recovery",
        "Automated patch management",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{city.metaTitle}</title>
        <meta name="description" content={city.metaDescription} />
        <link
          rel="canonical"
          href={`https://cyberstarit.com/${city.slug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Cyberstar IT
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <a
              href="#solutions"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Solutions
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-[70vh] flex items-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-white/70" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
              {city.city}, {city.state}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {city.heroHeadline}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
            {city.heroSubline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Get a Free IT Assessment
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {city.city} IT Solutions
            </span>
          </nav>
        </div>
      </div>

      {/* Local Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {city.localStats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local IT Landscape */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            The {city.city} IT Landscape
          </h2>
          <div className="space-y-6">
            {city.localContext.map((paragraph, i) => (
              <p
                key={i}
                className="text-gray-700 leading-relaxed text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* IT Challenges */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            IT Challenges Facing {city.city} Businesses
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Every market has its own IT pain points. Here are the most common
            challenges we help {city.city} SMBs overcome.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {city.itChallenges.map((challenge) => (
              <div
                key={challenge.title}
                className="p-8 rounded-xl border border-gray-200 hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / How We Help */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            How Cyberstar IT Helps {city.city} Businesses
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We source, deploy, and support the technology your business
            needs — from phones to firewalls — so you can focus on growing.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, description, features }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {description}
                </p>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Resources for {city.city} Businesses
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Learn more about the IT solutions and cybersecurity strategies
            that matter most for your business.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.relatedArticles.map((articleSlug) => {
              const post = getPostBySlug(articleSlug);
              if (!post) return null;
              return (
                <Link
                  key={articleSlug}
                  to={`/blog/${articleSlug}`}
                  className="group block p-6 rounded-xl border border-gray-200 hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-[var(--color-accent)] transition-colors mb-2">
                    {post.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium">
                    Read Article
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            IT Solutions in Other Cities
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {c.city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500">
            Also serving businesses in{" "}
            {city.nearbyAreas.map((area, i) => (
              <span key={area}>
                <span className="font-medium text-gray-700">{area}</span>
                {i < city.nearbyAreas.length - 1 ? ", " : ""}
              </span>
            ))}
            , and the greater {city.city} metro area.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Get a Free IT Assessment for Your {city.city} Business
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Tell us about your business and current IT setup. We'll provide a
            no-obligation assessment with recommendations for phone systems,
            cybersecurity, and infrastructure improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@cyberstarit.com?subject=IT%20Assessment%20Request%20-%20{city.city}"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Request Your Free Assessment
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <p className="text-white/50 text-sm mt-6">
            No commitment required. We typically respond within 1 business day.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-white font-bold text-lg">
                Cyberstar IT
              </span>
              <p className="text-sm mt-1">
                Trusted IT & cybersecurity solutions for US businesses.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <a
                href="mailto:info@cyberstarit.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
            &copy; {new Date().getFullYear()} Cyberstar IT. All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default CityLanding;
