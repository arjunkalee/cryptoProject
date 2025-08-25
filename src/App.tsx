import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CryptoGrid from './components/CryptoGrid'
import CryptoStats from './components/CryptoStats'
import CryptoRecommendations from './components/CryptoRecommendations'
import LoadingSpinner from './components/LoadingSpinner'
import AssetFilters from './components/AssetFilters'
import FilterSummary from './components/FilterSummary'
import AuthModal from './components/AuthModal'
import { CryptoData, CryptoRecommendation } from './types/crypto'
import { User, LoginCredentials, RegisterCredentials } from './types/auth'
import { fetchCryptoData } from './services/cryptoApi'
import { getTopCryptoRecommendations } from './services/cryptoRecommendations'
import { authService } from './services/authService'

function App() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  // Crypto data state
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [cryptoRecommendations, setCryptoRecommendations] = useState<CryptoRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h'>('market_cap')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const defaultFilters = {
    marketCapRange: [0, 1000000000000] as [number, number], // 0 to 1T
    volumeRange: [0, 100000000000] as [number, number], // 0 to 100B
    priceRange: [0, 100000] as [number, number], // 0 to 100K
    change24hRange: [-100, 100] as [number, number], // -100% to +100%
    change7dRange: [-100, 100] as [number, number], // -100% to +100%
    marketCapSort: 'desc' as 'asc' | 'desc',
    volumeSort: 'desc' as 'asc' | 'desc',
    priceSort: 'desc' as 'asc' | 'desc',
    change24hSort: 'desc' as 'asc' | 'desc',
    change7dSort: 'desc' as 'asc' | 'desc'
  }
  
  const [assetFilters, setAssetFilters] = useState<typeof defaultFilters>(defaultFilters)
  
  const resetFilters = () => {
    setAssetFilters(defaultFilters)
  }

  // Authentication handlers
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      
      const response = await authService.login(credentials)
      setUser(response.user)
      setShowAuthModal(false)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      
      const response = await authService.register(credentials)
      setUser(response.user)
      setShowAuthModal(false)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setShowAuthModal(true)
  }

  useEffect(() => {
    // Initialize authentication service
    authService.init()
    
    // Check if user is already authenticated
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      // Show auth modal on first visit
      setShowAuthModal(true)
    }
  }, [])

  useEffect(() => {
    // Only load crypto data if user is authenticated
    if (user) {
      loadCryptoData()
      
      // Refresh data every 5 minutes
      const interval = setInterval(loadCryptoData, 5 * 60 * 1000)
      
      return () => clearInterval(interval)
    }
  }, [user])

  const loadCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoData()
      setCryptoData(data)
      
      // Generate recommendations from the crypto data
      const recommendations = getTopCryptoRecommendations(data)
      setCryptoRecommendations(recommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto data')
    } finally {
      setLoading(false)
    }
  }

  const filteredCryptoData = cryptoData.filter(crypto => {
    // Text search filter
    const matchesSearch = 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.cmc_rank.toString().includes(searchTerm)
    
    if (!matchesSearch) return false
    
    // Market cap filter
    const marketCap = crypto.quote.USD.market_cap
    if (marketCap < assetFilters.marketCapRange[0] || marketCap > assetFilters.marketCapRange[1]) return false
    
    // Volume filter
    const volume = crypto.quote.USD.volume_24h
    if (volume < assetFilters.volumeRange[0] || volume > assetFilters.volumeRange[1]) return false
    
    // Price filter
    const price = crypto.quote.USD.price
    if (price < assetFilters.priceRange[0] || price > assetFilters.priceRange[1]) return false
    
    // 24h change filter
    const change24h = crypto.quote.USD.percent_change_24h
    if (change24h < assetFilters.change24hRange[0] || change24h > assetFilters.change24hRange[1]) return false
    
    // 7d change filter
    const change7d = crypto.quote.USD.percent_change_7d
    if (change7d < assetFilters.change7dRange[0] || change7d > assetFilters.change7dRange[1]) return false
    
    return true
  })

  const sortedCryptoData = [...filteredCryptoData].sort((a, b) => {
    switch (sortBy) {
      case 'market_cap':
        return assetFilters.marketCapSort === 'desc' 
          ? b.quote.USD.market_cap - a.quote.USD.market_cap
          : a.quote.USD.market_cap - b.quote.USD.market_cap
      case 'price':
        return assetFilters.priceSort === 'desc'
          ? b.quote.USD.price - a.quote.USD.price
          : a.quote.USD.price - b.quote.USD.price
      case 'change_24h':
        return assetFilters.change24hSort === 'desc'
          ? b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h
          : a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h
      default:
        return 0
    }
  })

  // Show loading spinner only when user is authenticated but crypto data is still loading
  if (user && loading) {
    return <LoadingSpinner />
  }

  // Show auth modal when no user is logged in
  if (!user) {
    return (
      <>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={authLoading}
          error={authError}
        />
        <div className="min-h-screen bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-crypto-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-crypto-primary rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Crypto Tracker</h1>
            <p className="text-gray-400">Please sign in or create an account to continue</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-800">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={loadCryptoData}
        loading={loading}
        searchResultsCount={filteredCryptoData.length}
        totalResultsCount={cryptoData.length}
        allCryptoData={cryptoData}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            <p className="text-center">{error}</p>
            <button 
              onClick={loadCryptoData}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Top 5 Crypto Recommendations - Now at the top */}
        <div className="mb-8">
          <CryptoRecommendations 
            recommendations={cryptoRecommendations.filter(rec => {
              // Text search filter
              const matchesSearch = 
                searchTerm === '' || 
                rec.crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.crypto.cmc_rank.toString().includes(searchTerm)
              
              if (!matchesSearch) return false
              
              // Apply same filters as main grid
              const marketCap = rec.crypto.quote.USD.market_cap
              if (marketCap < assetFilters.marketCapRange[0] || marketCap > assetFilters.marketCapRange[1]) return false
              
              const volume = rec.crypto.quote.USD.volume_24h
              if (volume < assetFilters.volumeRange[0] || volume > assetFilters.volumeRange[1]) return false
              
              const price = rec.crypto.quote.USD.price
              if (price < assetFilters.priceRange[0] || price > assetFilters.priceRange[1]) return false
              
              const change24h = rec.crypto.quote.USD.percent_change_24h
              if (change24h < assetFilters.change24hRange[0] || change24h > assetFilters.change24hRange[1]) return false
              
              const change7d = rec.crypto.quote.USD.percent_change_7d
              if (change7d < assetFilters.change7dRange[0] || change7d > assetFilters.change7dRange[1]) return false
              
              return true
            })} 
          />
        </div>
        
        <CryptoStats cryptoData={cryptoData} />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">
              Cryptocurrency Market
            </h2>
            <AssetFilters
              filters={assetFilters}
              onFiltersChange={setAssetFilters}
              onReset={resetFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>
          
          <FilterSummary 
            filters={assetFilters}
            onReset={resetFilters}
          />
          
          <CryptoGrid cryptoData={sortedCryptoData} />
        </div>
      </main>
    </div>
  )
}

export default App
