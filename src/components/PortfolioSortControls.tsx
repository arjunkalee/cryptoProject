import React from 'react'
import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SortHelpTooltip from './SortHelpTooltip'

export type SortField = 
  | 'name' 
  | 'symbol' 
  | 'amount' 
  | 'averagePrice' 
  | 'currentPrice' 
  | 'totalValue' 
  | 'profitLoss' 
  | 'profitLossPercentage' 
  | 'dateAdded'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

interface PortfolioSortControlsProps {
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
}

const sortOptions: { value: SortField; label: string; icon?: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'symbol', label: 'Symbol' },
  { value: 'amount', label: 'Amount' },
  { value: 'averagePrice', label: 'Avg Price' },
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'totalValue', label: 'Total Value' },
  { value: 'profitLoss', label: 'P&L' },
  { value: 'profitLossPercentage', label: 'P&L %' },
  { value: 'dateAdded', label: 'Date Added' }
]

const PortfolioSortControls: React.FC<PortfolioSortControlsProps> = ({
  sortConfig,
  onSortChange
}) => {
  const { isDark } = useTheme()

  const handleFieldChange = (field: SortField) => {
    // If clicking the same field, toggle direction
    if (sortConfig.field === field) {
      onSortChange({
        field,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      // Default to descending for most fields, ascending for name/symbol
      onSortChange({
        field,
        direction: ['name', 'symbol', 'dateAdded'].includes(field) ? 'asc' : 'desc'
      })
    }
  }

  const handleDirectionToggle = () => {
    onSortChange({
      ...sortConfig,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  return (
    <div className="flex items-center gap-3">
      {/* Sort Field Dropdown */}
      <div className="relative">
        <select
          value={sortConfig.field}
          onChange={(e) => handleFieldChange(e.target.value as SortField)}
          className={`appearance-none pr-8 pl-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-crypto-primary/50 ${
            isDark
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
      </div>

      {/* Sort Direction Toggle */}
      <button
        onClick={handleDirectionToggle}
        className={`p-2 rounded-lg border transition-all duration-200 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-crypto-primary/50 ${
          isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
        }`}
        title={`Sort ${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        <ArrowUpDown className={`w-4 h-4 transition-transform duration-200 ${
          sortConfig.direction === 'desc' ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Quick Sort Buttons */}
      <div className="flex items-center gap-2 ml-4">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Quick sort:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onSortChange({ field: 'totalValue', direction: 'desc' })}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              sortConfig.field === 'totalValue' && sortConfig.direction === 'desc'
                ? 'bg-crypto-primary text-white'
                : isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Value ↓
          </button>
          <button
            onClick={() => onSortChange({ field: 'profitLoss', direction: 'desc' })}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              sortConfig.field === 'profitLoss' && sortConfig.direction === 'desc'
                ? 'bg-crypto-primary text-white'
                : isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            P&L ↓
          </button>
          <button
            onClick={() => onSortChange({ field: 'profitLossPercentage', direction: 'desc' })}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              sortConfig.field === 'profitLossPercentage' && sortConfig.direction === 'desc'
                ? 'bg-crypto-primary text-white'
                : isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            % ↓
          </button>
        </div>
      </div>

      {/* Help Tooltip */}
      <SortHelpTooltip />
    </div>
  )
}

export default PortfolioSortControls
