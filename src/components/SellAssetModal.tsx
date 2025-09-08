import React, { useState } from 'react'
import { X, TrendingDown, Minus } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { PortfolioAsset } from '../types/crypto'

interface SellAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSellAsset: (assetId: string, amount: number, price: number, notes?: string) => void
  asset: PortfolioAsset | null
  loading?: boolean
}

const SellAssetModal: React.FC<SellAssetModalProps> = ({
  isOpen,
  onClose,
  onSellAsset,
  asset,
  loading = false
}) => {
  const { isDark } = useTheme()
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [sellType, setSellType] = useState<'partial' | 'all'>('partial')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset || !amount || !price) return

    const sellAmount = sellType === 'all' ? asset.amount : parseFloat(amount)
    onSellAsset(asset.id, sellAmount, parseFloat(price), notes || undefined)
    
    // Reset form
    setAmount('')
    setPrice('')
    setNotes('')
    setSellType('partial')
    onClose()
  }

  const handleSellTypeChange = (type: 'partial' | 'all') => {
    setSellType(type)
    if (type === 'all') {
      setAmount(asset?.amount.toString() || '')
    } else {
      setAmount('')
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (asset && value) {
      const numValue = parseFloat(value)
      if (numValue > asset.amount) {
        setAmount(asset.amount.toString())
      }
    }
  }

  if (!isOpen || !asset) return null

  const maxAmount = asset.amount
  const currentValue = asset.currentPrice * (sellType === 'all' ? asset.amount : parseFloat(amount || '0'))
  const sellValue = parseFloat(price || '0') * (sellType === 'all' ? asset.amount : parseFloat(amount || '0'))

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
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sell Asset</h2>
              <p className="text-sm text-gray-500">{asset.name} ({asset.symbol})</p>
            </div>
          </div>
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

        {/* Asset Info */}
        <div className={`p-6 border-b border-white/10 ${isDark ? 'bg-crypto-dark/50' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Current Holdings</div>
              <div className="font-medium">{asset.amount} {asset.symbol}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Current Price</div>
              <div className="font-medium">${asset.currentPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Total Value</div>
              <div className="font-medium">${asset.totalValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Avg Buy Price</div>
              <div className="font-medium">${asset.averagePrice.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sell Type */}
          <div>
            <label className="block text-sm font-medium mb-3">Sell Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSellTypeChange('partial')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  sellType === 'partial'
                    ? 'bg-crypto-primary text-white'
                    : isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-gray-100 text-crypto-light-text hover:bg-gray-200'
                }`}
              >
                Partial Sell
              </button>
              <button
                type="button"
                onClick={() => handleSellTypeChange('all')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  sellType === 'all'
                    ? 'bg-red-500 text-white'
                    : isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-gray-100 text-crypto-light-text hover:bg-gray-200'
                }`}
              >
                Sell All
              </button>
            </div>
          </div>

          {/* Amount */}
          {sellType === 'partial' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount to Sell
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max={maxAmount}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                  }`}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {asset.symbol}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Max: {maxAmount} {asset.symbol}
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sell Price per Unit (USD)
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
            <div className="text-xs text-gray-500 mt-1">
              Current: ${asset.currentPrice.toLocaleString()}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any notes about this sale..."
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

          {/* Value Display */}
          {(amount || sellType === 'all') && price && (
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-red-500/20' : 'bg-red-50'
            }`}>
              <div className="text-sm text-gray-500 mb-1">Sell Value</div>
              <div className="text-xl font-semibold text-red-500">
                ${sellValue.toLocaleString()}
              </div>
              {sellType === 'partial' && (
                <div className="text-sm text-gray-500 mt-1">
                  Remaining: {maxAmount - parseFloat(amount || '0')} {asset.symbol}
                </div>
              )}
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
              disabled={!amount || !price || loading || (sellType === 'partial' && parseFloat(amount) > maxAmount)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Minus className="w-4 h-4" />
                  Sell Asset
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellAssetModal
