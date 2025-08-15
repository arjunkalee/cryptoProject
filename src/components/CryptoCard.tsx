import React from 'react'
import { TrendingUp, TrendingDown, BarChart3, Coins, Globe } from 'lucide-react'
import { CryptoData } from '../types/crypto'

interface CryptoCardProps {
  crypto: CryptoData
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
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
    <div className="glass-card p-6 hover-lift group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {crypto.symbol.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-crypto-primary transition-colors">
              {crypto.name}
            </h3>
            <p className="text-gray-400 text-sm">{crypto.symbol}</p>
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
        <div className="text-2xl font-bold text-white mb-2">
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
      </div>

      {/* Supply Info */}
      <div className="pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-400 mb-1">Circulating</p>
            <p className="text-white font-medium">
              {formatSupply(crypto.circulating_supply)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Total Supply</p>
            <p className="text-white font-medium">
              {crypto.total_supply ? formatSupply(crypto.total_supply) : '∞'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-400 mb-1">1h Change</p>
            <div className="text-xs">
              {formatPercentage(crypto.quote.USD.percent_change_1h)}
            </div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">7d Change</p>
            <div className="text-xs">
              {formatPercentage(crypto.quote.USD.percent_change_7d)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoCard
