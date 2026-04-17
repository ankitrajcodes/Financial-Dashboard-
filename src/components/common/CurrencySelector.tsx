import { useState } from 'react'
import { Button } from '../ui/button'
import { DollarSign, Euro } from 'lucide-react'

const currencies = [
  { code: 'USD', symbol: '$', icon: DollarSign },
  { code: 'EUR', symbol: '€', icon: Euro },
{ code: 'INR', symbol: '₹', icon: DollarSign },
]

interface Props {
  value?: string
  onChange?: (currency: string) => void
}

const CurrencySelector = ({ value = 'USD', onChange }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (code: string) => {
    onChange?.(code)
    setOpen(false)
  }

  const Icon = currencies.find(c => c.code === value)?.icon || DollarSign

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-[120px] justify-start gap-2"
      >
        <Icon className="h-4 w-4" />
        <span>{value}</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[120px] rounded-md border bg-background p-2 shadow-lg">
          {currencies.map((currency) => (
            <Button
              key={currency.code}
              variant="ghost"
              className="w-full justify-start gap-2 p-2 text-left hover:bg-accent"
              onClick={() => handleSelect(currency.code)}
            >
              <currency.icon className="h-4 w-4" />
              <span>{currency.code}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrencySelector

