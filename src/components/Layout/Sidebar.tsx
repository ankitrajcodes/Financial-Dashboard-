import { LayoutDashboard, Receipt, BarChart3, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'


const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar = () => (
  <div className="border-r bg-background">
    <div className="flex h-full flex-col p-4">
      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `w-full flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  </div>
)

export default Sidebar

