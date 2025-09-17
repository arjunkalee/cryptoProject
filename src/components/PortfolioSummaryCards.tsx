import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, Clock, Star } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Portfolio } from '../types/crypto'
import { sortPortfolioAssets, PRESET_SORTS } from '../utils/portfolioSorting'

interface PortfolioSummaryCardsProps {
  portfolio: Portfolio
}

const PortfolioSummaryCards: React.FC<PortfolioSummaryCardsProps> = ({ portfolio }) => {
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
  const highestValueAssets = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.HIGHEST_VALUE.field, PRESET_SORTS.HIGHEST_VALUE.direction).slice(0, 3)
  const bestPerformers = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.BEST_PERFORMANCE.field, PRESET_SORTS.BEST_PERFORMANCE.direction).slice(0, 3)
  const worstPerformers = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.WORST_PERFORMANCE.field, PRESET_SORTS.WORST_PERFORMANCE.direction).slice(0, 3)
  const mostRecent = sortPortfolioAssets(portfolio.assets, PRESET_SORTS.MOST_RECENT.field, PRESET_SORTS.MOST_RECENT.direction).slice(0, 3)

  const summaryCards = [
    {
      title: 'Total Value',
      value: formatCurrency(portfolio.summary.totalValue),
      change: formatCurrency(portfolio.summary.dayChange),
      changePercentage: formatPercentage(portfolio.summary.dayChangePercentage),
      isPositive: portfolio.summary.dayChange >= 0,
      icon: DollarSign,
      color: 'crypto-primary'
    },
    {
      title: 'Total P&L',
      value: formatCurrency(portfolio.summary.totalProfitLoss),
      change: formatPercentage(portfolio.summary.totalProfitLossPercentage),
      changePercentage: '',
      isPositive: portfolio.summary.totalProfitLoss >= 0,
      icon: BarChart3,
      color: 'crypto-accent'
    },
    {
      title: 'Total Cost',
      value: formatCurrency(portfolio.summary.totalCost),
      change: 'Invested amount',
      changePercentage: '',
      isPositive: true,
      icon: Wallet,
      color: 'crypto-secondary'
    },
    {
      title: 'Assets',
      value: portfolio.summary.assetCount.toString(),
      change: 'Holdings',
      changePercentage: '',
      isPositive: true,
      icon: BarChart3,
      color: 'crypto-primary'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? `bg-${card.color}/20` : `bg-${card.color}/10`}`}>
                <Icon className={`w-6 h-6 text-${card.color}`} />
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                {card.title}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className={`text-sm flex items-center gap-1 ${
              card.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {card.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {card.change}
              {card.changePercentage && (
                <span className={`${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  ({card.changePercentage})
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PortfolioSummaryCards
