import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTheme } from '../contexts/ThemeContext'
import { PortfolioAsset } from '../types/crypto'

interface AssetAllocationChartProps {
  assets: PortfolioAsset[]
  height?: number
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ assets, height = 300 }) => {
  const { isDark } = useTheme()

  // Generate colors for the pie chart
  const colors = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#84cc16', '#f97316', '#6366f1', '#ec4899'
  ]

  // Prepare data for the pie chart
  const chartData = assets.map((asset, index) => ({
    name: asset.symbol,
    value: asset.totalValue,
    color: colors[index % colors.length],
    percentage: 0 // Will be calculated
  }))

  // Calculate percentages
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)
  chartData.forEach(item => {
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-crypto-dark border-white/20' 
            : 'bg-white border-crypto-light-border'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="text-sm text-gray-500">
            Value: {formatCurrency(data.value)}
          </div>
          <div className="text-sm text-gray-500">
            Allocation: {data.percentage.toFixed(1)}%
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={isDark ? 'text-gray-300' : 'text-crypto-light-text'}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No Assets to Display</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
            Add some assets to your portfolio to see the allocation chart
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Asset Allocation</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
          Distribution of your portfolio by asset
        </p>
      </div>
      
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
              <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssetAllocationChart
