import { format, parseISO } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return format(parseISO(dateString), 'MMM dd, yyyy')
}

export const formatShortDate = (dateString) => {
  return format(parseISO(dateString), 'MMM dd')
}

export const getTypeIcon = (type) => {
  return type === 'income' ? '📈' : '📉'
}

export const getCategoryColor = (category) => {
  const colors = {
    'Salary': 'from-emerald-500 to-green-500',
    'Freelance': 'from-blue-500 to-indigo-500',
    'Investment': 'from-purple-500 to-violet-500',
    'Refund': 'from-orange-400 to-amber-500',
    'Rent': 'from-red-500 to-rose-500',
    'Food': 'from-amber-400 to-orange-400',
    'Groceries': 'from-green-400 to-emerald-400',
    'Transportation': 'from-cyan-500 to-blue-500',
    'Utilities': 'from-yellow-400 to-amber-500',
    'Shopping': 'from-pink-400 to-rose-400',
    'Entertainment': 'from-indigo-400 to-purple-400',
  }
  return colors[category] || 'from-gray-400 to-gray-500'
}

