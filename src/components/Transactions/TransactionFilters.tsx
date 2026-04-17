import { useTransactionsStore } from '../../stores/useTransactionsStore'
import { Button } from '../ui/button'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const TransactionFilters = () => {
  const { setFilters, filters } = useTransactionsStore()
  const { role } = useAuthStore()
  const isAdmin = role === 'admin'

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search transactions..."
          className="w-full rounded-md border border-input bg-background px-11 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={filters.search || ''}
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setFilters({})}>
          <Filter className="mr-2 h-4 w-4" />
          Clear
        </Button>
        {isAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </div>
    </div>
  )
}

export default TransactionFilters

