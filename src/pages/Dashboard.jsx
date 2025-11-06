import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  DollarSign,
  PieChart as PieChartIcon,
  Building2,
  Target
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  calculateTotalPaymentsIn,
  calculateTotalPaymentsOut,
  calculateBalance,
  needsPaymentReminder,
  getExpensesByDepartment,
  formatCurrency,
  getProjectSummary
} from '../utils/dataManager';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Dashboard = () => {
  const { currentProject } = useData();

  const metrics = useMemo(() => {
    if (!currentProject) {
      return {
        totalIn: 0,
        totalOut: 0,
        balance: 0,
        needsReminder: false,
        expensesByDept: [],
        projectSummary: null
      };
    }

    const totalIn = calculateTotalPaymentsIn(currentProject.paymentsIn);
    const totalOut = calculateTotalPaymentsOut(currentProject.paymentsOut);
    const balance = calculateBalance(currentProject.paymentsIn, currentProject.paymentsOut);
    const needsReminder = needsPaymentReminder(currentProject.paymentsIn, currentProject.paymentsOut);
    const expensesByDept = getExpensesByDepartment(currentProject.paymentsOut, currentProject.departments);
    const projectSummary = getProjectSummary(currentProject);

    return {
      totalIn,
      totalOut,
      balance,
      needsReminder,
      expensesByDept,
      projectSummary
    };
  }, [currentProject]);

  const chartData = useMemo(() => {
    return metrics.expensesByDept
      .filter(dept => dept.total > 0)
      .map(dept => ({
        name: dept.name,
        value: dept.total,
        count: dept.count
      }));
  }, [metrics.expensesByDept]);

  const barChartData = useMemo(() => {
    return metrics.expensesByDept
      .filter(dept => dept.total > 0)
      .map(dept => ({
        name: dept.name.length > 10 ? dept.name.substring(0, 10) + '...' : dept.name,
        amount: dept.total
      }));
  }, [metrics.expensesByDept]);

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Building2 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
          <p className="text-gray-600 mb-6">Please create or select a construction project to view the dashboard</p>
          <a href="#" onClick={() => window.location.reload()} className="btn btn-primary">
            Go to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Project Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
          </div>
          <p className="text-gray-600">Financial overview and analytics</p>
        </div>
      </div>

      {/* Payment Progress Card */}
      {metrics.projectSummary && (
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Contract Payment Progress</p>
              <h2 className="text-4xl font-bold">{metrics.projectSummary.percentageReceived.toFixed(1)}%</h2>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Target className="w-10 h-10" />
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-white h-3 rounded-full transition-all shadow-lg"
              style={{ width: `${Math.min(metrics.projectSummary.percentageReceived, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-primary-100 text-xs mb-1">Total Contract</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.projectSummary.totalCommitted)}</p>
            </div>
            <div>
              <p className="text-primary-100 text-xs mb-1">Received</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.projectSummary.totalReceived)}</p>
            </div>
            <div>
              <p className="text-primary-100 text-xs mb-1">Remaining</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.projectSummary.remainingBalance)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert for Payment Reminder */}
      {metrics.needsReminder && (
        <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-lg animate-slide-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning-900">Payment Reminder</h3>
              <p className="text-warning-700 mt-1">
                Total expenses ({formatCurrency(metrics.totalOut)}) exceed payments received ({formatCurrency(metrics.totalIn)}).
                Consider requesting payment from the client.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Payments In */}
        <div className="metric-card from-success-500 to-success-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Total Payments In</p>
              <h3 className="text-3xl font-bold mt-2">{formatCurrency(metrics.totalIn)}</h3>
              <p className="text-success-100 text-sm mt-2">{currentProject.paymentsIn.length} transactions</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Payments Out */}
        <div className="metric-card from-danger-500 to-danger-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-danger-100 text-sm font-medium">Total Payments Out</p>
              <h3 className="text-3xl font-bold mt-2">{formatCurrency(metrics.totalOut)}</h3>
              <p className="text-danger-100 text-sm mt-2">{currentProject.paymentsOut.length} transactions</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className={`metric-card ${metrics.balance >= 0 ? 'from-primary-500 to-primary-700' : 'from-warning-500 to-warning-700'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/90 text-sm font-medium">Net Balance</p>
              <h3 className="text-3xl font-bold mt-2">{formatCurrency(metrics.balance)}</h3>
              <p className="text-white/90 text-sm mt-2">
                {metrics.balance >= 0 ? 'Positive' : 'Negative'} balance
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Departments */}
        <div className="metric-card from-purple-500 to-purple-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Departments</p>
              <h3 className="text-3xl font-bold mt-2">{chartData.length}</h3>
              <p className="text-purple-100 text-sm mt-2">of {currentProject.departments.length} total</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <PieChartIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Expenses by Department */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Department</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart - Expenses by Department */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Spending</h3>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#0ea5e9" name="Amount Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Department Summary Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Transactions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {metrics.expensesByDept.map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{dept.count}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {formatCurrency(dept.total)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {metrics.totalOut > 0 ? ((dept.total / metrics.totalOut) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              {metrics.expensesByDept.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    No expenses recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

