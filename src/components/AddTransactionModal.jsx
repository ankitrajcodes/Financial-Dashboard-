import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransactionsStore } from '../stores/useTransactionsStore.js'
import { mockTransactions, categories } from '../data/mockData.js'
import { formatCurrency } from '../utils/formatters.js'

export default function AddTransactionModal({ onClose }) {
  const addTransaction = useTransactionsStore((state) => state.addTransaction)
  const [formData, setFormData] = useState({
    date: '2024-10-18',
    amount: '',
    category: 'Salary',
    type: 'expense',
    description: '',
    merchant: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) return
    
    const amountNum = formData.type === 'income' 
      ? parseFloat(formData.amount)
      : -parseFloat(formData.amount)

    addTransaction({ 
      ...formData, 
      amount: amountNum 
    })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/50 p-6 rounded-t-3xl">
            <h3 className="text-2xl font-bold mb-2">➕ New Transaction</h3>
            <p className="text-gray-600">Admin only feature</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-5 h-5 text-success border-gray-300 rounded focus:ring-success"
                  />
                  <span className="ml-2 text-lg font-semibold text-success">📈 Income</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-5 h-5 text-danger border-gray-300 rounded focus:ring-danger"
                  />
                  <span className="ml-2 text-lg font-semibold text-danger">📉 Expense</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What did you buy?"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Merchant</label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => setFormData({...formData, merchant: e.target.value})}
                placeholder="Store name"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-danger"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-success"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
