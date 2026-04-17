import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockData.js'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const getMonthSummary = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const balance = income - expenses

  const categoryTotals = {}
  transactions.forEach(t => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0
    categoryTotals[t.category] += t.type === 'income' ? t.amount : -t.amount
  })

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))[0]

  return { income, expenses, balance, topCategory: topCategory[0], categoryTotals }
}

export const useTransactionsStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      filters: { 
        search: '', 
        category: 'all', 
        type: 'all',
        dateFrom: '',
        dateTo: ''
      },
      sortBy: 'date',
      sortOrder: 'desc',

      setFilters: (filters) => set({ filters }),
      setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
      addTransaction: (transaction) => {
        const newTrans = { 
          ...transaction, 
          id: Date.now(), 
          date: format(new Date(transaction.date), 'yyyy-MM-dd')
        }
        set((state) => ({ transactions: [...state.transactions, newTrans] }))
      },
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }))
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }))
      },

      // Computed values
      get filteredTransactions() {
        const { transactions, filters, sortBy, sortOrder } = get()
        let filtered = [...transactions]

        // Search
        if (filters.search) {
          filtered = filtered.filter(t =>
            t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            t.merchant.toLowerCase().includes(filters.search.toLowerCase()) ||
            t.category.toLowerCase().includes(filters.search.toLowerCase())
          )
        }

        // Category
        if (filters.category !== 'all') {
          filtered = filtered.filter(t => t.category === filters.category)
        }

        // Type
        if (filters.type !== 'all') {
          filtered = filtered.filter(t => t.type === filters.type)
        }

        // Date range
        if (filters.dateFrom) {
          filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom))
        }
        if (filters.dateTo) {
          filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo))
        }

        // Sort
        filtered.sort((a, b) => {
          let aVal = a[sortBy]
          let bVal = b[sortBy]
          if (sortBy === 'amount') {
            aVal = Math.abs(aVal)
            bVal = Math.abs(bVal)
          }
          if (sortBy === 'date') {
            aVal = new Date(aVal)
            bVal = new Date(bVal)
          }
          if (aVal < bVal) return sortOrder === 'desc' ? 1 : -1
          if (aVal > bVal) return sortOrder === 'desc' ? -1 : 1
          return 0
        })

        return filtered
      },

      get summary() {
        return getMonthSummary(this.filteredTransactions)
      },

      get insights() {
        const { transactions } = get()
        const currentMonthExpenses = transactions
          .filter(t => t.type === 'expense' && 
            new Date(t.date) >= startOfMonth(new Date()))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        const lastMonthExpenses = transactions
          .filter(t => t.type === 'expense' && 
            new Date(t.date) >= startOfMonth(new Date(Date.now() - 2592000000)) &&
            new Date(t.date) < startOfMonth(new Date()))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const avgTransaction = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length
        const highestSingle = Math.max(...transactions.map(t => Math.abs(t.amount)))

        return {
          topSpendingCategory: get().summary.topCategory,
          monthlyTrend: currentMonthExpenses > lastMonthExpenses ? 'up' : 'down',
          avgTransaction: Math.round(avgTransaction),
          highestTransaction: highestSingle
        }
      }
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({ transactions: state.transactions, filters: state.filters })
    }
  )
)

