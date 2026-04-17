import { createContext, useContext, useState, useMemo } from 'react';
import { mockTransactions, balanceTrendData, spendingBreakdown, insights } from '../data.js';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [role, setRole] = useState('viewer'); // 'viewer' | 'admin'
  const [filter, setFilter] = useState({ type: 'all', category: 'all', search: '' });
  const [sortBy, setSortBy] = useState('date');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Type filter
    if (filter.type !== 'all') {
      filtered = filtered.filter(t => t.type === filter.type);
    }

    // Category filter
    if (filter.category !== 'all') {
      filtered = filtered.filter(t => t.category === filter.category);
    }

    // Search filter
    if (filter.search) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.merchant.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
      return 0;
    });

    return filtered;
  }, [transactions, filter, sortBy]);

  // Financial summary
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(
      transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );
    const balance = totalIncome - totalExpense;

    return { balance, income: totalIncome, expense: totalExpense };
  }, [transactions]);

  // Category spending
  const categorySpending = useMemo(() => {
    const spending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(spending).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Add transaction
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [{ id: Date.now(), ...newTransaction }, ...prev]);
    setShowAddModal(false);
  };

  // Update transaction
  const updateTransaction = (updatedTransaction) => {
    setTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
  };

  // Delete transaction (admin only)
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const value = {
    transactions: filteredTransactions,
    summary,
    balanceTrendData,
    spendingBreakdown: categorySpending.length > 0 ? categorySpending : spendingBreakdown,
    insights,
    role,
    setRole,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    editingTransaction,
    setEditingTransaction,
    showAddModal,
    setShowAddModal,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currency,
    setCurrency,
    formatCurrency,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

