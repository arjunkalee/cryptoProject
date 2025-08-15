import React from 'react'
import { Search, RefreshCw, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

interface HeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: 'market_cap' | 'price' | 'change_24h'
  onSortChange: (sort: 'market_cap' | 'price' | 'change_24h') => void
  onRefresh: () => void
  loading: boolean
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  loading
}) => {
  return (
    <header className="glass-card sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Crypto Tracker</h1>
              <p className="text-sm text-gray-300">Real-time cryptocurrency data</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Sort and Refresh Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'market_cap' | 'price' | 'change_24h')}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="market_cap" className="bg-crypto-dark text-white">
                  Market Cap
                </option>
                <option value="price" className="bg-crypto-dark text-white">
                  Price
                </option>
                <option value="change_24h" className="bg-crypto-dark text-white">
                  24h Change
                </option>
              </select>
              <BarChart3 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
