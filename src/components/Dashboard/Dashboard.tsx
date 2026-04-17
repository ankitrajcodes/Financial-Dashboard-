import SummaryCards from './SummaryCards'
import BalanceTrendChart from './BalanceTrendChart'
import SpendingBreakdownChart from './SpendingBreakdownChart'
import { useTransactionsStore } from '../../stores/useTransactionsStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAuthStore } from '../../stores/useAuthStore'

const Dashboard = () => {
  const { filteredTransactions } = useTransactionsStore()
  const { role } = useAuthStore()

  const balance = filteredTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
  const income = filteredTransactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0)
  const expenses = filteredTransactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <SummaryCards balance={balance} income={income} expenses={expenses} />
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Balance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceTrendChart transactions={filteredTransactions} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-0">
          <SpendingBreakdownChart transactions={filteredTransactions.filter(t => t.type === 'expense')} />
        </CardContent>
      </Card>
      {role === 'admin' && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admin tools here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

