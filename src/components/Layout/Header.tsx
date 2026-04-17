
import { useAuthStore } from '../../stores/useAuthStore'
import { useThemeStore } from '../../stores/useThemeStore'
import { Button } from '../ui/button'
import { LogOut, User, Sun, Moon } from 'lucide-react'
import CurrencySelector from '../common/CurrencySelector'
import RoleToggle from '../common/RoleToggle'

const Header = () => {
  const { logout, mobile } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-bold">Finance Dashboard</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CurrencySelector />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <RoleToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="ml-2 hidden md:inline">Logout</span>
            </Button>
            <div className="ml-2 hidden md:block">
              {mobile ? `Hi, ${mobile.slice(0,3)}****` : <User className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

