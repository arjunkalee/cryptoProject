import React from 'react'
import { CryptoData } from '../types/crypto'
import { useTheme } from '../contexts/ThemeContext'

interface SimpleChartProps {
  crypto: CryptoData
  className?: string
}

const SimpleChart: React.FC<SimpleChartProps> = ({ crypto, className = '' }) => {
  const { isDark } = useTheme()
  
  const formatCurrency = (value: number) => {
    if (value >= 100) return `$${value.toFixed(0)}`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Generate simple data points for a basic chart
  const generateDataPoints = () => {
    const currentPrice = crypto.quote.USD.price
    const points = []
    
    // Create 10 data points representing the last 10 days
    for (let i = 9; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      let price = currentPrice
      if (i > 0) {
        // Simple price calculation
        const dailyChange = crypto.quote.USD.percent_change_24h / 100
        const weeklyChange = crypto.quote.USD.percent_change_7d / 100
        
        if (i <= 1) {
          price = currentPrice / (1 + dailyChange * i)
        } else {
          price = currentPrice / (1 + weeklyChange * (i / 7))
        }
        
        // Add some variation
        const variation = 0.95 + Math.random() * 0.1
        price = price * variation
      }
      
      points.push({
        day: i,
        price: Math.max(0.01, price),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }
    
    return points.reverse()
  }

  const dataPoints = generateDataPoints()
  const maxPrice = Math.max(...dataPoints.map(p => p.price))
  const minPrice = Math.min(...dataPoints.map(p => p.price))
  const priceRange = maxPrice - minPrice

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
        <div className="text-sm text-gray-500">Simple Chart View</div>
      </div>
      
      {/* Simple SVG Chart */}
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={40 + i * 30}
              x2="400"
              y2={40 + i * 30}
              stroke={isDark ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          ))}
          
          {/* Price line */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            points={dataPoints.map((point, index) => {
              const x = 20 + (index * 360) / (dataPoints.length - 1)
              const y = 160 - ((point.price - minPrice) / priceRange) * 120
              return `${x},${y}`
            }).join(' ')}
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => {
            const x = 20 + (index * 360) / (dataPoints.length - 1)
            const y = 160 - ((point.price - minPrice) / priceRange) * 120
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all"
              />
            )
          })}
          
          {/* X-axis labels */}
          {dataPoints.map((point, index) => {
            if (index % 2 === 0) { // Show every other label
              const x = 20 + (index * 360) / (dataPoints.length - 1)
              return (
                <text
                  key={index}
                  x={x}
                  y="190"
                  textAnchor="middle"
                  className={`text-xs ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
                >
                  {point.date}
                </text>
              )
            }
            return null
          })}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const price = minPrice + (priceRange * i) / 4
            return (
              <text
                key={i}
                x="10"
                y={160 - (i * 30) + 4}
                textAnchor="end"
                className={`text-xs ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
              >
                {formatCurrency(price)}
              </text>
            )
          })}
        </svg>
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

export default SimpleChart
