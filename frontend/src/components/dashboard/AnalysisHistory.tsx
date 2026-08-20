import { useAnalyses } from '../../hooks/useAnalysis'
import { AnalysisCard } from './AnalysisCard'
import { AnalysisCardSkeleton } from '../ui/Skeleton'
import { EmptyState } from './EmptyState'

export function AnalysisHistory() {
  const { data, isLoading, error } = useAnalyses()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnalysisCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Failed to load analyses. Please try again.</p>
      </div>
    )
  }

  if (!data?.data?.length) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.data.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </div>
  )
}
