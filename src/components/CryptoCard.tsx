import React, { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Coins, Globe } from 'lucide-react'
import { CryptoData } from '../types/crypto'
import ExpandedAssetView from './ExpandedAssetView'
import ChartPopup from './ChartPopup'
import { useTheme } from '../contexts/ThemeContext'

interface CryptoCardProps {
  crypto: CryptoData
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const { isDark } = useTheme()
  const [showExpanded, setShowExpanded] = useState(false)
  const [showChartPopup, setShowChartPopup] = useState(false)
  
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(8)}`
  }

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {Math.abs(value).toFixed(2)}%
      </span>
    )
  }

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K`
    return supply.toLocaleString()
  }

  return (
    <>
      <div 
        className={`p-6 hover-lift group cursor-pointer transition-all duration-300 ${
          isDark 
            ? 'glass-card' 
            : 'bg-white/80 backdrop-blur-lg border border-crypto-light-border rounded-xl shadow-xl'
        }`}
        onClick={() => setShowExpanded(true)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {crypto.symbol.charAt(0)}
          </div>
          <div>
            <h3 className={`font-bold group-hover:text-crypto-primary transition-colors ${
              isDark ? 'text-white' : 'text-crypto-light-text'
            }`}>
              {crypto.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
              {crypto.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Rank #{crypto.cmc_rank}</div>
          <div className="w-6 h-6 bg-crypto-accent/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-crypto-accent" />
          </div>
        </div>
        </div>

        {/* Price and Change */}
        <div className="mb-4">
        <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
          {formatPrice(crypto.quote.USD.price)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">24h Change</span>
          {formatPercentage(crypto.quote.USD.percent_change_24h)}
        </div>
        </div>

        {/* Market Stats */}
        <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Market Cap
          </span>
          <span className="text-white font-medium">
            {formatCurrency(crypto.quote.USD.market_cap)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Volume (24h)
          </span>
          <span className="text-white font-medium">
            {formatCurrency(crypto.quote.USD.volume_24h)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Supply
          </span>
          <span className="text-white font-medium">
            {formatSupply(crypto.circulating_supply)}
          </span>
        </div>
        </div>

        {/* Additional Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-crypto-darker/30 rounded-lg">
            <div className="text-gray-400 mb-1">1h</div>
            <div className={`font-medium ${crypto.quote.USD.percent_change_1h >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {crypto.quote.USD.percent_change_1h >= 0 ? '+' : ''}{crypto.quote.USD.percent_change_1h.toFixed(2)}%
            </div>
          </div>
          <div className="text-center p-2 bg-crypto-darker/30 rounded-lg">
            <div className="text-gray-400 mb-1">7d</div>
            <div className={`font-medium ${crypto.quote.USD.percent_change_7d >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {crypto.quote.USD.percent_change_7d >= 0 ? '+' : ''}{crypto.quote.USD.percent_change_7d.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-crypto-accent/20 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowChartPopup(true)
            }}
            className="flex-1 px-3 py-2 bg-crypto-primary/20 hover:bg-crypto-primary/30 text-crypto-primary rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <BarChart3 className="w-4 h-4" />
            Chart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowExpanded(true)
            }}
            className="flex-1 px-3 py-2 bg-crypto-accent/20 hover:bg-crypto-accent/30 text-crypto-accent rounded-lg transition-colors text-sm font-medium"
          >
            Details
          </button>
        </div>
      </div>

      {showExpanded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-crypto-dark border border-crypto-accent/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-crypto-dark/95 backdrop-blur-sm border-b border-crypto-accent/30 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{crypto.name}</h1>
                    <p className="text-xl text-gray-400">{crypto.symbol}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-400">Rank #{crypto.cmc_rank}</span>
                      <span className="text-sm text-crypto-accent">Current Price: {formatPrice(crypto.quote.USD.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowChartPopup(true)
                    }}
                    className="px-4 py-2 bg-crypto-accent/20 hover:bg-crypto-accent/30 text-crypto-accent rounded-lg transition-colors text-sm font-medium"
                  >
                    View Chart
                  </button>
                  <button
                    onClick={() => setShowExpanded(false)}
                    className="w-10 h-10 bg-crypto-accent/20 hover:bg-crypto-accent/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <span className="text-crypto-accent text-xl">×</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">


              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-crypto-primary" />
                    Market Data
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Market Cap</span>
                      <span className="text-white font-semibold">{formatCurrency(crypto.quote.USD.market_cap)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Volume (24h)</span>
                      <span className="text-white font-semibold">{formatCurrency(crypto.quote.USD.volume_24h)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Circulating Supply</span>
                      <span className="text-white font-semibold">{formatSupply(crypto.circulating_supply)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-crypto-primary" />
                    Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">1h Change</span>
                      <span className={`font-semibold ${crypto.quote.USD.percent_change_1h >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                        {crypto.quote.USD.percent_change_1h >= 0 ? '+' : ''}{crypto.quote.USD.percent_change_1h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">24h Change</span>
                      <span className={`font-semibold ${crypto.quote.USD.percent_change_24h >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                        {crypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}{crypto.quote.USD.percent_change_24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">7d Change</span>
                      <span className={`font-semibold ${crypto.quote.USD.percent_change_7d >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                        {crypto.quote.USD.percent_change_7d >= 0 ? '+' : ''}{crypto.quote.USD.percent_change_7d.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-crypto-primary" />
                    Supply Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Supply</span>
                      <span className="text-white font-semibold">{formatSupply(crypto.total_supply)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Max Supply</span>
                      <span className="text-white font-semibold">
                        {crypto.max_supply ? formatSupply(crypto.max_supply) : '∞'}
                      </span>
                    </div>
                    {crypto.max_supply && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Circulation %</span>
                        <span className="text-white font-semibold">
                          {((crypto.circulating_supply / crypto.max_supply) * 100).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Full Details Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowExpanded(false)
                    // You can add navigation to full details page here if needed
                  }}
                  className="px-6 py-3 bg-crypto-primary hover:bg-crypto-secondary text-white rounded-lg transition-colors font-medium"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Popup */}
      <ChartPopup 
        crypto={crypto} 
        isOpen={showChartPopup} 
        onClose={() => setShowChartPopup(false)} 
      />
    </>
  )
}

export default CryptoCard
