import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockTransactions'

export interface Transaction {
  id: string
  date: Date
  amount: number
  category: string
  type: 'income' | 'expense'
  description: string
}

interface TransactionsState {
  transactions: Transaction[]
  filters: {
    type?: 'income' | 'expense' | 'all'
    category?: string
    search?: string
    dateFrom?: Date
    dateTo?: Date
  }
  sortBy: 'date' | 'amount' | 'category'
  sortOrder: 'asc' | 'desc'
  filteredTransactions: Transaction[]
  setFilters: (filters: Partial<TransactionsState['filters']>) => void
  setSort: (sortBy: TransactionsState['sortBy'], sortOrder: TransactionsState['sortOrder']) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      filters: { type: 'all' },
      sortBy: 'date',
      sortOrder: 'desc',
      filteredTransactions: mockTransactions,
      setFilters: (newFilters) =>
        set((state) => {
          const filters = { ...state.filters, ...newFilters }
          let filtered = get().transactions

          if (filters.type !== 'all') {
            filtered = filtered.filter((t) => t.type === filters.type)
          }
          if (filters.category) {
            filtered = filtered.filter((t) => t.category === filters.category)
          }
          if (filters.search) {
            const search = filters.search.toLowerCase()
            filtered = filtered.filter(
              (t) =>
                t.description.toLowerCase().includes(search) ||
                t.category.toLowerCase().includes(search)
            )
          }
          if (filters.dateFrom) {
            filtered = filtered.filter((t) => t.date >= filters.dateFrom!)
          }
          if (filters.dateTo) {
            filtered = filtered.filter((t) => t.date <= filters.dateTo!)
          }

          return { filters, filteredTransactions: filtered }
        }),
      setSort: (sortBy, sortOrder) =>
        set((state) => ({
          sortBy,
          sortOrder,
          filteredTransactions: [...state.filteredTransactions].sort((a, b) => {
            let aVal, bVal
            if (sortBy === 'date') {
              aVal = a.date.getTime()
              bVal = b.date.getTime()
            } else if (sortBy === 'amount') {
              aVal = a.amount
              bVal = b.amount
            } else {
              aVal = a.category
              bVal = b.category
            }
            if (sortOrder === 'asc') return aVal > bVal ? 1 : -1
            return aVal < bVal ? 1 : -1
          }),
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { id: crypto.randomUUID(), ...transaction },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'transactions-storage',
    }
  )
)

