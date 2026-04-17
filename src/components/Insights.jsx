import { motion } from 'framer-motion'
import { useTransactionsStore } from '../stores/useTransactionsStore.js'
import { formatCurrency } from '../utils/formatters.js'
// Replaced react-icons with emoji for consistency and to avoid import issues

export function Insights() {
  const { insights } = useTransactionsStore()

  const insightsData = [
    {
      title: 'Top Spending Category',
      value: insights.topSpendingCategory || 'N/A',
      icon: '📊',
      color: 'from-rose-500 to-pink-500',
      trend: '-24%'
    },
    {
      title: 'Monthly Trend',
      value: insights.monthlyTrend === 'up' ? '↑ Increased' : '↓ Decreased',
      icon: '📈',
      color: insights.monthlyTrend === 'up' ? 'from-danger to-red-500' : 'from-success to-emerald-500',
      trend: insights.monthlyTrend === 'up' ? '+12%' : '-8%'
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(insights.avgTransaction || 0),
      icon: '💰',
      color: 'from-primary-500 to-indigo-500',
      trend: 'Consistent'
    },
    {
      title: 'Largest Transaction',
      value: formatCurrency(insights.highestTransaction || 0),
      icon: '💵',
      color: 'from-yellow-500 to-amber-500',
      trend: '+45%'
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-slate-800 bg-clip-text text-transparent">
        💡 Quick Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightsData.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="glass-card p-6 text-center group"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${insight.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 text-2xl`}>
              {insight.icon}
            </div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-lg">{insight.title}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{insight.value}</p>
            <p className="text-sm opacity-75">{insight.trend}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
