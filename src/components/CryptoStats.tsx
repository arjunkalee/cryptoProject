import React, { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Coins, Globe, ArrowUpRight } from 'lucide-react'
import { CryptoData } from '../types/crypto'
import ExpandedStatsView from './ExpandedStatsView'
import { useTheme } from '../contexts/ThemeContext'

interface CryptoStatsProps {
  cryptoData: CryptoData[]
}

const CryptoStats: React.FC<CryptoStatsProps> = ({ cryptoData }) => {
  const { isDark } = useTheme()
  const [showExpanded, setShowExpanded] = useState(false)

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toFixed(0)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Calculate market statistics
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.market_cap, 0)
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.volume_24h, 0)
  const totalSupply = cryptoData.reduce((sum, crypto) => sum + crypto.circulating_supply, 0)
  
  // Top gainers and losers
  const topGainers = [...cryptoData]
    .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
    .slice(0, 3)
  
  const topLosers = [...cryptoData]
    .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
    .slice(0, 3)

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Market Overview
          </h2>
          <div className="w-8 h-8 bg-crypto-accent/20 rounded-full flex items-center justify-center group-hover:bg-crypto-accent/30 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-crypto-accent" />
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
              {formatCurrency(totalMarketCap)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Total Market Cap</div>
          </div>

          <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
              {formatCurrency(totalVolume)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>24h Volume</div>
          </div>

          <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-crypto-darker/30' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
              {formatNumber(totalSupply)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Total Supply</div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Gainers (24h)
            </h3>
            <div className="space-y-2">
              {topGainers.map((crypto, index) => (
                <div key={crypto.id} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-crypto-dark/30' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {crypto.symbol.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-green' : 'text-crypto-light-text'}`}>{crypto.symbol}</span>
                  </div>
                  <div className="text-green-400 font-semibold text-sm">
                    +{crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
              <TrendingDown className="w-5 h-5 text-red-500" />
              Top Losers (24h)
            </h3>
            <div className="space-y-2">
              {topLosers.map((crypto, index) => (
                <div key={crypto.id} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-crypto-dark/30' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {crypto.symbol.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>{crypto.symbol}</span>
                  </div>
                  <div className="text-red-400 font-semibold text-sm">
                    {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Click Indicator */}
        <div className="mt-6 pt-4 border-t border-crypto-accent/20 text-center">
          <span className="text-sm text-crypto-accent group-hover:text-crypto-primary transition-colors">
            Click to view detailed market analysis
          </span>
        </div>
      </div>

      {showExpanded && (
        <ExpandedStatsView 
          cryptoData={cryptoData} 
          onClose={() => setShowExpanded(false)} 
        />
      )}
    </>
  )
}

export default CryptoStats
