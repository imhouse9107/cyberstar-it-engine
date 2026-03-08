import { Helmet } from "react-helmet-async";
import { Shield, Phone, Server, ArrowRight } from "lucide-react";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyberstar IT",
  url: "https://cyberstarit.com",
  description:
    "Trusted IT & cybersecurity solutions for US small and medium businesses.",
  logo: "https://cyberstarit.com/logo.png",
  sameAs: [
    "https://www.linkedin.com/company/cyberstar-it",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "info@cyberstarit.com",
    availableLanguage: "English",
  },
};

function Index() {
  return (
    <>
      <Helmet>
        <title>
          Cyberstar IT | Trusted IT & Cybersecurity Solutions for US Businesses
        </title>
        <meta
          name="description"
          content="Cyberstar IT is a trusted US-based IT reseller and VAR specializing in phone systems, hardware, cybersecurity, and managed IT solutions for small and medium businesses."
        />
        <link rel="canonical" href="https://cyberstarit.com" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            IT Solutions Built
            <br />
            for Your Business
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
            Cyberstar IT is a trusted US-based IT reseller helping small and
            medium businesses with phone systems, hardware, cybersecurity, and
            managed services — so you can focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#solutions"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Explore Solutions
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section id="solutions" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Phone Systems",
                desc: "VoIP, UCaaS, and business phone solutions from top vendors, tailored and deployed for your team.",
              },
              {
                icon: Server,
                title: "Hardware & Infrastructure",
                desc: "Servers, networking, workstations, and IT hardware — sourced, configured, and supported.",
              },
              {
                icon: Shield,
                title: "Cybersecurity",
                desc: "Endpoint protection, firewalls, email security, and compliance solutions to keep your business safe.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Index;
