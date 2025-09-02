import React, { useState, useEffect } from 'react'
import { Search, RefreshCw, TrendingUp, DollarSign, BarChart3, Settings } from 'lucide-react'
import UserProfile from './UserProfile'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: 'market_cap' | 'price' | 'change_24h'
  onSortChange: (sort: 'market_cap' | 'price' | 'change_24h') => void
  onRefresh: () => void
  loading: boolean
  searchResultsCount?: number
  totalResultsCount?: number
  allCryptoData?: Array<{ name: string; symbol: string; cmc_rank: number }>
  user?: { id: string; email: string; username: string; createdAt: Date; lastLoginAt: Date } | null
  onLogout?: () => void
  onSettingsToggle?: () => void
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  loading,
  searchResultsCount,
  totalResultsCount,
  user,
  onLogout,
  onSettingsToggle
}) => {
  const { isDark } = useTheme()
  
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
      isDark 
        ? 'glass-card' 
        : 'bg-white/80 backdrop-blur-lg border border-crypto-light-border rounded-xl shadow-xl'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Crypto Tracker</h1>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'
              }`}>Real-time cryptocurrency data</p>
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
              className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                  : 'bg-white/80 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
              }`}
            />
            {searchTerm && (
              <>
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-white transition-colors"
                  title="Clear search"
                >
                  ✕
                </button>
                <div className={`absolute -bottom-8 left-0 text-sm ${
                  isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'
                }`}>
                  {searchResultsCount !== undefined && totalResultsCount !== undefined ? (
                    <span>
                      {searchResultsCount} of {totalResultsCount} results
                    </span>
                  ) : (
                    <span>Searching...</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sort and Refresh Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'market_cap' | 'price' | 'change_24h')}
                className={`appearance-none rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white' 
                    : 'bg-white/80 border border-crypto-light-border text-crypto-light-text'
                }`}
              >
                <option value="market_cap" className={isDark ? 'bg-crypto-dark text-white' : 'bg-white text-crypto-light-text'}>
                  Market Cap
                </option>
                <option value="price" className={isDark ? 'bg-crypto-dark text-white' : 'bg-white text-crypto-light-text'}>
                  Price
                </option>
                <option value="change_24h" className={isDark ? 'bg-crypto-dark text-white' : 'bg-white text-crypto-light-text'}>
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

            {/* Settings Button */}
            {user && onSettingsToggle && (
              <button
                onClick={onSettingsToggle}
                className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {/* User Profile */}
            {user && onLogout && (
              <UserProfile user={user} onLogout={onLogout} />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
