'use client';

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://byvibe.ai';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ByVibe',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'An orchestration layer for Vibe Coding. We inject engineering rigor into AI workflows.',
    sameAs: [
      // 可以添加社交媒体链接
      // 'https://twitter.com/byvibe',
      // 'https://github.com/byvibe',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'make@byvibe.ai',
      contactType: 'Customer Service',
    },
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ByVibe Studio',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: 'AI-powered orchestration layer for Vibe Coding. Transform natural language into scalable software products.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ByVibe',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
