import React, { useState } from 'react'
import { X, Search, Plus } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { CryptoData } from '../types/crypto'

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onAddAsset: (cryptoId: number, amount: number, price: number, notes?: string) => void
  availableCryptos: CryptoData[]
  loading?: boolean
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onAddAsset,
  availableCryptos,
  loading = false
}) => {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [notes, setNotes] = useState('')

  const filteredCryptos = availableCryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10) // Limit to 10 results

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCrypto && amount && price) {
      onAddAsset(
        selectedCrypto.id,
        parseFloat(amount),
        parseFloat(price),
        notes || undefined
      )
      // Reset form
      setSelectedCrypto(null)
      setAmount('')
      setPrice('')
      setNotes('')
      setSearchTerm('')
      onClose()
    }
  }

  const handleCryptoSelect = (crypto: CryptoData) => {
    setSelectedCrypto(crypto)
    setSearchTerm(`${crypto.name} (${crypto.symbol})`)
    setPrice(crypto.quote.USD.price.toString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
        isDark ? 'glass-card' : 'bg-white border border-crypto-light-border'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Add Asset to Portfolio</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-crypto-light-text-secondary hover:text-crypto-light-text'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Crypto Search */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Cryptocurrency
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                }`}
              />
            </div>
            
            {/* Search Results */}
            {searchTerm && !selectedCrypto && (
              <div className={`mt-2 max-h-48 overflow-y-auto rounded-lg border ${
                isDark ? 'bg-crypto-dark border-white/20' : 'bg-white border-crypto-light-border'
              }`}>
                {filteredCryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    type="button"
                    onClick={() => handleCryptoSelect(crypto)}
                    className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${
                      isDark ? 'text-white' : 'text-crypto-light-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${crypto.quote.USD.price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${
                          crypto.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {crypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}
                          {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredCryptos.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No cryptocurrencies found
                  </div>
                )}
              </div>
            )}

            {/* Selected Crypto */}
            {selectedCrypto && (
              <div className={`mt-2 p-4 rounded-lg border ${
                isDark ? 'bg-crypto-primary/20 border-crypto-primary/50' : 'bg-crypto-primary/10 border-crypto-primary/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedCrypto.name}</div>
                    <div className="text-sm text-gray-500">{selectedCrypto.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${selectedCrypto.quote.USD.price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${
                      selectedCrypto.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {selectedCrypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}
                      {selectedCrypto.quote.USD.percent_change_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
              }`}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price per Unit (USD)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
              }`}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any notes about this transaction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all resize-none ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
              }`}
            />
          </div>

          {/* Total Value Display */}
          {amount && price && (
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-crypto-accent/20' : 'bg-crypto-accent/10'
            }`}>
              <div className="text-sm text-gray-500 mb-1">Total Value</div>
              <div className="text-xl font-semibold">
                ${(parseFloat(amount) * parseFloat(price)).toLocaleString()}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCrypto || !amount || !price || loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Asset
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAssetModal
