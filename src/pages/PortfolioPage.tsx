import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, History } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Portfolio, PortfolioAsset, PortfolioTransaction, PortfolioSummary, CryptoData } from '../types/crypto'
import { User } from '../types/auth'
import AddAssetModal from '../components/AddAssetModal'
import { fetchCryptoData } from '../services/cryptoApi'
import { portfolioService } from '../services/portfolioService'

interface PortfolioPageProps {
  user: User
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ user }) => {
  const { isDark } = useTheme()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'transactions'>('overview')
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [availableCryptos, setAvailableCryptos] = useState<CryptoData[]>([])
  const [cryptoLoading, setCryptoLoading] = useState(false)

  // Load available cryptocurrencies for the add asset modal
  const loadCryptoData = async () => {
    try {
      setCryptoLoading(true)
      const data = await fetchCryptoData()
      setAvailableCryptos(data)
    } catch (error) {
      console.error('Failed to load crypto data:', error)
    } finally {
      setCryptoLoading(false)
    }
  }

  // Load portfolio data
  const loadPortfolio = () => {
    let userPortfolio = portfolioService.getPortfolio(user.id)
    
    if (!userPortfolio) {
      // Create new portfolio if none exists
      userPortfolio = portfolioService.createPortfolio(user.id)
    }
    
    setPortfolio(userPortfolio)
    setLoading(false)
  }

  // Handle adding a new asset to the portfolio
  const handleAddAsset = (cryptoId: number, amount: number, price: number, notes?: string) => {
    const crypto = availableCryptos.find(c => c.id === cryptoId)
    if (!crypto) return

    const asset = portfolioService.addAsset(
      user.id,
      cryptoId,
      crypto.symbol,
      crypto.name,
      amount,
      price,
      crypto.quote.USD.price,
      notes
    )

    if (asset) {
      // Reload portfolio to get updated data
      loadPortfolio()
    }
  }

  // Load crypto data and portfolio when component mounts
  useEffect(() => {
    loadCryptoData()
    loadPortfolio()
  }, [user.id])

  // Update portfolio prices when crypto data changes
  useEffect(() => {
    if (availableCryptos.length > 0 && portfolio) {
      const priceUpdates: { [cryptoId: number]: number } = {}
      availableCryptos.forEach(crypto => {
        priceUpdates[crypto.id] = crypto.quote.USD.price
      })
      
      portfolioService.updateAssetPrices(user.id, priceUpdates)
      loadPortfolio() // Reload to get updated prices
    }
  }, [availableCryptos, user.id])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary"></div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Portfolio Found</h3>
        <p className="text-gray-500">Create your first portfolio to get started.</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Portfolio</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
              Track your cryptocurrency investments
            </p>
          </div>
          <button
            onClick={() => setShowAddAsset(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-crypto-primary/20' : 'bg-crypto-primary/10'}`}>
                <DollarSign className="w-6 h-6 text-crypto-primary" />
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Total Value
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(portfolio.summary.totalValue)}</div>
            <div className={`text-sm flex items-center gap-1 ${
              portfolio.summary.dayChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {portfolio.summary.dayChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatCurrency(portfolio.summary.dayChange)} ({formatPercentage(portfolio.summary.dayChangePercentage)})
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-crypto-accent/20' : 'bg-crypto-accent/10'}`}>
                <BarChart3 className="w-6 h-6 text-crypto-accent" />
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Total P&L
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(portfolio.summary.totalProfitLoss)}</div>
            <div className={`text-sm flex items-center gap-1 ${
              portfolio.summary.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {portfolio.summary.totalProfitLoss >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatPercentage(portfolio.summary.totalProfitLossPercentage)}
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-crypto-secondary/20' : 'bg-crypto-secondary/10'}`}>
                <Wallet className="w-6 h-6 text-crypto-secondary" />
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Total Cost
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(portfolio.summary.totalCost)}</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
              Invested amount
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-crypto-primary/20' : 'bg-crypto-primary/10'}`}>
                <BarChart3 className="w-6 h-6 text-crypto-primary" />
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Assets
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{portfolio.summary.assetCount}</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
              Holdings
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'assets', label: 'Assets', icon: Wallet },
            { id: 'transactions', label: 'Transactions', icon: History }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-crypto-primary text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-crypto-light-text-secondary hover:text-crypto-light-text hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Performers
              </h3>
              <div className="space-y-4">
                {portfolio.summary.topPerformers.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(asset.totalValue)}</div>
                      <div className={`text-sm ${asset.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(asset.profitLossPercentage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-crypto-primary" />
                Recent Transactions
              </h3>
              <div className="space-y-4">
                {portfolio.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.amount} {transaction.assetId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(transaction.totalValue)}</div>
                      <div className={`text-sm ${transaction.type === 'buy' ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.totalValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <h3 className="text-xl font-semibold mb-6">Your Assets</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">Asset</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Avg Price</th>
                    <th className="text-right py-3 px-4">Current Price</th>
                    <th className="text-right py-3 px-4">Total Value</th>
                    <th className="text-right py-3 px-4">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.assets.map((asset) => (
                    <tr key={asset.id} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.symbol}</div>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">{asset.amount}</td>
                      <td className="text-right py-4 px-4">{formatCurrency(asset.averagePrice)}</td>
                      <td className="text-right py-4 px-4">{formatCurrency(asset.currentPrice)}</td>
                      <td className="text-right py-4 px-4 font-medium">{formatCurrency(asset.totalValue)}</td>
                      <td className="text-right py-4 px-4">
                        <div className={`${asset.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(asset.profitLoss)}
                        </div>
                        <div className={`text-sm ${asset.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(asset.profitLossPercentage)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <h3 className="text-xl font-semibold mb-6">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Asset</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Total</th>
                    <th className="text-right py-3 px-4">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.transactions.map((transaction) => (
                    <tr key={transaction.id} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      <td className="py-4 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">{transaction.assetId}</td>
                      <td className="text-right py-4 px-4">{transaction.amount}</td>
                      <td className="text-right py-4 px-4">{formatCurrency(transaction.price)}</td>
                      <td className="text-right py-4 px-4 font-medium">{formatCurrency(transaction.totalValue)}</td>
                      <td className="text-right py-4 px-4">{formatCurrency(transaction.fees || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={showAddAsset}
        onClose={() => setShowAddAsset(false)}
        onAddAsset={handleAddAsset}
        availableCryptos={availableCryptos}
        loading={cryptoLoading}
      />
    </div>
  )
}

export default PortfolioPage
