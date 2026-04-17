import { motion } from 'framer-motion'
import { useTransactionsStore } from '../stores/useTransactionsStore.js'

export function RoleSwitcher({ currentRole, onRoleChange, className = '' }) {
  return (
    <motion.div 
      className={`glass-card p-4 rounded-2xl ${className}`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        User Role
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onRoleChange('viewer')}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
            currentRole === 'viewer'
              ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/25 transform -translate-y-1'
              : 'glass-card border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          👁️ Viewer Mode
        </button>
        <button
          onClick={() => onRoleChange('admin')}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
            currentRole === 'admin'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 transform -translate-y-1'
              : 'glass-card border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          ⚙️ Admin Mode
        </button>
      </div>
      <p className={`text-xs mt-2 ${
        currentRole === 'viewer' ? 'text-primary-600' : 'text-emerald-600'
      } font-medium`}>
        Current: {currentRole === 'viewer' ? 'Read-only view' : 'Full edit access'}
      </p>
    </motion.div>
  )
}
