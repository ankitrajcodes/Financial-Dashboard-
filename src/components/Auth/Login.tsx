import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Phone } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const Login = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [role, setRole] = useState<'viewer' | 'admin'>('viewer')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)



  const handlePhoneSubmit = () => {
    if (mobile.length === 10) {
      setStep('otp')
    }
  }

  const handleOtpSubmit = () => {
    // Mock OTP verify
    if (otp === '123456') {
      login(mobile, role)
      navigate('/')
    } else {
      alert('Invalid OTP. Use 123456')
    }
  }

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-6">
            <Button variant="outline" className="w-full gap-2">
              <span className="h-5 w-5">G</span>
              <span>Continue with Google</span>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {step === 'phone' ? (
            <div className="grid gap-2">
              <div className="grid gap-1">
                <label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    className="flex h-11 w-full rounded-md border border-input px-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>
              <Button onClick={handlePhoneSubmit} disabled={mobile.length !== 10}>
                Continue
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <div className="grid gap-1">
                <label className="text-sm font-medium">OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6 digit OTP"
                  className="flex h-11 w-full rounded-md border border-input px-3 py-2 text-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">Use OTP: 123456</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setRole('viewer')}>
                  Viewer
                </Button>
                <Button variant="outline" onClick={() => setRole('admin')}>
                  Admin
                </Button>
              </div>
              <Button onClick={handleOtpSubmit}>Sign In</Button>
              <Button variant="link" onClick={() => setStep('phone')}>
                Change number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

