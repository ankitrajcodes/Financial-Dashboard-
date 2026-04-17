import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'
import TransactionsPage from './components/Transactions/TransactionsPage'
import InsightsPage from './components/Insights/InsightsPage'
import { useAuthStore } from './stores/useAuthStore'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const restoreAuth = useAuthStore((state) => state.restoreAuth)

  useEffect(() => {
    restoreAuth()
  }, [restoreAuth])

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased grid md:grid-cols-[220px_1fr]">
        {isLoggedIn ? (
          <>
            <Sidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App

