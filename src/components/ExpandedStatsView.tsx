import React from 'react'
import { X, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Target, Globe, Coins, Info, PieChart, ArrowUpRight } from 'lucide-react'
import { CryptoData } from '../types/crypto'

interface ExpandedStatsViewProps {
  cryptoData: CryptoData[]
  onClose: () => void
}

const ExpandedStatsView: React.FC<ExpandedStatsViewProps> = ({ cryptoData, onClose }) => {
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toFixed(0)
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  // Calculate market statistics
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.market_cap, 0)
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.quote.USD.volume_24h, 0)
  const totalSupply = cryptoData.reduce((sum, crypto) => sum + crypto.circulating_supply, 0)
  
  // Top gainers and losers
  const topGainers = [...cryptoData]
    .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
    .slice(0, 5)
  
  const topLosers = [...cryptoData]
    .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
    .slice(0, 5)

  // Market dominance calculation
  const btcData = cryptoData.find(crypto => crypto.symbol === 'BTC')
  const ethData = cryptoData.find(crypto => crypto.symbol === 'ETH')
  const btcDominance = btcData ? (btcData.quote.USD.market_cap / totalMarketCap) * 100 : 0
  const ethDominance = ethData ? (ethData.quote.USD.market_cap / totalMarketCap) * 100 : 0
  const otherDominance = 100 - btcDominance - ethDominance

  // Market sentiment analysis
  const positiveChanges = cryptoData.filter(crypto => crypto.quote.USD.percent_change_24h > 0).length
  const negativeChanges = cryptoData.filter(crypto => crypto.quote.USD.percent_change_24h < 0).length
  const neutralChanges = cryptoData.filter(crypto => crypto.quote.USD.percent_change_24h === 0).length
  const totalAssets = cryptoData.length

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-crypto-dark border border-crypto-accent/30 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-crypto-dark/95 backdrop-blur-sm border-b border-crypto-accent/30 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-xl flex items-center justify-center text-white">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Market Overview</h1>
                <p className="text-xl text-gray-400">Comprehensive cryptocurrency market analysis</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-400">{cryptoData.length} assets tracked</span>
                  <span className="text-sm text-crypto-accent">Real-time data</span>
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
          {/* Key Market Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-crypto-primary" />
                <h3 className="text-lg font-semibold text-white">Total Market Cap</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(totalMarketCap)}
              </div>
              <div className="text-sm text-gray-400">All tracked cryptocurrencies</div>
            </div>

            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-white">24h Volume</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(totalVolume)}
              </div>
              <div className="text-sm text-gray-400">Total trading volume</div>
            </div>

            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Total Supply</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatNumber(totalSupply)}
              </div>
              <div className="text-sm text-gray-400">Circulating supply</div>
            </div>

            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Active Assets</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {cryptoData.length}
              </div>
              <div className="text-sm text-gray-400">Tracked cryptocurrencies</div>
            </div>
          </div>

          {/* Market Dominance */}
          <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-crypto-primary" />
              Market Dominance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-white font-medium">Bitcoin (BTC)</span>
                    </div>
                    <span className="text-white font-bold">{btcDominance.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-white font-medium">Ethereum (ETH)</span>
                    </div>
                    <span className="text-white font-bold">{ethDominance.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <span className="text-white font-medium">Others</span>
                    </div>
                    <span className="text-white font-bold">{otherDominance.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeDasharray={`${(btcDominance / 100) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(ethDominance / 100) * 251.2} 251.2`}
                      strokeDashoffset={`-${(btcDominance / 100) * 251.2}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="8"
                      strokeDasharray={`${(otherDominance / 100) * 251.2} 251.2`}
                      strokeDashoffset={`-${((btcDominance + ethDominance) / 100) * 251.2}`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Gainers (24h)
              </h3>
              <div className="space-y-3">
                {topGainers.map((crypto, index) => (
                  <div key={crypto.id} className="flex items-center justify-between p-3 bg-crypto-dark/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-gray-400">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">
                        +{crypto.quote.USD.percent_change_24h.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatCurrency(crypto.quote.USD.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Top Losers (24h)
              </h3>
              <div className="space-y-3">
                {topLosers.map((crypto, index) => (
                  <div key={crypto.id} className="flex items-center justify-between p-3 bg-crypto-dark/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-gray-400">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">
                        {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatCurrency(crypto.quote.USD.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-crypto-primary" />
              Market Sentiment Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {positiveChanges}
                </div>
                <div className="text-sm text-gray-400">Positive (24h)</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((positiveChanges / totalAssets) * 100).toFixed(1)}% of market
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-10 h-10 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {negativeChanges}
                </div>
                <div className="text-sm text-gray-400">Negative (24h)</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((negativeChanges / totalAssets) * 100).toFixed(1)}% of market
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-400 mb-2">
                  {neutralChanges}
                </div>
                <div className="text-sm text-gray-400">Neutral (24h)</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((neutralChanges / totalAssets) * 100).toFixed(1)}% of market
                </div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-crypto-darker/50 rounded-xl p-6 border border-crypto-accent/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-crypto-primary" />
              Market Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>Bullish Signals:</strong> {positiveChanges} assets showing positive momentum
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>High Volume:</strong> {formatCurrency(totalVolume)} in 24h trading activity
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>Market Depth:</strong> {cryptoData.length} actively traded assets
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>Volatility:</strong> {Math.abs(topGainers[0]?.quote.USD.percent_change_24h || 0).toFixed(1)}% max gain
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>BTC Dominance:</strong> {btcDominance.toFixed(1)}% of total market cap
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white">
                    <strong>Risk Level:</strong> {negativeChanges > positiveChanges ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandedStatsView
