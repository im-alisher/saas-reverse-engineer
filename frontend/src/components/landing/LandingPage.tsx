import { useTheme } from '../../hooks/useTheme'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
