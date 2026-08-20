import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold">AI SaaS Reverse Engineer</h1></div>} />
      </Routes>
    </div>
  )
}

export default App
