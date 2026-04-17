import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction } from '../../stores/useTransactionsStore'

interface Props {
  transactions: Transaction[]
}

const BalanceTrendChart = ({ transactions }: Props) => {
  // Group by month for trend
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.toISOString().slice(0, 7)
    const amount = t.type === 'income' ? t.amount : -t.amount
    acc[month] = (acc[month] || 0) + amount
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce((acc, [month, value], i) => {
      acc.push({ month, balance: value, index: i })
      return acc
    }, [] as { month: string; balance: number; index: number }[])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Monthly Balance" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BalanceTrendChart

