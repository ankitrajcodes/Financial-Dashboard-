import { useAuthStore } from '../../stores/useAuthStore'
import { Button } from '../ui/button'
import { User, Shield } from 'lucide-react'

const RoleToggle = () => {
  const { role, setRole } = useAuthStore()
  const isAdmin = role === 'admin'

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={isAdmin ? "default" : "outline"}
        size="sm"
        onClick={() => setRole('admin')}
        className="gap-1"
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Admin</span>
      </Button>
      <Button
        variant={!isAdmin ? "default" : "outline"}
        size="sm"
        onClick={() => setRole('viewer')}
        className="gap-1"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Viewer</span>
      </Button>
    </div>
  )
}

export default RoleToggle

