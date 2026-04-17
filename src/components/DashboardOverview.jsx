import { motion } from 'framer-motion'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTransactionsStore } from '../stores/useTransactionsStore.js'
import { formatCurrency } from '../utils/formatters.js'
// Removed unused react-icons imports that were causing build errors
// Icons not actually used in render

const COLORS = ['#6366f1', '#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#EC4899']

export function DashboardOverview() {
  const { summary, filteredTransactions } = useTransactionsStore()

  // Prepare chart data
  const trendData = filteredTransactions
    .slice(-7) // Last 7 days for trend
    .reduce((acc, trans, i) => {
      const date = new Date(trans.date).toLocaleDateString()
      acc[date] = (acc[date] || 0) + trans.amount
      return acc
    }, {})

  const chartData = Object.entries(trendData)
    .map(([date, value], i) => ({ date, value, fill: `hsl(${220 + i * 30}, 70%, 50%)` }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Pie data for spending breakdown
  const pieData = Object.entries(summary.categoryTotals || {})
    .filter(([_, value]) => value < 0)
    .map(([name, value]) => ({ name, value: Math.abs(value) }))
    .slice(0, 6)
    .sort((a, b) => b.value - a.value)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-slate-800 bg-clip-text text-transparent">
        📊 Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="glass-card p-8 text-center"
        >
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-primary-600">{formatCurrency(summary.balance)}</p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="glass-card p-8 text-center"
        >
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Income</h3>
          <p className="text-3xl font-bold text-success">{formatCurrency(summary.income)}</p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="glass-card p-8 text-center"
        >
          <div className="text-4xl mb-4">📉</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Expenses</h3>
          <p className="text-3xl font-bold text-danger">-{formatCurrency(summary.expenses)}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Balance Trend */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8"
        >
          <h4 className="text-2xl font-bold mb-6">Balance Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#trendGradient)" 
                strokeWidth={4}
                dot={{ fill: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8"
        >
          <h4 className="text-2xl font-bold mb-6">Spending Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  )
}
