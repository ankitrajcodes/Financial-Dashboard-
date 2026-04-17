import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { RoleSwitcher } from './components/RoleSwitcher.jsx'
import { DashboardOverview } from './components/DashboardOverview.jsx'
import { Transactions } from './components/Transactions.jsx'
import { Insights } from './components/Insights.jsx'
import AddTransactionModal from './components/AddTransactionModal.jsx'


function App() {
  const [currentRole, setCurrentRole] = useState('admin')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card sticky top-0 z-50 mx-6 mt-6 backdrop-blur-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
          >
            💰 Finance Dashboard
          </motion.h1>
          <RoleSwitcher 
            currentRole={currentRole} 
            onRoleChange={setCurrentRole}
            className="w-full md:w-auto"
          />
        </div>
      </motion.header>

      <main className="mx-6 mb-12">
        {/* Dashboard Sections */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="space-y-8"
        >
          <DashboardOverview />
          <Insights />
          <Transactions 
            currentRole={currentRole}
            onAddTransaction={() => setShowModal(true)}
          />
        </motion.section>
      </main>

      {/* Admin Modal */}
      {currentRole === 'admin' && showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default App

