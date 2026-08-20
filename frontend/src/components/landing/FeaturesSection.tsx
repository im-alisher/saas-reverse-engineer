import { Brain, Database, Code, Layers, TrendingUp, Map } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Product Summary',
    description: 'Get a comprehensive overview of any SaaS product, including its core value proposition and target audience.',
  },
  {
    icon: Layers,
    title: 'Feature Extraction',
    description: 'Automatically identify core features, user workflows, and value propositions.',
  },
  {
    icon: TrendingUp,
    title: 'Competitor Analysis',
    description: 'Discover similar products, market positioning, strengths, and weaknesses.',
  },
  {
    icon: Database,
    title: 'Database Schema',
    description: 'Generate Prisma schema suggestions and database entity recommendations.',
  },
  {
    icon: Code,
    title: 'API Design',
    description: 'Get REST endpoint designs with request and response DTOs.',
  },
  {
    icon: Map,
    title: 'MVP Roadmap',
    description: 'Receive a development roadmap with phases, timelines, and milestones.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Everything you need to analyze a SaaS
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Our AI engine breaks down any SaaS product into actionable insights
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-surface border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
