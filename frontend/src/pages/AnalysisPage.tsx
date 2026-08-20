import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useCreateAnalysis, useAnalysis } from '../hooks/useAnalysis'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ProductSummary } from '../components/analysis/ProductSummary'
import { CoreFeatures } from '../components/analysis/CoreFeatures'
import { CompetitorAnalysis } from '../components/analysis/CompetitorAnalysis'
import { RevenueModel } from '../components/analysis/RevenueModel'
import { ArchitectureView } from '../components/analysis/ArchitectureView'
import { DatabaseSchema } from '../components/analysis/DatabaseSchema'
import { ApiDesign } from '../components/analysis/ApiDesign'
import { MvpRoadmap } from '../components/analysis/MvpRoadmap'
import { ArrowLeft, ExternalLink, Loader2, AlertCircle } from 'lucide-react'

export function AnalysisPage() {
  const { theme, toggleTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const url = searchParams.get('url')
  const createMutation = useCreateAnalysis()

  useEffect(() => {
    if (url && !createMutation.data) {
      createMutation.mutate(url)
    }
  }, [url])

  const analysisId = createMutation.data?.id
  const { data: analysis, error: pollError } = useAnalysis(analysisId || null)

  if (!url) {
    return (
      <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">No URL Provided</h2>
            <p className="text-text-secondary mb-6">Please enter a SaaS URL to analyze.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (createMutation.isPending || (analysisId && !analysis && !pollError)) {
    return (
      <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Card className="text-center py-16">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Analyzing {url}
            </h2>
            <p className="text-text-secondary">
              This may take a few moments while we analyze the product...
            </p>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (pollError || createMutation.error) {
    return (
      <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Analysis Failed</h2>
            <p className="text-text-secondary mb-6">
              {(pollError || createMutation.error)?.message || 'Something went wrong.'}
            </p>
            <Button onClick={() => navigate('/')}>Try Again</Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Analysis Results</h1>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
          >
            {url}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {analysis?.status === 'COMPLETED' ? (
          <div className="grid gap-6">
            <ProductSummary
              data={analysis.productSummary ?? null}
              businessDescription={analysis.businessDescription}
              targetAudience={analysis.targetAudience}
            />
            <CoreFeatures
              features={analysis.coreFeatures ?? null}
              userWorkflows={analysis.userWorkflows}
              valuePropositions={analysis.valuePropositions}
            />
            <CompetitorAnalysis
              competitors={analysis.competitors ?? null}
              marketPositioning={analysis.marketPositioning}
              strengths={analysis.strengths}
              weaknesses={analysis.weaknesses}
            />
            <RevenueModel
              revenue={analysis.revenueModel ?? null}
              pricingAssumptions={analysis.pricingAssumptions ?? null}
              monetizationOpportunities={analysis.monetizationOpportunities}
            />
            <ArchitectureView
              frontend={analysis.frontendArchitecture ?? null}
              backend={analysis.backendArchitecture ?? null}
              infrastructure={analysis.infrastructureSuggestions}
            />
            <DatabaseSchema
              schema={analysis.databaseSchema ?? null}
              suggestions={analysis.prismaSchemaSuggestions}
              entities={analysis.databaseEntities ?? null}
            />
            <ApiDesign
              endpoints={analysis.restEndpoints ?? null}
              requestDtos={analysis.requestDtos ?? null}
              responseDtos={analysis.responseDtos ?? null}
            />
            <MvpRoadmap
              phases={analysis.developmentPhases ?? null}
              timeline={analysis.timeline ?? null}
              milestones={analysis.milestones ?? null}
            />
          </div>
        ) : analysis?.status === 'FAILED' ? (
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Analysis Failed</h3>
            <p className="text-text-secondary">The analysis could not be completed.</p>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
            <p className="text-text-secondary">Processing your analysis...</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
