import { useTheme } from '../hooks/useTheme'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { AnalysisHistory } from '../components/analysis/../dashboard/AnalysisHistory'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">Your analysis history</p>
          </div>
          <Link to="/">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
        </div>
        <AnalysisHistory />
      </div>
    </DashboardLayout>
  )
}
