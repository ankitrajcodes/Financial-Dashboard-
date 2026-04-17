import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'

const TransactionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>
      <TransactionFilters />
      <TransactionList />
    </div>
  )
}

export default TransactionsPage

