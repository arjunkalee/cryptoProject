import { useState, useEffect } from 'react'
import Header from './components/Header'
import CryptoRecommendations from './components/CryptoRecommendations'
import CryptoStats from './components/CryptoStats'
import CryptoGrid from './components/CryptoGrid'
import LoadingSpinner from './components/LoadingSpinner'
import AuthModal from './components/AuthModal'
import AssetFilters from './components/AssetFilters'
import FilterSummary from './components/FilterSummary'
import SettingsSidebar from './components/SettingsSidebar'
import PortfolioPage from './pages/PortfolioPage'
import TransferPage from './pages/TransferPage'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { fetchCryptoData } from './services/cryptoApi'
import { getTopCryptoRecommendations } from './services/cryptoRecommendations'
import { authService } from './services/authService'
import { User, LoginCredentials, RegisterCredentials } from './types/auth'
import { CryptoData, CryptoRecommendation } from './types/crypto'
import './index.css'

function AppContent() {
  const { isDark } = useTheme()
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [cryptoRecommendations, setCryptoRecommendations] = useState<CryptoRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h'>('market_cap')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [assetFilters, setAssetFilters] = useState({
    marketCapRange: [0, 1000000000000] as [number, number],
    volumeRange: [0, 100000000000] as [number, number],
    priceRange: [0, 100000] as [number, number],
    change24hRange: [-100, 100] as [number, number],
    change7dRange: [-100, 100] as [number, number],
    marketCapSort: 'desc' as 'asc' | 'desc',
    volumeSort: 'desc' as 'asc' | 'desc',
    priceSort: 'desc' as 'asc' | 'desc',
    change24hSort: 'desc' as 'asc' | 'desc',
    change7dSort: 'desc' as 'asc' | 'desc'
  })

  // Authentication state
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Settings sidebar state
  const [showSettings, setShowSettings] = useState(false)
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'transfer'>('market')

  const defaultFilters = {
    marketCapRange: [0, 1000000000000] as [number, number],
    volumeRange: [0, 100000000000] as [number, number],
    priceRange: [0, 100000] as [number, number],
    change24hRange: [-100, 100] as [number, number],
    change7dRange: [-100, 100] as [number, number],
    marketCapSort: 'desc' as 'asc' | 'desc',
    volumeSort: 'desc' as 'asc' | 'desc',
    priceSort: 'desc' as 'asc' | 'desc',
    change24hSort: 'desc' as 'asc' | 'desc',
    change7dSort: 'desc' as 'asc' | 'desc'
  }

  const resetFilters = () => {
    setAssetFilters(defaultFilters)
  }

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
      setError(err instanceof Error ? err.message : 'Failed to load crypto data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setShowAuthModal(false)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const response = await authService.register(credentials)
      setUser(response.user)
      setShowAuthModal(false)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  // Check authentication on mount
  useEffect(() => {
    authService.init()
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      setShowAuthModal(true)
    }
  }, [])

  // Load crypto data when user is authenticated
  useEffect(() => {
    if (user) {
      loadCryptoData()
      const interval = setInterval(loadCryptoData, 5 * 60 * 1000) // Refresh every 5 minutes
      return () => clearInterval(interval)
    }
  }, [user])

  // Filter crypto data based on search term and filters
  const filteredCryptoData = cryptoData.filter(crypto => {
    // Text search filter
    const matchesSearch = 
      searchTerm === '' || 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.cmc_rank.toString().includes(searchTerm)
    
    if (!matchesSearch) return false
    
    // Apply filters
    const marketCap = crypto.quote.USD.market_cap
    if (marketCap < assetFilters.marketCapRange[0] || marketCap > assetFilters.marketCapRange[1]) return false
    
    const volume = crypto.quote.USD.volume_24h
    if (volume < assetFilters.volumeRange[0] || volume > assetFilters.volumeRange[1]) return false
    
    const price = crypto.quote.USD.price
    if (price < assetFilters.priceRange[0] || price > assetFilters.priceRange[1]) return false
    
    const change24h = crypto.quote.USD.percent_change_24h
    if (change24h < assetFilters.change24hRange[0] || change24h > assetFilters.change24hRange[1]) return false
    
    const change7d = crypto.quote.USD.percent_change_7d
    if (change7d < assetFilters.change7dRange[0] || change7d > assetFilters.change7dRange[1]) return false
    
    return true
  })

  // Filter recommendations based on search and filters
  const filteredRecommendations = cryptoRecommendations.filter(rec => {
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
  })

  // Sort crypto data
  const sortedCryptoData = [...filteredCryptoData].sort((a, b) => {
    let aValue: number
    let bValue: number
    
    switch (sortBy) {
      case 'market_cap':
        aValue = a.quote.USD.market_cap
        bValue = b.quote.USD.market_cap
        break
      case 'price':
        aValue = a.quote.USD.price
        bValue = b.quote.USD.price
        break
      case 'change_24h':
        aValue = a.quote.USD.percent_change_24h
        bValue = b.quote.USD.percent_change_24h
        // For percentage changes, we want to show the highest absolute values first
        return Math.abs(bValue) - Math.abs(aValue)
      default:
        aValue = a.quote.USD.market_cap
        bValue = b.quote.USD.market_cap
    }
    
    return bValue - aValue
  })

  // Show loading spinner while user is authenticated but data is loading
  if (user && loading) {
    return <LoadingSpinner />
  }

  // Show auth modal and welcome screen if user is not authenticated
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
        <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${
          isDark 
            ? 'bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-800' 
            : 'bg-gradient-to-br from-crypto-light-bg via-gray-50 to-crypto-light-surface'
        }`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-crypto-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-crypto-primary rounded-full"></div>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-crypto-light-text'
            }`}>Welcome to Crypto Tracker</h1>
            <p className={isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}>Please sign in or create an account to continue</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-800' 
        : 'bg-gradient-to-br from-crypto-light-bg via-gray-50 to-crypto-light-surface'
    }`}>
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
        onSettingsToggle={() => setShowSettings(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'market' ? (
          <>
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
              <CryptoRecommendations recommendations={filteredRecommendations} />
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
          </>
        ) : activeTab === 'portfolio' ? (
          <PortfolioPage user={user} />
        ) : (
          <TransferPage user={user} />
        )}
      </main>

      {/* Settings Sidebar */}
      {user && (
        <SettingsSidebar 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
