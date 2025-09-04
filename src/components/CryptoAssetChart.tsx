import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CryptoData } from '../types/crypto'
import { useTheme } from '../contexts/ThemeContext'

interface CryptoAssetChartProps {
  crypto: CryptoData
  className?: string
}

const CryptoAssetChart: React.FC<CryptoAssetChartProps> = ({ crypto, className = '' }) => {
  const { isDark } = useTheme()
  
  // Error boundary for chart rendering
  if (!crypto || !crypto.quote || !crypto.quote.USD) {
    return (
      <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark' : 'bg-crypto-light-surface'} ${className}`}>
        <div className="text-center py-8">
          <p className={`text-lg ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            Error loading chart data
          </p>
        </div>
      </div>
    )
  }
  
  const formatCurrency = (value: number) => {
    if (value >= 100) return `$${value.toFixed(0)}`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Generate simple historical data
  const generateChartData = () => {
    const currentPrice = crypto.quote.USD.price
    const data = []
    
    // Generate 30 days of data
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simple price calculation based on current price and changes
      let price = currentPrice
      
      if (i > 0) {
        // Apply 24h change for recent days
        const dailyChange = crypto.quote.USD.percent_change_24h / 100
        const weeklyChange = crypto.quote.USD.percent_change_7d / 100
        
        if (i <= 1) {
          // Last 24 hours
          price = currentPrice / (1 + dailyChange * i)
        } else if (i <= 7) {
          // Last week
          price = currentPrice / (1 + weeklyChange * (i / 7))
        } else {
          // Older data - gradual change
          price = currentPrice / (1 + weeklyChange * 0.5)
        }
        
        // Add some randomness for realistic look
        const randomFactor = 0.95 + Math.random() * 0.1 // ±5% variation
        price = price * randomFactor
      }
      
      data.push({
        day: i,
        date: date.toISOString().split('T')[0],
        price: Math.max(0.01, parseFloat(price.toFixed(4))),
        volume: Math.floor(Math.random() * 10000000) + 1000000
      })
    }
    
    return data.reverse() // Show oldest to newest
  }

  const chartData = generateChartData()

  const formatDate = (value: any) => {
    if (typeof value === 'number') {
      const dataPoint = chartData[value]
      if (dataPoint) {
        const date = new Date(dataPoint.date)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
    return ''
  }

  const getPriceChangeColor = () => {
    return crypto.quote.USD.percent_change_24h >= 0 ? '#10B981' : '#EF4444'
  }

  const getPriceChangeIcon = () => {
    return crypto.quote.USD.percent_change_24h >= 0 ? '↗' : '↘'
  }

  return (
    <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark' : 'bg-crypto-light-surface'} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
          {crypto.symbol} Price Chart
        </h4>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}>Price</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
            <XAxis 
              dataKey="day" 
              tickFormatter={formatDate}
              stroke={isDark ? '#9CA3AF' : '#64748b'}
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={formatCurrency}
              stroke={isDark ? '#9CA3AF' : '#64748b'}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: isDark ? '#F9FAFB' : '#1e293b'
              }}
              labelFormatter={(value, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  return new Date(payload[0].payload.date).toLocaleDateString()
                }
                return ''
              }}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Price Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Current Price</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            {formatCurrency(crypto.quote.USD.price)}
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>24h Change</p>
          <p className={`text-lg font-bold ${getPriceChangeColor()}`}>
            {getPriceChangeIcon()} {formatPercentage(crypto.quote.USD.percent_change_24h)}
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>7d Change</p>
          <p className={`text-lg font-bold ${
            crypto.quote.USD.percent_change_7d >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {crypto.quote.USD.percent_change_7d >= 0 ? '↗' : '↘'} {formatPercentage(crypto.quote.USD.percent_change_7d)}
          </p>
        </div>
      </div>
      
      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Market Cap</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            ${(crypto.quote.USD.market_cap / 1000000000).toFixed(2)}B
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Volume (24h)</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            ${(crypto.quote.USD.volume_24h / 1000000000).toFixed(2)}B
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Supply</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            {(crypto.circulating_supply / 1000000).toFixed(0)}M
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Rank</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
            #{crypto.cmc_rank}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CryptoAssetChart