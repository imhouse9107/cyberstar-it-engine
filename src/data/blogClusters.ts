export interface BlogCluster {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  articleSlugs: string[];
}

export const blogClusters: BlogCluster[] = [
  {
    slug: "phone-systems-voip",
    title: "Phone Systems & VoIP",
    description:
      "Everything your business needs to know about modern phone systems, VoIP, UCaaS, and cloud-based communications. We cover vendor comparisons, setup guides, cost breakdowns, and best practices for small and medium businesses switching from legacy phone lines to internet-based calling.",
    metaDescription:
      "Business phone system and VoIP guides for SMBs. Compare vendors, understand costs, and learn how to set up cloud-based communications for your team.",
    articleSlugs: [
      "best-business-phone-system-small-business",
      "voip-vs-landline-for-business",
      "how-much-does-a-business-phone-system-cost",
      "best-voip-providers-small-business-2026",
      "cloud-phone-system-for-small-business",
      "business-phone-system-setup-guide",
      "3cx-vs-ringcentral",
      "hosted-pbx-vs-on-premise-phone-system",
      "voip-phone-system-features",
      "how-to-switch-business-phone-system",
      "voip-security-risks-and-solutions",
      "business-phone-system-for-remote-teams",
      "auto-attendant-vs-receptionist",
      "sip-trunking-explained",
      "business-phone-system-roi-calculator",
      "unified-communications-as-a-service",
      "microsoft-teams-phone-system",
      "voip-for-call-centers-small-business",
      "business-phone-number-porting",
      "phone-system-for-medical-office",
    ],
  },
  {
    slug: "business-hardware",
    title: "Business Hardware & IT Equipment",
    description:
      "Practical buying guides and recommendations for servers, workstations, laptops, networking equipment, and other IT hardware. We help small businesses choose the right equipment, understand specs, and plan for lifecycle management without overspending.",
    metaDescription:
      "Business IT hardware buying guides — servers, workstations, laptops, and networking gear. Practical recommendations for small and medium businesses.",
    articleSlugs: [
      "best-business-laptops-2026",
      "it-hardware-for-small-business",
      "refurbished-vs-new-business-computers",
      "small-business-server-setup",
      "network-equipment-small-business",
      "how-to-set-up-business-wifi",
      "business-workstation-vs-consumer-pc",
      "it-hardware-lifecycle-management",
      "it-hardware-budget-small-business",
      "monitor-setup-for-productivity",
    ],
  },
  {
    slug: "endpoint-security",
    title: "EDR & Endpoint Security",
    description:
      "How endpoint detection and response (EDR) protects your business from ransomware, malware, and advanced threats. We explain how EDR works, compare leading solutions, and help SMBs understand what level of endpoint protection they actually need.",
    metaDescription:
      "Endpoint security and EDR guides for small businesses. Learn how endpoint detection and response protects against ransomware, malware, and cyber threats.",
    articleSlugs: [
      "what-is-edr-endpoint-detection-response",
      "edr-vs-antivirus",
      "best-edr-solutions-small-business",
      "crowdstrike-vs-sentinelone-for-smb",
      "endpoint-protection-platform-comparison",
      "edr-implementation-guide",
      "edr-false-positives-how-to-reduce",
      "ransomware-protection-for-small-business",
      "zero-trust-endpoint-security",
      "byod-security-policy",
    ],
  },
  {
    slug: "managed-detection-response",
    title: "MDR & Managed Security",
    description:
      "Managed detection and response (MDR) gives small businesses enterprise-grade security monitoring without an in-house SOC. We cover what MDR includes, how it differs from EDR, pricing models, and how to evaluate MDR providers for your business.",
    metaDescription:
      "MDR and managed security guides for SMBs. Understand managed detection and response, compare providers, and learn what 24/7 security monitoring costs.",
    articleSlugs: [
      "what-is-mdr-cybersecurity",
      "mdr-vs-edr",
      "best-mdr-providers-small-business",
      "mdr-pricing-how-much-does-it-cost",
      "mdr-vs-siem",
      "mdr-vs-mssp",
      "24-7-security-monitoring-small-business",
    ],
  },
  {
    slug: "backup-disaster-recovery",
    title: "Backup & Disaster Recovery",
    description:
      "Protect your business data with the right backup and disaster recovery strategy. We cover cloud backup, on-premise solutions, RTOs, RPOs, and step-by-step planning guides to ensure your business can recover from any data loss scenario.",
    metaDescription:
      "Business backup and disaster recovery guides. Learn cloud backup strategies, RTO/RPO planning, and how to protect your SMB from data loss.",
    articleSlugs: [
      "best-backup-solution-small-business",
      "disaster-recovery-plan-small-business",
      "cloud-backup-vs-on-premise",
      "ransomware-backup-strategy",
      "business-continuity-plan-template",
      "rto-vs-rpo-explained",
      "veeam-vs-acronis-for-smb",
    ],
  },
  {
    slug: "patch-management",
    title: "Patch Management & Updates",
    description:
      "Keeping software and systems up to date is one of the most effective and overlooked security measures. We explain patch management tools, automated update strategies, compliance requirements, and how to build a patching schedule that works for small teams.",
    metaDescription:
      "Patch management guides for small businesses. Learn automated patching tools, update strategies, and compliance best practices to reduce security risk.",
    articleSlugs: [
      "what-is-patch-management",
      "automated-patch-management",
      "patch-management-best-practices",
      "patch-management-tools-comparison",
      "windows-patch-management-guide",
      "vulnerability-management-vs-patch-management",
    ],
  },
  {
    slug: "cybersecurity-smb",
    title: "Cybersecurity for Small Business",
    description:
      "Practical cybersecurity advice written for small business owners and IT managers — not security engineers. We cover phishing prevention, employee training, password policies, MFA, compliance basics, and building a security-first culture on a real-world budget.",
    metaDescription:
      "Cybersecurity tips and guides for small businesses. Practical advice on phishing, MFA, compliance, employee training, and building a security-first culture.",
    articleSlugs: [
      "cybersecurity-for-small-business",
      "how-much-does-cybersecurity-cost-small-business",
      "cybersecurity-assessment-checklist",
      "most-common-cyber-attacks-small-business",
      "cybersecurity-compliance-for-small-business",
      "cyber-insurance-small-business",
      "employee-cybersecurity-training",
      "multi-factor-authentication-for-business",
      "zero-trust-security-model-explained",
      "cybersecurity-incident-response-plan",
    ],
  },
  {
    slug: "it-buying-guide",
    title: "IT Buying Guides & Comparisons",
    description:
      "Side-by-side comparisons and honest buying guides for IT products and services. We break down pricing, features, pros and cons, and suitability for different business sizes so you can make informed purchasing decisions without the sales pressure.",
    metaDescription:
      "IT product buying guides and vendor comparisons for SMBs. Honest breakdowns of pricing, features, and best-fit recommendations for your business.",
    articleSlugs: [
      "managed-it-vs-in-house-it",
      "how-to-choose-an-it-vendor",
      "it-budget-for-small-business",
      "it-audit-checklist-small-business",
      "when-to-outsource-it",
      "msp-vs-var-which-do-you-need",
      "technology-refresh-cycle",
      "it-vendor-negotiation-tips",
      "saas-vs-on-premise-software",
      "it-procurement-process-small-business",
    ],
  },
];

export function getClusterBySlug(slug: string): BlogCluster | undefined {
  return blogClusters.find((c) => c.slug === slug);
}
