import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useTransactionsStore } from '../../stores/useTransactionsStore'
import { Award, TrendingUpDown } from 'lucide-react'

const InsightsCards = () => {
  const { filteredTransactions } = useTransactionsStore()

  if (filteredTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No transactions for insights</p>
        </CardContent>
      </Card>
    )
  }

  const expenses = filteredTransactions.filter(t => t.type === 'expense')
  const highestCategory = expenses.reduce((max, t) => {
    const catTotal = expenses.filter(e => e.category === t.category).reduce((sum, e) => sum + e.amount, 0)
    return catTotal > (max.total || 0) ? { category: t.category, total: catTotal } : max
  }, { category: '', total: 0 })

  const avgExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length || 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Highest Spending Category</CardTitle>
          <Award className="h-6 w-6 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{highestCategory.category}</div>
          <p className="text-muted-foreground">Total: ${highestCategory.total.toFixed(0)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Average Expense</CardTitle>
          <TrendingUpDown className="h-6 w-6" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${avgExpense.toFixed(0)}</div>
          <p className="text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default InsightsCards

