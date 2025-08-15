import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CryptoGrid from './components/CryptoGrid'
import CryptoStats from './components/CryptoStats'
import LoadingSpinner from './components/LoadingSpinner'
import { CryptoData } from './types/crypto'
import { fetchCryptoData } from './services/cryptoApi'

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h'>('market_cap')

  useEffect(() => {
    loadCryptoData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadCryptoData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const loadCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoData()
      setCryptoData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto data')
    } finally {
      setLoading(false)
    }
  }

  const filteredCryptoData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCryptoData = [...filteredCryptoData].sort((a, b) => {
    switch (sortBy) {
      case 'market_cap':
        return b.quote.USD.market_cap - a.quote.USD.market_cap
      case 'price':
        return b.quote.USD.price - a.quote.USD.price
      case 'change_24h':
        return b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h
      default:
        return 0
    }
  })

  if (loading && cryptoData.length === 0) {
    return <LoadingSpinner />
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
        
        <CryptoStats cryptoData={cryptoData} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 gradient-text">
            Cryptocurrency Market
          </h2>
          <CryptoGrid cryptoData={sortedCryptoData} />
        </div>
      </main>
    </div>
  )
}

export default App
