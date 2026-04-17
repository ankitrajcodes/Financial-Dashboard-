document.addEventListener('DOMContentLoaded', () => {
  // Mock data
  const mockTransactions = [
    { id: 1, date: '2024-01-15', amount: 1000, category: 'Salary', type: 'income' },
    { id: 2, date: '2024-01-16', amount: 150, category: 'Groceries', type: 'expense' },
    { id: 3, date: '2024-01-17', amount: 50, category: 'Transport', type: 'expense' },
    { id: 4, date: '2024-01-18', amount: 200, category: 'Entertainment', type: 'expense' },
    { id: 5, date: '2024-01-19', amount: 300, category: 'Salary', type: 'income' },
    { id: 6, date: '2024-01-20', amount: 75, category: 'Utilities', type: 'expense' },
    { id: 7, date: '2024-01-21', amount: 120, category: 'Dining', type: 'expense' },
    // Add more for demo
    { id: 8, date: '2024-01-22', amount: 500, category: 'Freelance', type: 'income' },
    { id: 9, date: '2024-01-23', amount: 80, category: 'Groceries', type: 'expense' },
    { id: 10, date: '2024-01-24', amount: 40, category: 'Transport', type: 'expense' },
  ];

  // State
  let state = {
    transactions: [...mockTransactions],
    filteredTransactions: [...mockTransactions],
    role: 'viewer', // 'viewer' or 'admin'
    filter: { category: 'all', type: 'all', search: '' },
    sort: { field: 'date', direction: 'desc' },
  };

  // DOM elements
  const root = document.getElementById('root');

  // Chart instances
  let trendChart, pieChart;

  // Utils
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  // Compute summaries
  const computeSummaries = (trans) => {
    const totalBalance = trans.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    const income = trans.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
    const expenses = trans.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
    return { totalBalance, income, expenses };
  };

  // Compute chart data
  const computeTrendData = (trans) => {
    const monthly = {};
    trans.forEach(t => {
      const month = t.date.slice(0, 7);
      monthly[month] = (monthly[month] || 0) + (t.type === 'income' ? t.amount : -t.amount);
    });
    return {
      labels: Object.keys(monthly),
      data: Object.values(monthly)
    };
  };

  const computePieData = (trans) => {
    const catExpenses = {};
    trans.filter(t => t.type === 'expense').forEach(t => {
      catExpenses[t.category] = (catExpenses[t.category] || 0) + t.amount;
    });
    return {
      labels: Object.keys(catExpenses),
      data: Object.values(catExpenses)
    };
  };

  // Insights
  const computeInsights = (trans) => {
    const expenses = trans.filter(t => t.type === 'expense');
    const highestCat = expenses.reduce((max, t) => {
      return (catExpenses[t.category] || 0) > (catExpenses[max.category] || 0) ? t : max;
    }, expenses[0] || { category: 'None' });
    const monthlyExpenses = {};
    expenses.forEach(t => {
      const month = t.date.slice(0, 7);
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + t.amount;
    });
    const currentMonth = Object.keys(monthlyExpenses).pop();
    const prevMonth = Object.keys(monthlyExpenses)[Object.keys(monthlyExpenses).length - 2];
    const comparison = prevMonth ? ((monthlyExpenses[currentMonth] - monthlyExpenses[prevMonth]) / monthlyExpenses[prevMonth] * 100).toFixed(1) : 0;
    return [
      `Highest spending category: ${highestCat.category}`,
      `Monthly expenses ${comparison > 0 ? 'up' : 'down'} by ${Math.abs(comparison)}%`,
      expenses.length > 0 ? `${expenses.length} expense transactions this month` : 'No expenses'
    ];
  };

  // Filter and sort
  const updateFilteredTransactions = () => {
    let filtered = [...state.transactions];
    if (state.filter.category !== 'all') filtered = filtered.filter(t => t.category === state.filter.category);
    if (state.filter.type !== 'all') filtered = filtered.filter(t => t.type === state.filter.type);
    if (state.filter.search) {
      const q = state.filter.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q) || // assume desc if added
        t.date.includes(q)
      );
    }
    // Sort
    filtered.sort((a, b) => {
      let valA = a[state.sort.field], valB = b[state.sort.field];
      if (state.sort.field === 'amount') { valA = parseFloat(valA); valB = parseFloat(valB); }
      if (state.sort.field === 'date') { valA = new Date(valA); valB = new Date(valB); }
      return state.sort.direction === 'asc' ? valA - valB : valB - valA;
    });
    state.filteredTransactions = filtered;
  };

  // Render functions
  const renderHeader = () => `
    <div class="bg-blue-600 text-white p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Finance Dashboard</h1>
        <div class="flex items-center space-x-4">
          <label>Role: </label>
          <select id="roleSelect" class="bg-white text-black px-3 py-1 rounded">
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  `;

  const renderSummaryCards = (summaries) => `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="text-lg font-semibold text-gray-700">Total Balance</h3>
        <p class="text-3xl font-bold text-green-600">${formatCurrency(summaries.totalBalance)}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="text-lg font-semibold text-gray-700">Income</h3>
        <p class="text-3xl font-bold text-green-500">${formatCurrency(summaries.income)}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="text-lg font-semibold text-gray-700">Expenses</h3>
        <p class="text-3xl font-bold text-red-500">${formatCurrency(summaries.expenses)}</p>
      </div>
    </div>
  `;

  const renderCharts = () => `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Balance Trend</h3>
        <canvas id="trendChart" height="200"></canvas>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Spending Breakdown</h3>
        <canvas id="pieChart" height="200"></canvas>
      </div>
    </div>
  `;

  const renderInsights = (insights) => `
    <div class="p-6 max-w-7xl mx-auto">
      <h3 class="text-xl font-semibold mb-4">Insights</h3>
      <ul class="bg-white p-6 rounded-lg shadow-md space-y-2">
        ${insights.map(insight => `<li class="text-lg">${insight}</li>`).join('')}
      </ul>
    </div>
  `;

  const renderTransactions = () => {
    if (state.filteredTransactions.length === 0) {
      return `
        <div class="p-6 max-w-7xl mx-auto">
          <p class="text-center text-gray-500 py-8">No transactions found</p>
        </div>
      `;
    }

    return `
      <div class="p-6 max-w-7xl mx-auto">
        <h3 class="text-xl font-semibold mb-4">Transactions</h3>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <div class="flex flex-col md:flex-row gap-4">
              <input id="searchInput" placeholder="Search..." class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <select id="categoryFilter" class="px-4 py-2 border rounded-lg">
                <option value="all">All Categories</option>
                <option value="Salary">Salary</option>
                <option value="Groceries">Groceries</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Dining">Dining</option>
                <option value="Freelance">Freelance</option>
              </select>
              <select id="typeFilter" class="px-4 py-2 border rounded-lg">
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              ${state.role === 'admin' ? `
                <button id="addTransaction" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Add Transaction</button>
              ` : ''}
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" data-sort="date">Date ${state.sort.field === 'date' ? (state.sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" data-sort="amount">Amount ${state.sort.field === 'amount' ? (state.sort.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="category">Category</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="type">Type</th>
                  ${state.role === 'admin' ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>' : ''}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${state.filteredTransactions.map(t => `
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(t.date)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${t.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}">${formatCurrency(t.amount)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${t.category}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${t.type}
                      </span>
                    </td>
                    ${state.role === 'admin' ? `
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-2" data-action="edit" data-id="${t.id}">Edit</button>
                        <button class="text-red-600 hover:text-red-900" data-action="delete" data-id="${t.id}">Delete</button>
                      </td>
                    ` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // Main render
  const render = () => {
    updateFilteredTransactions();
    const summaries = computeSummaries(state.filteredTransactions);
    const trendData = computeTrendData(state.filteredTransactions);
    const pieData = computePieData(state.filteredTransactions);
    const insights = computeInsights(state.filteredTransactions);

    root.innerHTML = `
      ${renderHeader()}
      ${renderSummaryCards(summaries)}
      ${renderCharts()}
      ${renderInsights(insights)}
      ${renderTransactions()}
    `;

    // Re-attach charts
    renderChartsCanvas(trendData, pieData);

    // Re-attach event listeners
    attachEventListeners();
  };

  const renderChartsCanvas = (trendData, pieData) => {
    // Destroy old charts
    if (trendChart) trendChart.destroy();
    if (pieChart) pieChart.destroy();

    // Trend chart
    const trendCtx = document.getElementById('trendChart')?.getContext('2d');
    if (trendCtx) {
      trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: trendData.labels,
          datasets: [{ label: 'Balance', data: trendData.data, borderColor: 'rgb(59, 130, 246)', tension: 0.1 }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: false } } }
      });
    }

    // Pie chart
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    if (pieCtx) {
      pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieData.labels,
          datasets: [{ data: pieData.data, backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'] }]
        },
        options: { responsive: true }
      });
    }
  };

  // Event listeners
  const attachEventListeners = () => {
    // Role switch
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        state.role = e.target.value;
        localStorage.setItem('role', state.role);
        render();
      });
    }

    // Filters
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.filter.search = e.target.value;
        render();
      });
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        state.filter.category = e.target.value;
        render();
      });
    }

    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        state.filter.type = e.target.value;
        render();
      });
    }

    // Sort
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (state.sort.field === field) {
          state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          state.sort.field = field;
          state.sort.direction = 'asc';
        }
        render();
      });
    });

    // Admin actions (basic - alert for demo)
    const addBtn = document.getElementById('addTransaction');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        // Mock add
        const newTrans = {
          id: Date.now(),
          date: new Date().toISOString().slice(0,10),
          amount: 100,
          category: 'New',
          type: 'income'
        };
        state.transactions.unshift(newTrans);
        render();
      });
    }

    // Edit/Delete (mock)
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        if (action === 'delete') {
          state.transactions = state.transactions.filter(t => t.id !== id);
        } // edit mock: alert
        render();
      });
    });
  };

  // Init
  const savedRole = localStorage.getItem('role') || 'viewer';
  state.role = savedRole;
  render();
});
