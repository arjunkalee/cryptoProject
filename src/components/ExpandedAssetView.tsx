import React from 'react'
import { X, TrendingUp, TrendingDown, BarChart3, Coins, Globe, Calendar, Target, Activity, Shield, Info } from 'lucide-react'
import { CryptoData } from '../types/crypto'
import CryptoChart from './CryptoChart'

interface ExpandedAssetViewProps {
  crypto: CryptoData
  onClose: () => void
}

const ExpandedAssetView: React.FC<ExpandedAssetViewProps> = ({ crypto, onClose }) => {
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

  const getMarketCapRank = (marketCap: number) => {
    if (marketCap >= 1e12) return 'Mega Cap'
    if (marketCap >= 1e11) return 'Large Cap'
    if (marketCap >= 1e10) return 'Mid Cap'
    if (marketCap >= 1e9) return 'Small Cap'
    return 'Micro Cap'
  }

  return (
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
                  <span className="text-sm text-crypto-accent">{getMarketCapRank(crypto.quote.USD.market_cap)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-crypto-accent/20 hover:bg-crypto-accent/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-crypto-accent" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Price and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-crypto-primary" />
                  Current Price & Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {formatPrice(crypto.quote.USD.price)}
                    </div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-2">
                      {formatPercentage(crypto.quote.USD.percent_change_24h)}
                    </div>
                    <div className="text-sm text-gray-400">24h Change</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-crypto-accent/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {formatPercentage(crypto.quote.USD.percent_change_1h)}
                      </div>
                      <div className="text-xs text-gray-400">1h</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {formatPercentage(crypto.quote.USD.percent_change_7d)}
                      </div>
                      <div className="text-xs text-gray-400">7d</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {formatPercentage(crypto.quote.USD.percent_change_30d)}
                      </div>
                      <div className="text-xs text-gray-400">30d</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-crypto-primary" />
                Market Data
              </h3>
              <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Max Supply</span>
                  <span className="text-white font-semibold">
                    {crypto.max_supply ? formatSupply(crypto.max_supply) : '∞'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-crypto-primary" />
              Price Chart & Forecast
            </h3>
            <CryptoChart crypto={crypto} />
          </div>

          {/* Supply Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-crypto-primary" />
                Supply Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white font-semibold">{formatSupply(crypto.total_supply)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Circulating Supply</span>
                  <span className="text-white font-semibold">{formatSupply(crypto.circulating_supply)}</span>
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

            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-crypto-primary" />
                Market Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Market Cap Rank</span>
                  <span className="text-white font-semibold">#{crypto.cmc_rank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Market Cap Category</span>
                  <span className="text-white font-semibold">{getMarketCapRank(crypto.quote.USD.market_cap)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Volume/Market Cap</span>
                  <span className="text-white font-semibold">
                    {((crypto.quote.USD.volume_24h / crypto.quote.USD.market_cap) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Price Change (24h)</span>
                  <span className="text-white font-semibold">
                    {formatPercentage(crypto.quote.USD.percent_change_24h)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags and Description */}
          {crypto.tags && crypto.tags.length > 0 && (
            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-crypto-primary" />
                Categories & Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {crypto.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-crypto-accent/20 text-crypto-accent rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Analytics */}
          <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-crypto-primary" />
              Advanced Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-primary mb-2">
                  {crypto.quote.USD.volume_24h > crypto.quote.USD.market_cap * 0.1 ? 'High' : 'Normal'}
                </div>
                <div className="text-sm text-gray-400">Trading Activity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-primary mb-2">
                  {Math.abs(crypto.quote.USD.percent_change_24h) > 10 ? 'High' : 'Normal'}
                </div>
                <div className="text-sm text-gray-400">Volatility</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-primary mb-2">
                  {crypto.quote.USD.market_cap > 1e10 ? 'Established' : 'Emerging'}
                </div>
                <div className="text-sm text-gray-400">Market Maturity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandedAssetView
