import { CryptoData, CryptoRecommendation } from '../types/crypto'
import { mlForecastingEngine } from './mlModels'

// Calculate recommendation score based on multiple factors
const calculateRecommendationScore = (crypto: CryptoData): number => {
  const { quote } = crypto
  
  // Base score starts at 50
  let score = 50
  
  // Price momentum (24h and 7d changes)
  if (quote.USD.percent_change_24h > 0) score += 10
  if (quote.USD.percent_change_7d > 0) score += 15
  if (quote.USD.percent_change_24h > 5) score += 5
  if (quote.USD.percent_change_7d > 10) score += 10
  
  // Market cap ranking (lower rank = higher score)
  if (crypto.cmc_rank <= 10) score += 15
  else if (crypto.cmc_rank <= 25) score += 10
  else if (crypto.cmc_rank <= 50) score += 5
  
  // Volume analysis
  if (quote.USD.volume_24h > 1000000000) score += 10 // High volume
  else if (quote.USD.volume_24h > 100000000) score += 5 // Medium volume
  
  // Supply analysis
  if (crypto.max_supply && crypto.circulating_supply < crypto.max_supply * 0.8) {
    score += 5 // Scarcity factor
  }
  
  return Math.min(100, Math.max(0, score))
}

// Calculate trend score based on recent performance
const calculateTrendScore = (crypto: CryptoData): number => {
  const { quote } = crypto
  let score = 50
  
  // Recent momentum
  if (quote.USD.percent_change_1h > 0) score += 5
  if (quote.USD.percent_change_24h > 0) score += 10
  if (quote.USD.percent_change_7d > 0) score += 15
  
  // Strong positive trends
  if (quote.USD.percent_change_24h > 5) score += 10
  if (quote.USD.percent_change_7d > 15) score += 10
  
  return Math.min(100, Math.max(0, score))
}

// Calculate momentum score
const calculateMomentumScore = (crypto: CryptoData): number => {
  const { quote } = crypto
  let score = 50
  
  // Volume momentum
  if (quote.USD.volume_24h > 5000000000) score += 20 // Very high volume
  else if (quote.USD.volume_24h > 1000000000) score += 15 // High volume
  else if (quote.USD.volume_24h > 100000000) score += 10 // Medium volume
  
  // Price momentum
  if (quote.USD.percent_change_24h > 10) score += 15
  if (quote.USD.percent_change_7d > 20) score += 15
  
  return Math.min(100, Math.max(0, score))
}

// Calculate risk score
const calculateRiskScore = (crypto: CryptoData): number => {
  const { quote } = crypto
  let score = 50
  
  // Volatility risk
  if (Math.abs(quote.USD.percent_change_24h) > 20) score += 20 // High volatility
  else if (Math.abs(quote.USD.percent_change_24h) > 10) score += 10 // Medium volatility
  
  // Market cap risk
  if (quote.USD.market_cap < 1000000000) score += 15 // Small cap = higher risk
  else if (quote.USD.market_cap < 10000000000) score += 10 // Medium cap
  
  // Supply risk
  if (crypto.infinite_supply) score += 10 // Infinite supply = inflation risk
  
  return Math.min(100, Math.max(0, score))
}

// Determine recommendation based on scores
const getRecommendation = (recommendationScore: number, trendScore: number, momentumScore: number, riskScore: number): 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' => {
  const avgScore = (recommendationScore + trendScore + momentumScore + (100 - riskScore)) / 4
  
  if (avgScore >= 80) return 'Strong Buy'
  if (avgScore >= 65) return 'Buy'
  if (avgScore >= 45) return 'Hold'
  if (avgScore >= 30) return 'Sell'
  return 'Strong Sell'
}

// Generate reasoning for recommendations
const generateReasoning = (crypto: CryptoData, recommendationScore: number, trendScore: number, momentumScore: number): string[] => {
  const reasons = []
  const { quote } = crypto
  
  // Performance reasons
  if (quote.USD.percent_change_24h > 0) {
    reasons.push(`Strong 24h performance with ${quote.USD.percent_change_24h.toFixed(2)}% gain`)
  }
  
  if (quote.USD.percent_change_7d > 0) {
    reasons.push(`Positive weekly momentum with ${quote.USD.percent_change_7d.toFixed(2)}% growth`)
  }
  
  // Market position reasons
  if (crypto.cmc_rank <= 10) {
    reasons.push(`Top 10 cryptocurrency by market cap - established market leader`)
  } else if (crypto.cmc_rank <= 25) {
    reasons.push(`Top 25 cryptocurrency - strong market presence`)
  }
  
  // Volume reasons
  if (quote.USD.volume_24h > 1000000000) {
    reasons.push(`High trading volume indicates strong market interest`)
  }
  
  // Supply reasons
  if (crypto.max_supply && crypto.circulating_supply < crypto.max_supply * 0.8) {
    reasons.push(`Limited circulating supply relative to max supply - scarcity factor`)
  }
  
  // Technical reasons
  if (recommendationScore > 70) {
    reasons.push(`High overall recommendation score based on multiple factors`)
  }
  
  if (trendScore > 70) {
    reasons.push(`Strong positive trend indicators`)
  }
  
  if (momentumScore > 70) {
    reasons.push(`High momentum with strong volume and price action`)
  }
  
  return reasons
}

// Generate risk factors
const generateRiskFactors = (crypto: CryptoData, riskScore: number): string[] => {
  const risks = []
  const { quote } = crypto
  
  // Volatility risks
  if (Math.abs(quote.USD.percent_change_24h) > 15) {
    risks.push(`High volatility - 24h change of ${quote.USD.percent_change_24h.toFixed(2)}%`)
  }
  
  // Market cap risks
  if (quote.USD.market_cap < 1000000000) {
    risks.push(`Small market cap - higher risk of price manipulation`)
  }
  
  // Supply risks
  if (crypto.infinite_supply) {
    risks.push(`Infinite supply - potential for inflation over time`)
  }
  
  // Performance risks
  if (quote.USD.percent_change_24h < -10) {
    risks.push(`Recent significant decline - potential bearish momentum`)
  }
  
  if (riskScore > 70) {
    risks.push(`High overall risk score - consider position sizing carefully`)
  }
  
  return risks
}

// Generate technical analysis
const generateTechnicalAnalysis = (crypto: CryptoData): CryptoRecommendation['technical_analysis'] => {
  const { quote } = crypto
  
  // Simple RSI calculation based on price changes
  const rsi = 50 + (quote.USD.percent_change_24h * 2) + (quote.USD.percent_change_7d * 0.5)
  
  // Trend determination
  let trend: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral'
  if (quote.USD.percent_change_24h > 5 && quote.USD.percent_change_7d > 10) {
    trend = 'Bullish'
  } else if (quote.USD.percent_change_24h < -5 && quote.USD.percent_change_7d < -10) {
    trend = 'Bearish'
  }
  
  // Support and resistance levels (simplified)
  const currentPrice = quote.USD.price
  const support_level = currentPrice * 0.85
  const resistance_level = currentPrice * 1.15
  
  // Volatility calculation
  const volatility = Math.abs(quote.USD.percent_change_24h) + Math.abs(quote.USD.percent_change_7d) / 7
  
  return {
    rsi: Math.max(0, Math.min(100, rsi)),
    trend,
    support_level,
    resistance_level,
    volatility
  }
}

// Generate price forecasts using ML models
const generateForecast = (crypto: CryptoData, technicalAnalysis: CryptoRecommendation['technical_analysis']): CryptoRecommendation['forecast'] => {
  // Get ML prediction
  const mlPrediction = mlForecastingEngine.predict(crypto)
  
  // Fallback to simple forecast if ML fails
  const currentPrice = crypto.quote.USD.price
  const trend = technicalAnalysis.trend
  
  let fallbackShortTerm = currentPrice
  let fallbackMediumTerm = currentPrice
  let fallbackLongTerm = currentPrice
  
  if (trend === 'Bullish') {
    fallbackShortTerm = currentPrice * 1.05 // 5% increase in 1 week
    fallbackMediumTerm = currentPrice * 1.15 // 15% increase in 1 month
    fallbackLongTerm = currentPrice * 1.25 // 25% increase in 3 months
  } else if (trend === 'Bearish') {
    fallbackShortTerm = currentPrice * 0.95 // 5% decrease in 1 week
    fallbackMediumTerm = currentPrice * 0.85 // 15% decrease in 1 month
    fallbackLongTerm = currentPrice * 0.75 // 25% decrease in 3 months
  }
  
  // Use ML prediction if available, otherwise fallback
  const short_term = mlPrediction?.short_term || fallbackShortTerm
  const medium_term = mlPrediction?.medium_term || fallbackMediumTerm
  const long_term = mlPrediction?.long_term || fallbackLongTerm
  const confidence = mlPrediction?.confidence || 60
  
  return {
    short_term,
    medium_term,
    long_term,
    confidence,
    ml_prediction: mlPrediction ? {
      model_scores: mlPrediction.model_scores,
      trend_strength: mlPrediction.trend_strength,
      volatility_forecast: mlPrediction.volatility_forecast,
      technical_indicators: {
        rsi: technicalAnalysis.rsi,
        macd: 0, // Will be calculated by ML model
        macd_signal: 0,
        bb_upper: technicalAnalysis.resistance_level,
        bb_lower: technicalAnalysis.support_level,
        stochastic_k: 50, // Placeholder
        williams_r: -50 // Placeholder
      }
    } : undefined
  }
}

export const getTopCryptoRecommendations = (cryptoData: CryptoData[]): CryptoRecommendation[] => {
  return cryptoData
    .map(crypto => {
      const recommendationScore = calculateRecommendationScore(crypto)
      const trendScore = calculateTrendScore(crypto)
      const momentumScore = calculateMomentumScore(crypto)
      const riskScore = calculateRiskScore(crypto)
      
      const recommendation = getRecommendation(recommendationScore, trendScore, momentumScore, riskScore)
      const reasoning = generateReasoning(crypto, recommendationScore, trendScore, momentumScore)
      const riskFactors = generateRiskFactors(crypto, riskScore)
      const technicalAnalysis = generateTechnicalAnalysis(crypto)
      const forecast = generateForecast(crypto, technicalAnalysis)
      
      return {
        crypto,
        recommendation_score: recommendationScore,
        trend_score: trendScore,
        momentum_score: momentumScore,
        risk_score: riskScore,
        recommendation,
        reasoning,
        risk_factors: riskFactors,
        technical_analysis: technicalAnalysis,
        forecast
      }
    })
    .sort((a, b) => {
      // Sort by recommendation score, then by trend score
      if (a.recommendation_score !== b.recommendation_score) {
        return b.recommendation_score - a.recommendation_score
      }
      return b.trend_score - a.trend_score
    })
    .slice(0, 5) // Return top 5
}
