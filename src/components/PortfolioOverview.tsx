import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, History, Star, Clock, Award } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Portfolio } from '../types/crypto'
import { sortPortfolioAssets, PRESET_SORTS } from '../utils/portfolioSorting'

interface PortfolioOverviewProps {
  portfolio: Portfolio
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  const { isDark } = useTheme()

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

  // Get sorted assets for different perspectives
  const highestValueAssets = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.HIGHEST_VALUE.field, PRESET_SORTS.HIGHEST_VALUE.direction).slice(0, 5)
  const bestPerformers = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.BEST_PERFORMANCE.field, PRESET_SORTS.BEST_PERFORMANCE.direction).slice(0, 5)
  const worstPerformers = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.WORST_PERFORMANCE.field, PRESET_SORTS.WORST_PERFORMANCE.direction).slice(0, 5)
  const mostRecent = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.MOST_RECENT.field, PRESET_SORTS.MOST_RECENT.direction).slice(0, 5)

  const overviewSections = [
    {
      title: 'Top Performers',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      data: bestPerformers,
      getValue: (asset: any) => formatPercentage(asset.profitLossPercentage),
      getSecondaryValue: (asset: any) => formatCurrency(asset.totalValue)
    },
    {
      title: 'Highest Value Holdings',
      icon: DollarSign,
      color: 'text-crypto-primary',
      bgColor: 'bg-crypto-primary/20',
      data: highestValueAssets,
      getValue: (asset: any) => formatCurrency(asset.totalValue),
      getSecondaryValue: (asset: any) => `${asset.amount} ${asset.symbol}`
    },
    {
      title: 'Recent Additions',
      icon: Clock,
      color: 'text-crypto-secondary',
      bgColor: 'bg-crypto-secondary/20',
      data: mostRecent,
      getValue: (asset: any) => formatCurrency(asset.totalValue),
      getSecondaryValue: (asset: any) => new Date(asset.dateAdded).toLocaleDateString()
    },
    {
      title: 'Underperformers',
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      data: worstPerformers,
      getValue: (asset: any) => formatPercentage(asset.profitLossPercentage),
      getSecondaryValue: (asset: any) => formatCurrency(asset.totalValue)
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {overviewSections.map((section, index) => {
        const Icon = section.icon
        return (
          <div key={index} className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className={`p-2 rounded-lg ${section.bgColor}`}>
                <Icon className={`w-5 h-5 ${section.color}`} />
              </div>
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.data.length > 0 ? (
                section.data.map((asset, assetIndex) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${section.color}`}>
                        {section.getValue(asset)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {section.getSecondaryValue(asset)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Recent Transactions */}
      <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'} lg:col-span-2`}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-crypto-primary/20' : 'bg-crypto-primary/10'}`}>
            <History className="w-5 h-5 text-crypto-primary" />
          </div>
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {portfolio.transactions.slice(0, 10).map((transaction) => (
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
          {portfolio.transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioOverview
