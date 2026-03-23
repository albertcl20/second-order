import { Story } from '@/src/types/story';

export const mockStories: Story[] = [
  {
    id: 'openai-enterprise-stack',
    kicker: 'AI Infrastructure',
    title: 'Foundation model vendors keep moving up the stack into enterprise workflows',
    readingTime: 4,
    publishedAt: '2026-03-23T05:00:00Z',
    topic: 'AI',
    summary:
      'Major AI platform players are expanding from raw models into workflow, collaboration, and operational surfaces once owned by SaaS products.',
    analysis: {
      whatHappened:
        'Large AI vendors are expanding product scope from model access toward more integrated workflow and enterprise surfaces.',
      whyItMatters:
        'This changes where value accrues. Standalone SaaS tools may face margin pressure if core capabilities are absorbed into upstream AI platforms.',
      whoBenefits: ['AI platform vendors', 'Enterprises consolidating tooling', 'Infrastructure layers with distribution'],
      whoLoses: ['Thin-wrapper SaaS products', 'Tools with weak proprietary workflow depth'],
      whatHappensNext: ['More bundling pressure', 'Harder differentiation for generic AI apps', 'Rising importance of workflow-specific moats'],
      whatToWatch: ['Pricing compression', 'Distribution partnerships', 'Platform-native enterprise admin controls'],
      opportunityRisk:
        'Opportunity: workflow-specific products with deep context. Risk: generic AI feature apps get flattened.',
      confidence: 'High confidence',
      uncertainty:
        'Exact timing varies by category and procurement inertia can slow platform consolidation.',
    },
    sources: [
      { label: 'Primary reporting', url: 'https://example.com/story-1' },
      { label: 'Company announcement', url: 'https://example.com/story-1-source' },
    ],
    tags: ['enterprise-ai', 'software-pricing', 'workflow-moats'],
    watchTokens: ['OpenAI', 'Microsoft', 'Anthropic', 'SaaS pricing'],
    recommendedFor: ['Founder', 'Product', 'Operator'],
    signals: {
      market: 88,
      product: 92,
      operatingRisk: 70,
      distribution: 91,
    },
  },
  {
    id: 'eu-ai-act-procurement',
    kicker: 'Regulation',
    title: 'EU AI regulation is becoming a procurement filter, not just a legal problem',
    readingTime: 5,
    publishedAt: '2026-03-23T04:00:00Z',
    topic: 'Policy',
    summary:
      'Compliance expectations around AI are increasingly surfacing in enterprise buying processes before many firms fully understand their obligations.',
    analysis: {
      whatHappened:
        'EU AI compliance expectations are increasingly shaping vendor reviews, trust conversations, and customer due diligence.',
      whyItMatters:
        'For many software teams, regulation is now a go-to-market constraint. Teams that can explain controls clearly may close faster.',
      whoBenefits: ['Vendors with mature documentation', 'Compliance tooling providers', 'Enterprise buyers demanding clarity'],
      whoLoses: ['Teams with vague AI messaging', 'Startups unable to answer procurement questions'],
      whatHappensNext: ['More AI questionnaires in deals', 'Demand for evidence packs', 'More product decisions shaped by legal and reputation risk'],
      whatToWatch: ['Standardized questionnaires', 'Buyer security reviews', 'Shift from AI hype to AI trust posture'],
      opportunityRisk:
        'Opportunity: trust tooling and clear compliance narratives. Risk: sales friction for unprepared teams.',
      confidence: 'Plausible',
      uncertainty:
        'Enforcement timing differs from procurement behavior, which may move earlier and unevenly across sectors.',
    },
    sources: [
      { label: 'Policy overview', url: 'https://example.com/story-2' },
      { label: 'Market commentary', url: 'https://example.com/story-2-source' },
    ],
    tags: ['ai-governance', 'enterprise-sales', 'compliance'],
    watchTokens: ['EU AI Act', 'procurement', 'security review'],
    recommendedFor: ['Founder', 'Operator', 'Investor'],
    signals: {
      market: 81,
      product: 63,
      operatingRisk: 94,
      distribution: 72,
    },
  },
  {
    id: 'search-traffic-zero-click',
    kicker: 'Distribution',
    title: 'Zero-click answer surfaces keep draining traffic from publisher and SaaS acquisition funnels',
    readingTime: 4,
    publishedAt: '2026-03-23T03:10:00Z',
    topic: 'Markets',
    summary:
      'Search, assistants, and platform-native answers are reducing how often users click through to source sites, weakening content-led acquisition loops.',
    analysis: {
      whatHappened:
        'Answer engines increasingly satisfy simple intent directly in-platform, reducing the share of traffic that reaches underlying publishers and software sites.',
      whyItMatters:
        'If discovery compresses into a few interfaces, traffic-dependent growth models become less reliable and brand strength matters more.',
      whoBenefits: ['Platforms controlling the answer layer', 'Brands with direct audience relationships', 'Products with habitual usage'],
      whoLoses: ['SEO-only growth motions', 'Publishers dependent on commodity traffic', 'Undifferentiated comparison sites'],
      whatHappensNext: ['More focus on owned audiences', 'Better instrumentation of branded demand', 'Rethink of top-of-funnel metrics'],
      whatToWatch: ['Search referral declines', 'Assistant attribution models', 'Growth in newsletter and community channels'],
      opportunityRisk:
        'Opportunity: direct-distribution products and analytics for new funnel attribution. Risk: slow erosion hides the urgency.',
      confidence: 'Plausible',
      uncertainty: 'Different categories will feel the squeeze at different speeds depending on intent complexity and brand power.',
    },
    sources: [
      { label: 'Industry analysis', url: 'https://example.com/story-3' },
      { label: 'Traffic trend commentary', url: 'https://example.com/story-3-source' },
    ],
    tags: ['seo', 'acquisition', 'answer-engines'],
    watchTokens: ['Google', 'Perplexity', 'ChatGPT search', 'SEO'],
    recommendedFor: ['Founder', 'Product', 'Investor'],
    signals: {
      market: 84,
      product: 66,
      operatingRisk: 58,
      distribution: 96,
    },
  },
  {
    id: 'gpu-supply-enterprise-buying',
    kicker: 'Infrastructure',
    title: 'GPU access is shifting from a startup bottleneck to an enterprise budgeting decision',
    readingTime: 3,
    publishedAt: '2026-03-23T02:20:00Z',
    topic: 'Infrastructure',
    summary:
      'As compute supply improves unevenly, the constraint is moving from raw access toward cost discipline, architecture choices, and ROI scrutiny.',
    analysis: {
      whatHappened:
        'The AI infrastructure conversation is maturing from panic about access to more nuanced questions about unit economics, stack choices, and internal demand control.',
      whyItMatters:
        'This favors operators who can match model quality, latency, and spend to the actual use case instead of overbuying prestige infrastructure.',
      whoBenefits: ['Cost-aware operators', 'Inference optimization vendors', 'Teams with strong workload visibility'],
      whoLoses: ['Companies buying capacity without demand discipline', 'Products whose economics only work at subsidized infrastructure prices'],
      whatHappensNext: ['More architecture reviews', 'Pressure to justify GPU-heavy features', 'Renewed interest in smaller models and caching'],
      whatToWatch: ['Inference margin trends', 'Enterprise FinOps for AI', 'Hybrid deployment patterns'],
      opportunityRisk:
        'Opportunity: workload observability, inference routing, and AI cost governance. Risk: teams still optimize for hype over economics.',
      confidence: 'High confidence',
      uncertainty: 'Supply is not uniform globally, so some sectors will still face hard constraints even as the narrative shifts.',
    },
    sources: [
      { label: 'Infrastructure market note', url: 'https://example.com/story-4' },
      { label: 'Cloud pricing commentary', url: 'https://example.com/story-4-source' },
    ],
    tags: ['gpu', 'finops', 'model-routing'],
    watchTokens: ['NVIDIA', 'cloud pricing', 'inference'],
    recommendedFor: ['Operator', 'Founder', 'Investor'],
    signals: {
      market: 76,
      product: 71,
      operatingRisk: 89,
      distribution: 48,
    },
  },
];
