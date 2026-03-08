import { Helmet } from "react-helmet-async";
import { Shield, Phone, Server, ArrowRight, Eye, ShieldCheck, HardDrive, FileCheck, GraduationCap } from "lucide-react";

const organizationSchema = {
  "@type": "Organization",
  "@id": "https://cyberstarit.com/#organization",
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

const webSiteSchema = {
  "@type": "WebSite",
  name: "Cyberstar IT",
  url: "https://cyberstarit.com",
  description:
    "Trusted IT & cybersecurity solutions for US small and medium businesses.",
  publisher: { "@id": "https://cyberstarit.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://cyberstarit.com/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const professionalServiceSchema = {
  "@type": "ProfessionalService",
  name: "Cyberstar IT",
  url: "https://cyberstarit.com",
  description:
    "Cybersecurity consulting and IT solutions for small and medium businesses",
  areaServed: "United States",
  serviceType: [
    "Cybersecurity Consulting",
    "IT Solutions",
    "Managed Security",
  ],
  email: "info@cyberstarit.com",
};

const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, webSiteSchema, professionalServiceSchema],
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
        <meta property="og:image" content="https://cyberstarit.com/og-default.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://cyberstarit.com/og-default.png" />
        <script type="application/ld+json">
          {JSON.stringify(schemaGraph)}
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

      {/* The 5-Star Cyber Shield Methodology */}
      <section id="methodology" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">
              Our Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The 5-Star Cyber Shield&trade;
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Most SMBs don't need more tools — they need the <em>right</em> tools, layered correctly.
              Our vendor-agnostic framework builds cyber resilience from the inside out, so every dollar you spend actually protects you.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-accent)] to-[var(--color-accent)]/20" />

            <div className="grid md:grid-cols-5 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  step: "1",
                  title: "Protect",
                  subtitle: "Endpoint Security",
                  desc: "Lock down every laptop, server, and device with next-gen endpoint protection — before attackers get a foothold.",
                },
                {
                  icon: Eye,
                  step: "2",
                  title: "Detect",
                  subtitle: "MDR & Monitoring",
                  desc: "24/7 managed detection and response that catches threats your firewall misses — with real humans investigating alerts.",
                },
                {
                  icon: HardDrive,
                  step: "3",
                  title: "Recover",
                  subtitle: "Backup & Disaster Recovery",
                  desc: "Immutable backups and tested recovery plans so ransomware becomes a bad day, not a business-ending event.",
                },
                {
                  icon: FileCheck,
                  step: "4",
                  title: "Comply",
                  subtitle: "Compliance & Governance",
                  desc: "Meet HIPAA, SOC 2, CMMC, and other frameworks with controls that actually make sense for your size and industry.",
                },
                {
                  icon: GraduationCap,
                  step: "5",
                  title: "Train",
                  subtitle: "Security Awareness",
                  desc: "Turn your team from your weakest link into your first line of defense with phishing simulations and ongoing training.",
                },
              ].map(({ icon: Icon, step, title, subtitle, desc }) => (
                <div key={step} className="relative flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest mb-1">
                    Star {step}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{title}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-3">{subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gray-50 rounded-xl px-8 py-6 max-w-2xl">
              <p className="text-gray-700 leading-relaxed">
                <strong>Why 5 stars?</strong> Because each point of the Cyberstar represents a layer of defense.
                Skip one, and you leave a gap attackers will find. We help you build all five —
                with the best vendor for each layer, not just whoever pays us the most.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-white hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Get Your Free Shield Assessment
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Index;
