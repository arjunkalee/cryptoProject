import React, { useState } from 'react'
import { CryptoRecommendation } from '../types/crypto'
import CryptoChart from './CryptoChart'
import { useTheme } from '../contexts/ThemeContext'

interface CryptoRecommendationsProps {
  recommendations: CryptoRecommendation[]
  className?: string
}

const CryptoRecommendations: React.FC<CryptoRecommendationsProps> = ({ recommendations, className = '' }) => {
  const { isDark } = useTheme()
  const [expandedCrypto, setExpandedCrypto] = useState<string | null>(null)
  const [showChart, setShowChart] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-400'
      case 'Buy': return 'text-green-300'
      case 'Hold': return 'text-yellow-400'
      case 'Sell': return 'text-red-300'
      case 'Strong Sell': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-green-400'
      case 'Bearish': return 'text-red-400'
      case 'Neutral': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-crypto-dark' : 'bg-crypto-light-surface'} ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Top 5 Crypto Asset Recommendations
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
              Based on performance analysis, technical indicators, and market trends
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.crypto.symbol} className={`rounded-lg p-4 border ${isDark ? 'bg-crypto-darker border-gray-700' : 'bg-gray-50 border-crypto-light-border'}`}>
            {/* Crypto Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {rec.crypto.symbol.charAt(0)}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>{rec.crypto.symbol}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>{rec.crypto.name}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-crypto-light-text-secondary'}`}>Rank #{rec.crypto.cmc_rank}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>{formatCurrency(rec.crypto.quote.USD.price)}</p>
                <p className={`text-sm ${rec.crypto.quote.USD.percent_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(rec.crypto.quote.USD.percent_change_24h)}
                </p>
              </div>
            </div>

            {/* Recommendation Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                <div className={`text-2xl font-bold ${getRecommendationColor(rec.recommendation)}`}>
                  {rec.recommendation}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Recommendation</div>
              </div>
              
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                <div className={`text-2xl font-bold ${getScoreColor(rec.recommendation_score)}`}>
                  {rec.recommendation_score}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Score</div>
              </div>
              
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                <div className={`text-2xl font-bold ${getTrendColor(rec.technical_analysis.trend)}`}>
                  {rec.technical_analysis.trend}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Trend</div>
              </div>
              
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                <div className="text-2xl font-bold text-crypto-primary">
                  {rec.forecast.confidence}%
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Confidence</div>
              </div>
            </div>

            {/* Chart Toggle and Show More */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowChart(showChart === rec.crypto.symbol ? null : rec.crypto.symbol)}
                className="px-4 py-2 bg-crypto-accent/20 hover:bg-crypto-accent/30 text-crypto-accent rounded-lg transition-colors text-sm font-medium"
              >
                {showChart === rec.crypto.symbol ? 'Hide Chart' : 'Show Chart'}
              </button>
              
              <button
                onClick={() => setExpandedCrypto(expandedCrypto === rec.crypto.symbol ? null : rec.crypto.symbol)}
                className="px-4 py-2 bg-crypto-primary hover:bg-crypto-secondary text-white rounded-lg transition-colors text-sm font-medium"
              >
                {expandedCrypto === rec.crypto.symbol ? 'Show Less' : 'Show More'}
              </button>
            </div>

            {/* Chart */}
            {showChart === rec.crypto.symbol && (
              <div className="mt-4">
                <CryptoChart crypto={rec.crypto} />
              </div>
            )}

            {/* Expanded Details */}
            {expandedCrypto === rec.crypto.symbol && (
              <div className="mt-4 space-y-4">
                {/* Reasoning */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>Why {rec.crypto.symbol}?</h4>
                  <ul className="space-y-2">
                    {rec.reasoning.map((reason, index) => (
                      <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
                        <span className="text-crypto-primary mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>Risk Factors</h4>
                  <ul className="space-y-2">
                    {rec.risk_factors.map((risk, index) => (
                      <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
                        <span className="text-red-400 mt-1">⚠</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Analysis */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>Technical Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-crypto-primary">{rec.technical_analysis.rsi}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>RSI</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getTrendColor(rec.technical_analysis.trend)}`}>
                        {rec.technical_analysis.trend}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Trend</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-crypto-accent">
                        {formatCurrency(rec.technical_analysis.support_level)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-crypto-accent">
                        {formatCurrency(rec.technical_analysis.resistance_level)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Resistance</div>
                    </div>
                  </div>
                </div>

                {/* Forecast */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>Price Forecast</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/30' : 'bg-gray-100'}`}>
                      <div className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>1 Week</div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                        {formatCurrency(rec.forecast.short_term)}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                        {formatPercentage(((rec.forecast.short_term - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/30' : 'bg-gray-100'}`}>
                      <div className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>1 Month</div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                        {formatCurrency(rec.forecast.medium_term)}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                        {formatPercentage(((rec.forecast.medium_term - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-crypto-dark/30' : 'bg-gray-100'}`}>
                      <div className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>3 Months</div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                        {formatCurrency(rec.forecast.long_term)}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                        {formatPercentage(((rec.forecast.long_term - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ML Model Insights */}
                {rec.forecast.ml_prediction && (
                  <div className={`rounded-lg p-4 ${isDark ? 'bg-crypto-dark/50' : 'bg-white/80'}`}>
                    <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>AI Model Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Model Performance</h5>
                        <div className="space-y-2">
                          {Object.entries(rec.forecast.ml_prediction.model_scores).map(([model, score]) => (
                            <div key={model} className="flex items-center justify-between">
                              <span className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>{model}</span>
                              <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>Trend Analysis</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>Trend Strength</span>
                            <span className={`text-sm font-medium ${getScoreColor(rec.forecast.ml_prediction.trend_strength)}`}>
                              {rec.forecast.ml_prediction.trend_strength}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>Volatility Forecast</span>
                            <span className="text-sm font-medium text-crypto-accent">
                              {rec.forecast.ml_prediction.volatility_forecast}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CryptoRecommendations
