import React from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { CryptoData } from '../types/crypto'
import { useTheme } from '../contexts/ThemeContext'

interface ChartPopupProps {
  crypto: CryptoData | null
  isOpen: boolean
  onClose: () => void
}

const ChartPopup: React.FC<ChartPopupProps> = ({ crypto, isOpen, onClose }) => {
  const { isDark } = useTheme()

  if (!isOpen || !crypto) {
    return null
  }

  const formatCurrency = (value: number) => {
    if (value >= 100) return `$${value.toFixed(0)}`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Generate simple chart data
  const generateChartData = () => {
    const currentPrice = crypto.quote.USD.price
    const data = []
    
    // Generate 30 days of data
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      let price = currentPrice
      if (i > 0) {
        const dailyChange = crypto.quote.USD.percent_change_24h / 100
        const weeklyChange = crypto.quote.USD.percent_change_7d / 100
        
        if (i <= 1) {
          price = currentPrice / (1 + dailyChange * i)
        } else if (i <= 7) {
          price = currentPrice / (1 + weeklyChange * (i / 7))
        } else {
          price = currentPrice / (1 + weeklyChange * 0.5)
        }
        
        // Add some randomness
        const randomFactor = 0.95 + Math.random() * 0.1
        price = price * randomFactor
      }
      
      data.push({
        day: i,
        price: Math.max(0.01, parseFloat(price.toFixed(4))),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }
    
    return data.reverse()
  }

  const chartData = generateChartData()
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const minPrice = Math.min(...chartData.map(d => d.price))
  const priceRange = maxPrice - minPrice

  const getPriceChangeColor = () => {
    return crypto.quote.USD.percent_change_24h >= 0 ? '#10B981' : '#EF4444'
  }

  const getPriceChangeIcon = () => {
    return crypto.quote.USD.percent_change_24h >= 0 ? '↗' : '↘'
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${
        isDark ? 'bg-crypto-dark' : 'bg-crypto-light-surface'
      } border ${isDark ? 'border-crypto-accent/30' : 'border-crypto-light-border'}`}>
        
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-crypto-dark/95' : 'bg-crypto-light-surface/95'} backdrop-blur-sm border-b ${isDark ? 'border-crypto-accent/30' : 'border-crypto-light-border'} p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {crypto.symbol.charAt(0)}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                  {crypto.name} ({crypto.symbol})
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                  Rank #{crypto.cmc_rank} • Current Price: {formatCurrency(crypto.quote.USD.price)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 ${isDark ? 'bg-crypto-accent/20 hover:bg-crypto-accent/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg flex items-center justify-center transition-colors`}
            >
              <X className={`w-5 h-5 ${isDark ? 'text-crypto-accent' : 'text-crypto-light-text'}`} />
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {/* Price Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>Current Price</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                {formatCurrency(crypto.quote.USD.price)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>24h Change</p>
              <p className={`text-xl font-bold ${getPriceChangeColor()}`}>
                {getPriceChangeIcon()} {formatPercentage(crypto.quote.USD.percent_change_24h)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>7d Change</p>
              <p className={`text-xl font-bold ${
                crypto.quote.USD.percent_change_7d >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.quote.USD.percent_change_7d >= 0 ? '↗' : '↘'} {formatPercentage(crypto.quote.USD.percent_change_7d)}
              </p>
            </div>
          </div>

          {/* SVG Chart */}
          <div className={`w-full h-96 ${isDark ? 'bg-crypto-darker/50' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <svg width="100%" height="100%" viewBox="0 0 800 300" className="overflow-visible">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="60"
                  y1={50 + i * 40}
                  x2="740"
                  y2={50 + i * 40}
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  strokeWidth="1"
                />
              ))}
              
              {/* Price line */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="4"
                points={chartData.map((point, index) => {
                  const x = 60 + (index * 680) / (chartData.length - 1)
                  const y = 250 - ((point.price - minPrice) / priceRange) * 180
                  return `${x},${y}`
                }).join(' ')}
              />
              
              {/* Data points */}
              {chartData.map((point, index) => {
                if (index % 3 === 0) { // Show every 3rd point to avoid clutter
                  const x = 60 + (index * 680) / (chartData.length - 1)
                  const y = 250 - ((point.price - minPrice) / priceRange) * 180
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#3B82F6"
                      className="hover:r-8 transition-all cursor-pointer"
                    />
                  )
                }
                return null
              })}
              
              {/* X-axis labels */}
              {chartData.map((point, index) => {
                if (index % 5 === 0) { // Show every 5th label
                  const x = 60 + (index * 680) / (chartData.length - 1)
                  return (
                    <text
                      key={index}
                      x={x}
                      y="290"
                      textAnchor="middle"
                      className={`text-sm ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
                    >
                      {point.date}
                    </text>
                  )
                }
                return null
              })}
              
              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const price = minPrice + (priceRange * i) / 5
                return (
                  <text
                    key={i}
                    x="50"
                    y={250 - (i * 40) + 4}
                    textAnchor="end"
                    className={`text-sm ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
                  >
                    {formatCurrency(price)}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>Market Cap</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                ${(crypto.quote.USD.market_cap / 1000000000).toFixed(2)}B
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>Volume (24h)</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                ${(crypto.quote.USD.volume_24h / 1000000000).toFixed(2)}B
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>Supply</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                {(crypto.circulating_supply / 1000000).toFixed(0)}M
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'} mb-1`}>Rank</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                #{crypto.cmc_rank}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartPopup
