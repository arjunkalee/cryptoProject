import React, { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { CryptoData } from '../types/crypto'

interface PriceAlert {
  id: string
  cryptoId: number
  symbol: string
  name: string
  currentPrice: number
  targetPrice: number
  condition: 'above' | 'below'
  isActive: boolean
  createdAt: string
}

interface PriceAlertsProps {
  availableCryptos: CryptoData[]
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ availableCryptos }) => {
  const { isDark } = useTheme()
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [targetPrice, setTargetPrice] = useState('')
  const [condition, setCondition] = useState<'above' | 'below'>('above')

  // Load alerts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('crypto_price_alerts')
    if (stored) {
      try {
        setAlerts(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load price alerts:', error)
      }
    }
  }, [])

  // Save alerts to localStorage
  const saveAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts)
    localStorage.setItem('crypto_price_alerts', JSON.stringify(newAlerts))
  }

  // Add new alert
  const handleAddAlert = () => {
    if (!selectedCrypto || !targetPrice) return

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      cryptoId: selectedCrypto.id,
      symbol: selectedCrypto.symbol,
      name: selectedCrypto.name,
      currentPrice: selectedCrypto.quote.USD.price,
      targetPrice: parseFloat(targetPrice),
      condition,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    const updatedAlerts = [...alerts, newAlert]
    saveAlerts(updatedAlerts)
    
    // Reset form
    setSelectedCrypto(null)
    setTargetPrice('')
    setCondition('above')
    setShowAddAlert(false)
  }

  // Remove alert
  const handleRemoveAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId)
    saveAlerts(updatedAlerts)
  }

  // Toggle alert active state
  const handleToggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    )
    saveAlerts(updatedAlerts)
  }

  // Check for triggered alerts
  useEffect(() => {
    const checkAlerts = () => {
      const updatedAlerts = alerts.map(alert => {
        const crypto = availableCryptos.find(c => c.id === alert.cryptoId)
        if (!crypto) return alert

        const currentPrice = crypto.quote.USD.price
        const isTriggered = alert.condition === 'above' 
          ? currentPrice >= alert.targetPrice 
          : currentPrice <= alert.targetPrice

        if (isTriggered && alert.isActive) {
          // In a real app, you'd show a notification here
          console.log(`Alert triggered: ${alert.symbol} is ${alert.condition} ${alert.targetPrice}`)
        }

        return { ...alert, currentPrice }
      })

      if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
        saveAlerts(updatedAlerts)
      }
    }

    if (availableCryptos.length > 0) {
      checkAlerts()
    }
  }, [availableCryptos, alerts])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-crypto-primary" />
            Price Alerts
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
            Get notified when prices hit your targets
          </p>
        </div>
        <button
          onClick={() => setShowAddAlert(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crypto-primary/20 flex items-center justify-center">
            <Bell className="w-8 h-8 text-crypto-primary" />
          </div>
          <h4 className="text-lg font-medium mb-2">No Price Alerts</h4>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
            Create your first price alert to stay informed about market movements
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const crypto = availableCryptos.find(c => c.id === alert.cryptoId)
            const currentPrice = crypto?.quote.USD.price || alert.currentPrice
            const priceChange = ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100
            const isTriggered = alert.condition === 'above' 
              ? currentPrice >= alert.targetPrice 
              : currentPrice <= alert.targetPrice

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  isTriggered && alert.isActive
                    ? 'border-green-500 bg-green-500/10'
                    : isDark
                    ? 'border-white/10 bg-white/5'
                    : 'border-crypto-light-border bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{alert.symbol}</span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                        {alert.name}
                      </span>
                      {isTriggered && alert.isActive && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Triggered!
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Current Price</div>
                        <div className="font-medium">{formatCurrency(currentPrice)}</div>
                        {priceChange !== 0 && (
                          <div className={`text-xs ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-500">Target Price</div>
                        <div className="font-medium">{formatCurrency(alert.targetPrice)}</div>
                        <div className="text-xs text-gray-500">
                          {alert.condition === 'above' ? 'Alert when above' : 'Alert when below'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        alert.isActive
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleRemoveAlert(alert.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Alert Modal */}
      {showAddAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddAlert(false)}
          />
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
            isDark ? 'glass-card' : 'bg-white border border-crypto-light-border'
          }`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Price Alert</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                  <select
                    value={selectedCrypto?.id || ''}
                    onChange={(e) => {
                      const crypto = availableCryptos.find(c => c.id === parseInt(e.target.value))
                      setSelectedCrypto(crypto || null)
                    }}
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                      isDark 
                        ? 'bg-white/10 border border-white/20 text-white' 
                        : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text'
                    }`}
                  >
                    <option value="">Choose a cryptocurrency</option>
                    {availableCryptos.slice(0, 20).map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.name} ({crypto.symbol}) - {formatCurrency(crypto.quote.USD.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCondition('above')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        condition === 'above'
                          ? 'bg-crypto-primary text-white'
                          : isDark
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                          : 'bg-gray-100 text-crypto-light-text hover:bg-gray-200'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Above
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('below')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        condition === 'below'
                          ? 'bg-red-500 text-white'
                          : isDark
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                          : 'bg-gray-100 text-crypto-light-text hover:bg-gray-200'
                      }`}
                    >
                      <TrendingDown className="w-4 h-4 inline mr-2" />
                      Below
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Price (USD)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                      isDark 
                        ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                    }`}
                  />
                  {selectedCrypto && (
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {formatCurrency(selectedCrypto.quote.USD.price)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddAlert(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlert}
                  disabled={!selectedCrypto || !targetPrice}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceAlerts
