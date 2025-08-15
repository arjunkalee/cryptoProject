import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react'
import { CryptoData } from '../types/crypto'

interface CryptoStatsProps {
  cryptoData: CryptoData[]
}

const CryptoStats: React.FC<CryptoStatsProps> = ({ cryptoData }) => {
  if (cryptoData.length === 0) return null

  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.market_cap, 0)
  const totalVolume24h = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.volume_24h, 0)
  
  const topGainers = [...cryptoData]
    .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
    .slice(0, 3)
  
  const topLosers = [...cryptoData]
    .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
    .slice(0, 3)

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {Math.abs(value).toFixed(2)}%
      </span>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Market Cap */}
      <div className="glass-card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Total Market Cap</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalMarketCap)}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* 24h Volume */}
      <div className="glass-card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">24h Volume</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalVolume24h)}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-crypto-accent to-crypto-primary rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Top Gainers */}
      <div className="glass-card p-6 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-300 text-sm">Top Gainers (24h)</p>
          <div className="w-10 h-10 bg-gradient-to-br from-crypto-success to-green-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          {topGainers.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between text-sm">
              <span className="text-white font-medium">{crypto.symbol}</span>
              {formatPercentage(crypto.quote.USD.percent_change_24h)}
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="glass-card p-6 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-300 text-sm">Top Losers (24h)</p>
          <div className="w-10 h-10 bg-gradient-to-br from-crypto-danger to-red-400 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          {topLosers.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between text-sm">
              <span className="text-white font-medium">{crypto.symbol}</span>
              {formatPercentage(crypto.quote.USD.percent_change_24h)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CryptoStats
