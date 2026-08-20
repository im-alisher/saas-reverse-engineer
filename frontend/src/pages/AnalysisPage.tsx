import { useTheme } from '../hooks/useTheme'
import { DashboardLayout } from '../components/layout/DashboardLayout'

export function AnalysisPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-text-primary">Analysis</h1>
        <p className="text-text-secondary mt-2">Analysis results will appear here.</p>
      </div>
    </DashboardLayout>
  )
}
