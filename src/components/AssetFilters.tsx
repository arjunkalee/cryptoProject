import React, { useState } from 'react'
import { Filter, X, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'

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

interface AssetFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isOpen,
  onToggle
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      marketCapRange: [0, 1000000000000], // 0 to 1T
      volumeRange: [0, 100000000000], // 0 to 100B
      priceRange: [0, 100000], // 0 to 100K
      change24hRange: [-100, 100], // -100% to +100%
      change7dRange: [-100, 100], // -100% to +100%
      marketCapSort: 'desc',
      volumeSort: 'desc',
      priceSort: 'desc',
      change24hSort: 'desc',
      change7dSort: 'desc'
    }
    setLocalFilters(defaultFilters)
    onReset()
  }

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

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-crypto-primary hover:bg-crypto-secondary text-white rounded-lg transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>
    )
  }

  return (
    <div className="bg-crypto-dark rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Asset Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Cap Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Market Cap
            </label>
            <select
              value={localFilters.marketCapSort}
              onChange={(e) => handleFilterChange('marketCapSort', e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            {formatRange(localFilters.marketCapRange, 'currency')}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="1000000000000"
              step="1000000000"
              value={localFilters.marketCapRange[0]}
              onChange={(e) => handleFilterChange('marketCapRange', [parseInt(e.target.value), localFilters.marketCapRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="1000000000000"
              step="1000000000"
              value={localFilters.marketCapRange[1]}
              onChange={(e) => handleFilterChange('marketCapRange', [localFilters.marketCapRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Volume Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              24h Volume
            </label>
            <select
              value={localFilters.volumeSort}
              onChange={(e) => handleFilterChange('volumeSort', e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            {formatRange(localFilters.volumeRange, 'currency')}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="100000000000"
              step="100000000"
              value={localFilters.volumeRange[0]}
              onChange={(e) => handleFilterChange('volumeRange', [parseInt(e.target.value), localFilters.volumeRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100000000000"
              step="100000000"
              value={localFilters.volumeRange[1]}
              onChange={(e) => handleFilterChange('volumeRange', [localFilters.volumeRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price
            </label>
            <select
              value={localFilters.priceSort}
              onChange={(e) => handleFilterChange('priceSort', e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            {formatRange(localFilters.priceRange, 'currency')}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={localFilters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), localFilters.priceRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={localFilters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [localFilters.priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* 24h Change Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              24h Change
            </label>
            <select
              value={localFilters.change24hSort}
              onChange={(e) => handleFilterChange('change24hSort', e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            {formatRange(localFilters.change24hRange, 'percentage')}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={localFilters.change24hRange[0]}
              onChange={(e) => handleFilterChange('change24hRange', [parseInt(e.target.value), localFilters.change24hRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={localFilters.change24hRange[1]}
              onChange={(e) => handleFilterChange('change24hRange', [localFilters.change24hRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* 7d Change Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              7d Change
            </label>
            <select
              value={localFilters.change7dSort}
              onChange={(e) => handleFilterChange('change7dSort', e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            {formatRange(localFilters.change7dRange, 'percentage')}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={localFilters.change7dRange[0]}
              onChange={(e) => handleFilterChange('change7dRange', [parseInt(e.target.value), localFilters.change7dRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={localFilters.change7dRange[1]}
              onChange={(e) => handleFilterChange('change7dRange', [localFilters.change7dRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Quick Filters</label>
          <div className="space-y-2">
            <button
              onClick={() => {
                const newFilters = {
                  ...localFilters,
                  marketCapRange: [1000000000, 1000000000000], // 1B to 1T
                  volumeRange: [10000000, 100000000000] // 10M to 100B
                }
                setLocalFilters(newFilters)
                onFiltersChange(newFilters)
              }}
              className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Large Cap
            </button>
            <button
              onClick={() => {
                const newFilters = {
                  ...localFilters,
                  change24hRange: [5, 100], // 5% to 100%
                  change7dRange: [10, 100] // 10% to 100%
                }
                setLocalFilters(newFilters)
                onFiltersChange(newFilters)
              }}
              className="w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Top Performers
            </button>
            <button
              onClick={() => {
                const newFilters = {
                  ...localFilters,
                  change24hRange: [-100, -5], // -100% to -5%
                  change7dRange: [-100, -10] // -100% to -10%
                }
                setLocalFilters(newFilters)
                onFiltersChange(newFilters)
              }}
              className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Declining
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetFilters
