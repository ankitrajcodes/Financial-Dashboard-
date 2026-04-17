import { useFinance } from '../contexts/FinanceContext';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  const { role, setRole } = useFinance();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">All caught up</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Dashboard User</p>
                <div className="flex items-center gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-sm text-gray-500 focus:outline-none bg-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span>|</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-sm text-gray-500 focus:outline-none bg-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="JPY">¥ JPY</option>
                    <option value="INR">₹ INR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

