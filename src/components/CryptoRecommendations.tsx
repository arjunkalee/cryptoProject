import React, { useState } from 'react'
import { CryptoRecommendation } from '../types/crypto'
import CryptoChart from './CryptoChart'

interface CryptoRecommendationsProps {
  recommendations: CryptoRecommendation[]
  className?: string
}

const CryptoRecommendations: React.FC<CryptoRecommendationsProps> = ({ recommendations, className = '' }) => {
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
    <div className={`bg-crypto-dark rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Top 5 Crypto Asset Recommendations
        </h2>
        <p className="text-gray-400 text-sm">
          Based on performance analysis, technical indicators, and market trends
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.crypto.symbol} className="bg-crypto-darker rounded-lg p-4 border border-gray-700">
            {/* Crypto Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {rec.crypto.symbol.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{rec.crypto.symbol}</h3>
                  <p className="text-gray-400 text-sm">{rec.crypto.name}</p>
                  <p className="text-gray-500 text-xs">Rank #{rec.crypto.cmc_rank}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{formatCurrency(rec.crypto.quote.USD.price)}</p>
                <p className={`text-sm ${rec.crypto.quote.USD.percent_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(rec.crypto.quote.USD.percent_change_24h)}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Market Cap</p>
                <p className="text-white font-semibold">{formatCurrency(rec.crypto.quote.USD.market_cap)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">24h Volume</p>
                <p className="text-white font-semibold">{formatCurrency(rec.crypto.quote.USD.volume_24h)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">7d Change</p>
                <p className={`text-sm font-semibold ${rec.crypto.quote.USD.percent_change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(rec.crypto.quote.USD.percent_change_7d)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Score</p>
                <p className={`text-sm font-semibold ${getScoreColor(rec.recommendation_score)}`}>
                  {rec.recommendation_score}/100
                </p>
              </div>
            </div>

            {/* Recommendation and Trend */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(rec.recommendation)} bg-gray-800`}>
                  {rec.recommendation}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(rec.technical_analysis.trend)} bg-gray-800`}>
                  {rec.technical_analysis.trend} Trend
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowChart(showChart === rec.crypto.symbol ? null : rec.crypto.symbol)}
                  className="text-green-400 hover:text-green-300 text-sm transition-colors px-3 py-1 border border-green-400 rounded-lg hover:bg-green-400/10"
                >
                  {showChart === rec.crypto.symbol ? 'Hide Chart' : 'Show Chart'}
                </button>
                <button
                  onClick={() => setExpandedCrypto(expandedCrypto === rec.crypto.symbol ? null : rec.crypto.symbol)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  {expandedCrypto === rec.crypto.symbol ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCrypto === rec.crypto.symbol && (
              <div className="border-t border-gray-700 pt-4 space-y-4">
                {/* Scores Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Analysis Scores</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Recommendation</p>
                      <p className={`text-white font-semibold ${getScoreColor(rec.recommendation_score)}`}>
                        {rec.recommendation_score}/100
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Trend</p>
                      <p className={`text-white font-semibold ${getScoreColor(rec.trend_score)}`}>
                        {rec.trend_score}/100
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Momentum</p>
                      <p className={`text-white font-semibold ${getScoreColor(rec.momentum_score)}`}>
                        {rec.momentum_score}/100
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Risk</p>
                      <p className={`text-white font-semibold ${getScoreColor(100 - rec.risk_score)}`}>
                        {(100 - rec.risk_score).toFixed(0)}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Technical Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">RSI</p>
                      <p className={`text-sm font-semibold ${
                        rec.technical_analysis.rsi > 70 ? 'text-red-400' : 
                        rec.technical_analysis.rsi < 30 ? 'text-green-400' : 'text-white'
                      }`}>
                        {rec.technical_analysis.rsi.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Support</p>
                      <p className="text-white font-semibold text-sm">
                        {formatCurrency(rec.technical_analysis.support_level)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Resistance</p>
                      <p className="text-white font-semibold text-sm">
                        {formatCurrency(rec.technical_analysis.resistance_level)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Volatility</p>
                      <p className="text-white font-semibold text-sm">
                        {rec.technical_analysis.volatility.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Trend</p>
                      <p className={`text-sm font-semibold ${getTrendColor(rec.technical_analysis.trend)}`}>
                        {rec.technical_analysis.trend}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Chart */}
                <div className="mb-6">
                  <CryptoChart recommendation={rec} />
                </div>

                {/* ML-Powered Price Forecast */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    🤖 AI-Powered Price Forecast
                    {rec.forecast.ml_prediction && (
                      <span className="ml-2 px-2 py-1 bg-blue-600 text-xs rounded-full">ML Enhanced</span>
                    )}
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">1 Week</p>
                      <p className="text-white font-semibold">{formatCurrency(rec.forecast.short_term)}</p>
                      <p className={`text-xs ${rec.forecast.short_term > rec.crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(((rec.forecast.short_term - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">1 Month</p>
                      <p className="text-white font-semibold">{formatCurrency(rec.forecast.medium_term)}</p>
                      <p className={`text-xs ${rec.forecast.medium_term > rec.crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(((rec.forecast.medium_term - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">3 Months</p>
                      <p className="text-white font-semibold">{formatCurrency(rec.forecast.long_term || rec.forecast.medium_term * 1.2)}</p>
                      <p className={`text-xs ${(rec.forecast.long_term || rec.forecast.medium_term * 1.2) > rec.crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage((((rec.forecast.long_term || rec.forecast.medium_term * 1.2) - rec.crypto.quote.USD.price) / rec.crypto.quote.USD.price) * 100)}
                      </p>
                    </div>
                    <div className="text-center bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Confidence</p>
                      <p className="text-white font-semibold">{rec.forecast.confidence.toFixed(0)}%</p>
                      <p className="text-gray-400 text-xs">AI confidence</p>
                    </div>
                  </div>
                  
                  {/* ML Model Scores */}
                  {rec.forecast.ml_prediction && (
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                      <h5 className="text-md font-semibold text-white mb-3">🧠 ML Model Analysis</h5>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">LSTM Neural</p>
                          <p className={`text-sm font-semibold ${getScoreColor(Math.abs(rec.forecast.ml_prediction.model_scores.lstm))}`}>
                            {rec.forecast.ml_prediction.model_scores.lstm.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">ARIMA</p>
                          <p className={`text-sm font-semibold ${getScoreColor(Math.abs(rec.forecast.ml_prediction.model_scores.arima))}`}>
                            {rec.forecast.ml_prediction.model_scores.arima.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Random Forest</p>
                          <p className={`text-sm font-semibold ${getScoreColor(Math.abs(rec.forecast.ml_prediction.model_scores.random_forest))}`}>
                            {rec.forecast.ml_prediction.model_scores.random_forest.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Linear Reg.</p>
                          <p className={`text-sm font-semibold ${getScoreColor(Math.abs(rec.forecast.ml_prediction.model_scores.linear_regression))}`}>
                            {rec.forecast.ml_prediction.model_scores.linear_regression.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Sentiment</p>
                          <p className={`text-sm font-semibold ${getScoreColor(Math.abs(rec.forecast.ml_prediction.model_scores.sentiment))}`}>
                            {rec.forecast.ml_prediction.model_scores.sentiment.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-700">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Trend Strength</p>
                          <p className="text-white font-semibold">{rec.forecast.ml_prediction.trend_strength.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Volatility Forecast</p>
                          <p className="text-white font-semibold">{rec.forecast.ml_prediction.volatility_forecast.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Why Buy */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Why {rec.recommendation}?</h4>
                  <ul className="space-y-2">
                    {rec.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-gray-300 text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Risk Factors</h4>
                  <ul className="space-y-2">
                    {rec.risk_factors.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">⚠</span>
                        <span className="text-gray-300 text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CryptoRecommendations
