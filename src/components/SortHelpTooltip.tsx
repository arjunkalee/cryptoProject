import React, { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { PRESET_SORTS } from '../utils/portfolioSorting'

interface SortHelpTooltipProps {
  className?: string
}

const SortHelpTooltip: React.FC<SortHelpTooltipProps> = ({ className = '' }) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const sortDescriptions = [
    { key: 'name', label: 'Name', description: 'Sort alphabetically by cryptocurrency name' },
    { key: 'symbol', label: 'Symbol', description: 'Sort alphabetically by cryptocurrency symbol (e.g., BTC, ETH)' },
    { key: 'amount', label: 'Amount', description: 'Sort by the quantity of cryptocurrency you own' },
    { key: 'averagePrice', label: 'Average Price', description: 'Sort by your average purchase price' },
    { key: 'currentPrice', label: 'Current Price', description: 'Sort by the current market price' },
    { key: 'totalValue', label: 'Total Value', description: 'Sort by total USD value of your holdings' },
    { key: 'profitLoss', label: 'P&L', description: 'Sort by absolute profit or loss amount' },
    { key: 'profitLossPercentage', label: 'P&L %', description: 'Sort by profit/loss percentage' },
    { key: 'dateAdded', label: 'Date Added', description: 'Sort by when you first purchased the asset' }
  ]

  const quickSorts = [
    { label: 'Value ↓', description: 'Highest value holdings first' },
    { label: 'P&L ↓', description: 'Best performing assets first' },
    { label: '% ↓', description: 'Highest percentage gains first' }
  ]

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${
          isDark
            ? 'text-gray-400 hover:text-white hover:bg-white/10'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
        title="Sorting Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className={`absolute right-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg z-50 ${
            isDark
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Sorting Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full ${
                  isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-sm">Sort Fields</h4>
                <div className="space-y-2">
                  {sortDescriptions.map((sort) => (
                    <div key={sort.key} className="text-sm">
                      <span className="font-medium">{sort.label}:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {sort.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm">Quick Sorts</h4>
                <div className="space-y-2">
                  {quickSorts.map((sort, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{sort.label}:</span>
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {sort.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className="text-xs text-gray-500">
                  💡 Click on any column header or use the dropdown to sort your portfolio
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SortHelpTooltip
