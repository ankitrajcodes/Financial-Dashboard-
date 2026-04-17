import { useTransactionsStore } from '../../stores/useTransactionsStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button } from '../ui/button'
import { Trash2, Edit3 } from 'lucide-react'
import { format } from 'date-fns'

const TransactionList = () => {
  const { filteredTransactions, deleteTransaction } = useTransactionsStore()
  const { role } = useAuthStore()

  const isAdmin = role === 'admin'

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-medium">Date</th>
            <th className="text-left p-4 font-medium">Category</th>
            <th className="text-left p-4 font-medium">Description</th>
            <th className="text-right p-4 font-medium">Amount</th>
            <th className="text-left p-4 font-medium">Type</th>
            {isAdmin && <th className="text-right p-4 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-muted/50 last:border-b-0">
              <td className="p-4">{format(transaction.date, 'MMM dd, yyyy')}</td>
              <td className="p-4">{transaction.category}</td>
              <td className="p-4">{transaction.description}</td>
              <td className="p-4 text-right font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }">
                {transaction.amount.toFixed(2)}
              </td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type.toUpperCase()}
                </span>
              </td>
              {isAdmin && (
                <td className="p-4 text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteTransaction(transaction.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No transactions match your filters
        </div>
      )}
    </div>
  )
}

export default TransactionList

