import React from 'react'
import { Filter, X } from 'lucide-react'

interface FilterOptions {
  marketCapRange: [number, number]
  volumeRange: [number, number]
  priceRange: [number, number]
  change24hRange: [number, number]
  change7dRange: [number, number]
  marketCapSort: 'asc' | 'desc'
  volumeSort: 'asc' | 'desc'
  priceSort: 'asc' | 'desc'
  change24hSort: 'asc' | 'desc'
  change7dSort: 'asc' | 'desc'
}

interface FilterSummaryProps {
  filters: FilterOptions
  onReset: () => void
}

const FilterSummary: React.FC<FilterSummaryProps> = ({ filters, onReset }) => {
  const hasActiveFilters = 
    filters.marketCapRange[0] > 0 ||
    filters.marketCapRange[1] < 1000000000000 ||
    filters.volumeRange[0] > 0 ||
    filters.volumeRange[1] < 100000000000 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000 ||
    filters.change24hRange[0] > -100 ||
    filters.change24hRange[1] < 100 ||
    filters.change7dRange[0] > -100 ||
    filters.change7dRange[1] < 100

  if (!hasActiveFilters) return null

  const formatRange = (range: [number, number], type: 'currency' | 'percentage') => {
    if (type === 'currency') {
      const formatValue = (value: number) => {
        if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`
        if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
        if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
        return value.toFixed(0)
      }
      return `${formatValue(range[0])} - ${formatValue(range[1])}`
    } else {
      return `${range[0].toFixed(1)}% - ${range[1].toFixed(1)}%`
    }
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.marketCapRange[0] > 0 || filters.marketCapRange[1] < 1000000000000) count++
    if (filters.volumeRange[0] > 0 || filters.volumeRange[1] < 100000000000) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++
    if (filters.change24hRange[0] > -100 || filters.change24hRange[1] < 100) count++
    if (filters.change7dRange[0] > -100 || filters.change7dRange[1] < 100) count++
    return count
  }

  return (
    <div className="mb-4 p-3 bg-crypto-darker rounded-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-crypto-primary" />
          <span className="text-sm text-gray-300">
            {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear all
        </button>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {filters.marketCapRange[0] > 0 || filters.marketCapRange[1] < 1000000000000 ? (
          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-600/30">
            Market Cap: {formatRange(filters.marketCapRange, 'currency')}
          </span>
        ) : null}
        
        {filters.volumeRange[0] > 0 || filters.volumeRange[1] < 100000000000 ? (
          <span className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded border border-green-600/30">
            Volume: {formatRange(filters.volumeRange, 'currency')}
          </span>
        ) : null}
        
        {filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? (
          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-600/30">
            Price: {formatRange(filters.priceRange, 'currency')}
          </span>
        ) : null}
        
        {filters.change24hRange[0] > -100 || filters.change24hRange[1] < 100 ? (
          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded border border-yellow-600/30">
            24h: {formatRange(filters.change24hRange, 'percentage')}
          </span>
        ) : null}
        
        {filters.change7dRange[0] > -100 || filters.change7dRange[1] < 100 ? (
          <span className="px-2 py-1 bg-orange-600/20 text-orange-300 text-xs rounded border border-orange-600/30">
            7d: {formatRange(filters.change7dRange, 'percentage')}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default FilterSummary
