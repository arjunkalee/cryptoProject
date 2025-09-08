import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useTheme } from '../contexts/ThemeContext'

interface PerformanceChartProps {
  data: Array<{
    date: string
    value: number
    cost: number
    profitLoss: number
  }>
  height?: number
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, height = 300 }) => {
  const { isDark } = useTheme()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-crypto-dark border-white/20' 
            : 'bg-white border-crypto-light-border'
        }`}>
          <p className="text-sm text-gray-500 mb-2">{formatDate(label)}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-crypto-primary"></div>
              <span className="text-sm font-medium">Portfolio Value: {formatCurrency(data.value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-crypto-accent"></div>
              <span className="text-sm font-medium">Total Cost: {formatCurrency(data.cost)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${data.profitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${data.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                P&L: {formatCurrency(data.profitLoss)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Generate mock data if no data provided
  const chartData = data.length > 0 ? data : [
    { date: '2024-01-01', value: 10000, cost: 9500, profitLoss: 500 },
    { date: '2024-01-02', value: 10200, cost: 9500, profitLoss: 700 },
    { date: '2024-01-03', value: 9800, cost: 9500, profitLoss: 300 },
    { date: '2024-01-04', value: 10500, cost: 9500, profitLoss: 1000 },
    { date: '2024-01-05', value: 10800, cost: 9500, profitLoss: 1300 },
    { date: '2024-01-06', value: 11200, cost: 9500, profitLoss: 1700 },
    { date: '2024-01-07', value: 11000, cost: 9500, profitLoss: 1500 },
  ]

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Portfolio Performance</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
          Track your portfolio value over time
        </p>
      </div>
      
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cost"
              stackId="1"
              stroke="#8b5cf6"
              fill="url(#costGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="value"
              stackId="2"
              stroke="#3b82f6"
              fill="url(#valueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-crypto-primary"></div>
          <span className="text-sm text-gray-500">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-crypto-accent"></div>
          <span className="text-sm text-gray-500">Total Cost</span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart
