import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransactionsStore } from '../stores/useTransactionsStore.js'
import { formatCurrency, formatDate, formatShortDate, getTypeIcon, getCategoryColor } from '../utils/formatters.js'
import { categories } from '../data/mockData.js'
// Replaced react-icons with SVG/emoji for consistency

export function Transactions({ currentRole, onAddTransaction }) {
  const [showFilters, setShowFilters] = useState(false)
  
  const {
    filteredTransactions,
    filters,
    setFilters,
    setSort,
    sortBy,
    sortOrder,
    deleteTransaction
  } = useTransactionsStore()

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const toggleSort = (field) => {
    setSort(field, sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc')
  }

  const sortIcon = (field) => {
    if (sortBy !== field) return '▼'
    return sortOrder === 'desc' ? '▼' : '▲'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-slate-800 bg-clip-text text-transparent">
          📋 Recent Transactions
          <span className="ml-2 bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full text-sm font-medium">
            {filteredTransactions.length}
          </span>
        </h2>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="glass-card p-3 rounded-2xl flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <span className="text-xl">🔍</span>
            Filters
          </motion.button>

          {currentRole === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTransaction}
              className="btn-primary flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              Add New
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="glass-card p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="glass-card p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              {/* Date range simplified */}
              <div className="glass-card p-3 rounded-xl flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">This Month</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 pr-4 w-20"></th>
              <th 
                className="text-left py-4 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 rounded-l-xl group"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700 group-hover:text-primary-600">
                  Date {sortIcon('date')}
                </div>
              </th>
              <th 
                className="text-left py-4 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 group"
                onClick={() => toggleSort('description')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700 group-hover:text-primary-600">
                  Description {sortIcon('description')}
                </div>
              </th>
              <th 
                className="text-left py-4 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 group"
                onClick={() => toggleSort('category')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700 group-hover:text-primary-600">
                  Category {sortIcon('category')}
                </div>
              </th>
              <th 
                className="text-right py-4 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 group"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2 font-semibold text-gray-700 group-hover:text-primary-600">
                  Amount {sortIcon('amount')}
                </div>
              </th>
              {currentRole === 'admin' && (
                <th className="text-right py-4 pr-4 w-24"></th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
                      transaction.type === 'income' 
                        ? 'bg-gradient-to-br from-success to-emerald-500 text-white' 
                        : 'bg-gradient-to-br from-danger to-red-500 text-white'
                    }`}>
                      {getTypeIcon(transaction.type)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatShortDate(transaction.date)}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.merchant}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(transaction.category)} text-white`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`text-2xl font-bold ${
                      transaction.type === 'income' ? 'text-success' : 'text-danger'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  {currentRole === 'admin' && (
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-110">
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-xl transition-all hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {filteredTransactions.length === 0 && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td colSpan={currentRole === 'admin' ? "6" : "5"} className="py-16 text-center">
                  <div className="text-gray-500 space-y-4">
                    <div className="text-6xl">📭</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No transactions found</h3>
                    <p>Try adjusting your filters or add new transactions</p>
                  </div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
