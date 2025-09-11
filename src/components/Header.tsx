import React, { useState, useEffect } from 'react'
import { Search, RefreshCw, TrendingUp, DollarSign, BarChart3, Settings, Wallet, ArrowLeftRight } from 'lucide-react'
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
  activeTab?: 'market' | 'portfolio' | 'transfer'
  onTabChange?: (tab: 'market' | 'portfolio' | 'transfer') => void
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
  onSettingsToggle,
  activeTab = 'market',
  onTabChange
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

          {/* Navigation Tabs */}
          {user && onTabChange && (
            <div className="flex space-x-1">
              <button
                onClick={() => onTabChange('market')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'market'
                    ? 'bg-crypto-primary text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-crypto-light-text-secondary hover:text-crypto-light-text hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Market
              </button>
              <button
                onClick={() => onTabChange('portfolio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'portfolio'
                    ? 'bg-crypto-primary text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-crypto-light-text-secondary hover:text-crypto-light-text hover:bg-gray-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
                Portfolio
              </button>
              <button
                onClick={() => onTabChange('transfer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'transfer'
                    ? 'bg-crypto-primary text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-crypto-light-text-secondary hover:text-crypto-light-text hover:bg-gray-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Transfer
              </button>
            </div>
          )}

          {/* Simplified Controls - Only show on market tab */}
          {activeTab === 'market' && (
            <div className="flex items-center gap-3">
              {/* Simple Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-64 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all text-sm ${
                    isDark 
                      ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                      : 'bg-white/80 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                  }`}
                />
              </div>

              {/* Simple Refresh */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
                }`}
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}

          {/* Settings and User Profile - Always show when user is logged in */}
          <div className="flex items-center gap-4">
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
