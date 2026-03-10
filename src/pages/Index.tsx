import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  DollarSign,
  Server,
  Phone,
  Target,
  BookOpen,
  ChevronDown,
  Lock,
  Download,
  Star,
} from "lucide-react";

const organizationSchema = {
  "@type": "Organization",
  "@id": "https://cyberstarit.com/#organization",
  name: "Cyberstar IT",
  url: "https://cyberstarit.com",
  description:
    "Trusted IT & cybersecurity solutions for US small and medium businesses.",
  logo: "https://cyberstarit.com/logo.png",
  sameAs: ["https://www.linkedin.com/company/cyberstar-it"],
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

const faqData = [
  {
    q: "How are you different from every other IT company that says they're different?",
    a: "We don't get paid more for recommending expensive tools. We get paid to find the right ones. That means we've actively talked clients out of buying things they didn't need. Show me another vendor who does that.",
  },
  {
    q: "What size companies do you actually work with?",
    a: "20 to 200 people. Big enough to need real security. Small enough that every dollar matters. If you've got 10,000 employees, we're not your people. If you've got 50, we absolutely are.",
  },
  {
    q: "How fast can you actually respond?",
    a: "The free scorecard takes 30 seconds. A full assessment is 1-2 weeks depending on your setup. Response times for active clients are in our SLA. In writing. With teeth.",
  },
  {
    q: "Do you replace our IT team?",
    a: "No. We work alongside them. Think of us as the security specialists your team can lean on when things get complicated. Not a replacement. A reinforcement.",
  },
  {
    q: "What if we already have a vendor and we're not sure we need to switch?",
    a: "Run the scorecard. It's free. If your current setup scores well, we'll tell you. We've literally told people 'you're fine, don't change a thing.' That doesn't make us money. But it makes us trustworthy. And those people always come back when they actually need help.",
  },
];

const faqSchema = {
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    webSiteSchema,
    professionalServiceSchema,
    faqSchema,
  ],
};

const scorecardResults = [
  {
    label: "Email Auth",
    grade: "C+",
    color: "text-yellow-400",
    note: "Your SPF record is missing DKIM alignment. That's how spoofing happens.",
  },
  {
    label: "Endpoint Security",
    grade: "B-",
    color: "text-yellow-300",
    note: "Basic antivirus. No EDR. No MDR. You'd know about a breach roughly never.",
  },
  {
    label: "AI Risk",
    grade: "D",
    color: "text-red-400",
    note: "3+ shadow AI tools running with zero governance. This is the new shadow IT.",
  },
  {
    label: "Backup & Recovery",
    grade: "B",
    color: "text-green-400",
    note: "Backups exist. Recovery plan doesn't. That's half a parachute.",
  },
  {
    label: "Compliance",
    grade: "C",
    color: "text-yellow-400",
    note: "Missing key controls for your industry. An auditor would have a field day.",
  },
];

function Index() {
  const [scorecardEmail, setScorecardEmail] = useState("");
  const [scorecardCompany, setScorecardCompany] = useState("");
  const [scorecardSubmitted, setScorecardSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scorecardEmail || !scorecardCompany) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScorecardSubmitted(true);
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>CyberStar IT - Half Your Security Tools Are Doing Nothing</title>
        <meta
          name="description"
          content="We've saved companies $2M+ by telling them what to stop paying for. Free security scorecard in 30 seconds. No sales call."
        />
        <link rel="canonical" href="https://cyberstarit.com" />
        <meta
          property="og:title"
          content="CyberStar IT - Half Your Security Tools Are Doing Nothing"
        />
        <meta
          property="og:description"
          content="We've saved companies $2M+ by telling them what to stop paying for. Free security scorecard in 30 seconds. No sales call."
        />
        <meta
          property="og:image"
          content="https://cyberstarit.com/og-default.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://cyberstarit.com/og-default.png"
        />
        <script type="application/ld+json">
          {JSON.stringify(schemaGraph)}
        </script>
      </Helmet>

      {/* SECTION 1: Hero */}
      <section className="min-h-[90vh] flex items-center bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Half your security tools are doing nothing. Want to know{" "}
            <span style={{ color: "var(--color-accent)" }}>which half?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            We've saved companies over $2M by telling them what to stop paying
            for. Sometimes the best IT advice is "cancel that."
          </p>
          <a
            href="#scorecard"
            className="inline-flex items-center justify-center rounded-lg px-10 py-4 min-h-[48px] text-lg font-semibold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Find Out Which Half
          </a>
          <p className="mt-4 text-sm text-gray-400">
            Free. 30 seconds. No sales call.
          </p>
        </div>
      </section>

      {/* SECTION 2: Trust Flip */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <p className="text-2xl md:text-3xl font-medium text-gray-800">
            We've talked 30+ clients out of buying from us.
          </p>
          <p className="text-2xl md:text-3xl font-medium text-gray-800">
            We've told companies to cancel tools we could've resold them.
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            They all came back.
          </p>
          <p className="text-gray-400 text-base">
            Turns out, when you're honest with people, they trust you. Wild
            concept.
          </p>
        </div>
      </section>

      {/* SECTION 3: Vendor Strip */}
      <section className="py-10 bg-white border-t border-b border-gray-100 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            We work with 30+ vendors. We recommend the ones that fit. Not the
            ones that pay us the most.
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16 min-w-max md:min-w-0">
            {[
              "Microsoft",
              "CrowdStrike",
              "Fortinet",
              "Sophos",
              "Cisco",
              "SentinelOne",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold whitespace-nowrap select-none"
                style={{ color: "rgba(107,114,128,0.4)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Sound Familiar? */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Sound familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: DollarSign,
                title:
                  "Your vendor's best recommendation? Whatever pays them the most.",
                body: "Vendor rebates drive their advice. Not your security. You've suspected this for years. You're right.",
              },
              {
                Icon: Server,
                title:
                  "You've got a Fortune 500 stack protecting a 40-person company.",
                body: "Someone sold you CrowdStrike, a full SIEM, and zero trust architecture. For 40 people. That's not security. That's waste.",
              },
              {
                Icon: Phone,
                title: "Remember how attentive they were before you signed?",
                body: "Great demos. Quick responses. Then you signed the contract and they vanished. Now you wait 3 days for a callback.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-gray-50 rounded-xl p-8 border border-gray-100"
              >
                <Icon
                  className="w-6 h-6 mb-5"
                  style={{ color: "var(--color-accent)" }}
                />
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-700 font-semibold mt-12 text-lg">
            We hear this every single week. Here's what we do differently.
          </p>
        </div>
      </section>

      {/* SECTION 5: How We Actually Work */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            How we actually work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: Target,
                title: "We right-size everything.",
                body: "A 40-person company doesn't need the same stack as Goldman Sachs. We build for your size, your risk profile, and your budget. Nothing extra. If you only need three tools, we'll say three.",
              },
              {
                Icon: BookOpen,
                title: "We publish our pricing.",
                body: "No 'contact sales for a quote.' No bait and switch. No mystery fees 6 months in. We tell you what it costs because we've got nothing to hide. Most vendors won't do this. Ask yourself why.",
              },
              {
                Icon: Phone,
                title: "We pick up the phone.",
                body: "You get a named account manager. A real human. Guaranteed response times in writing. Quarterly check-ins whether we're selling you something or not. That's how it should work.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-8 shadow-sm">
                <Icon
                  className="w-6 h-6 mb-5"
                  style={{ color: "var(--color-accent)" }}
                />
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Security Scorecard */}
      <section id="scorecard" className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f1b2d 0%, #1a2d47 100%)",
              border: "1px solid rgba(56,178,172,0.3)",
            }}
          >
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: "rgba(56,178,172,0.08)" }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Find out what you actually need. And what you're overpaying for.
              </h2>
              <p
                className="mb-8"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Free security scorecard. 30 seconds. No pitch.
              </p>

              {!scorecardSubmitted && !scanning && (
                <form
                  onSubmit={handleScorecardSubmit}
                  className="flex flex-col gap-3 mb-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="Work email"
                    value={scorecardEmail}
                    onChange={(e) => setScorecardEmail(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 min-h-[48px] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Company name"
                    value={scorecardCompany}
                    onChange={(e) => setScorecardCompany(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 min-h-[48px] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg px-6 py-3 min-h-[48px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    Get My Free Scorecard
                  </button>
                </form>
              )}

              {!scorecardSubmitted && !scanning && (
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <Lock className="w-3 h-3" />
                  <span>
                    256-bit encrypted. We'll never share your data. Or spam you.
                    Life's too short.
                  </span>
                </div>
              )}

              {scanning && (
                <div className="text-center py-8">
                  <div
                    className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4"
                    style={{
                      borderColor: "rgba(56,178,172,0.3)",
                      borderTopColor: "var(--color-accent)",
                    }}
                  />
                  <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-lg">
                    Scanning {scorecardCompany}...
                  </p>
                </div>
              )}

              {scorecardSubmitted && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-5xl font-extrabold text-yellow-400">
                      C+
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        Overall Security Grade
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {scorecardCompany} — 5 areas assessed
                      </p>
                    </div>
                  </div>
                  {scorecardResults.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-start gap-3 rounded-lg p-4"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <span
                        className={`text-xl font-bold ${r.color} min-w-[40px]`}
                      >
                        {r.grade}
                      </span>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {r.label}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {r.note}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <a
                      href="mailto:info@cyberstarit.com"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 min-h-[48px] font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    >
                      <Download className="w-4 h-4" />
                      Download Full Report
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Stats */}
      <section className="py-16 bg-[#0f1b2d] text-white">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              stat: "$4.88M",
              question:
                "That's the average cost of a breach. Can your company write that cheque?",
            },
            {
              stat: "194 days",
              question:
                "That's how long the average attacker sits in your network before you notice.",
            },
            {
              stat: "67%",
              question:
                "Of small businesses that get breached badly, 67% close within 6 months.",
            },
          ].map(({ stat, question }) => (
            <div key={stat}>
              <p
                className="text-4xl md:text-5xl font-extrabold mb-3"
                style={{ color: "var(--color-accent)" }}
              >
                {stat}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {question}
              </p>
            </div>
          ))}
        </div>
        <p
          className="text-center text-xs mt-8"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          IBM, 2025. National Cyber Security Alliance.
        </p>
      </section>

      {/* SECTION 8: Case Studies */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Don't take our word for it. Take theirs.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "12 tools down to 5. $47K saved in 90 days.",
                quote:
                  "We had 12 overlapping security tools and still failed our HIPAA audit. CyberStar looked at everything, told us what was redundant, and cut it. Then we passed. First time.",
                name: "Sarah Chen",
                title: "CFO",
                tag: "MedVault Health. Healthcare. 45 people.",
              },
              {
                metric: "Same coverage. Half the tools. Fraction of the cost.",
                quote:
                  "They didn't walk in with a pitch deck. They looked at what we already had, told us what was actually working, and saved us a fortune by killing the rest.",
                name: "Marcus Johnson",
                title: "Head of IT",
                tag: "Apex Financial Group. Finance. 120 people.",
              },
              {
                metric: "SOC 2 in 8 weeks. Industry average is 6 months.",
                quote:
                  "Every other vendor wanted to sell us their full stack. CyberStar told us exactly what a 40-person SaaS company actually needs. Nothing more. That's why we trust them.",
                name: "Lisa Park",
                title: "CEO",
                tag: "BrightPath SaaS. 40 people.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-xl p-8 border-l-4"
                style={{ borderColor: "var(--color-accent)" }}
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p
                  className="font-bold text-sm mb-4"
                  style={{ color: "var(--color-accent)" }}
                >
                  {t.metric}
                </p>
                <p className="text-gray-600 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-400">
                  {t.title} — {t.tag}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Pricing */}
      <section id="pricing" className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            What it actually costs.
          </h2>
          <p className="text-center text-gray-500 max-w-2xl mx-auto mb-16">
            We publish this because no one else will. If a vendor hides their
            pricing, ask yourself what else they're hiding.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Essentials",
                range: "10-30 people",
                price: "From $25/user/month",
                features: [
                  "Endpoint protection",
                  "Email security",
                  "Basic backup",
                ],
                highlight: false,
              },
              {
                name: "Growth",
                range: "30-100 people",
                price: "From $45/user/month",
                features: [
                  "Everything in Essentials",
                  "MDR",
                  "Compliance support",
                  "Quarterly reviews",
                ],
                highlight: true,
              },
              {
                name: "Full Stack",
                range: "100-200 people",
                price: "From $70/user/month",
                features: [
                  "Dedicated account manager",
                  "SLA guarantees",
                  "Annual pen testing",
                  "The lot",
                ],
                highlight: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className="bg-white rounded-xl p-8 shadow-sm"
                style={
                  tier.highlight
                    ? { border: "2px solid var(--color-accent)" }
                    : { border: "1px solid #e5e7eb" }
                }
              >
                {tier.highlight && (
                  <div
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{tier.range}</p>
                <p className="text-2xl font-extrabold text-gray-900 mb-6">
                  {tier.price}
                </p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#scorecard"
                  className="block text-center w-full rounded-lg px-6 py-3 min-h-[48px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Get a Custom Quote
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-10 max-w-2xl mx-auto">
            Every stack is custom. These are starting points. Book a call and
            you'll have an exact quote in 24 hours. Not 2 weeks. Not "we'll
            circle back." 24 hours.
          </p>
        </div>
      </section>

      {/* SECTION 10: FAQ */}
      <section id="faq" className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Fair questions.
          </h2>
          <div className="space-y-3">
            {faqData.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {item.q}
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: Final CTA */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still here? Good. That means you're serious.
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Most people who visit an IT vendor's website leave in 8 seconds. You
            didn't. So let's skip the dance.
          </p>
          <a
            href="#scorecard"
            className="inline-flex items-center justify-center rounded-lg px-10 py-4 min-h-[48px] text-lg font-semibold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Find Out Which Half
          </a>
          <p
            className="mt-5 text-sm"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Or just email us: info@cyberstarit.com. We reply fast. Ask around.
          </p>
        </div>
      </section>

      {/* SECTION 12: Footer */}
      <footer
        className="py-8 text-center text-sm"
        style={{
          backgroundColor: "#0a1628",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        <p>&copy; 2026 CyberStar IT. All rights reserved.</p>
        <p className="mt-1">info@cyberstarit.com</p>
      </footer>
    </>
  );
}

export default Index;
