import { CryptoData } from '../types/crypto'

// Technical Indicators Interface
export interface TechnicalIndicators {
  sma_20: number
  sma_50: number
  ema_12: number
  ema_26: number
  rsi: number
  macd: number
  macd_signal: number
  macd_histogram: number
  bb_upper: number
  bb_middle: number
  bb_lower: number
  stochastic_k: number
  stochastic_d: number
  williams_r: number
  momentum: number
  roc: number // Rate of Change
}

// ML Model Prediction Interface
export interface MLPrediction {
  short_term: number // 1 week
  medium_term: number // 1 month
  long_term: number // 3 months
  confidence: number
  model_scores: {
    lstm: number
    arima: number
    linear_regression: number
    random_forest: number
    sentiment: number
  }
  trend_strength: number
  volatility_forecast: number
}

// Market Sentiment Data
export interface MarketSentiment {
  social_sentiment: number // -1 to 1
  news_sentiment: number // -1 to 1
  fear_greed_index: number // 0 to 100
  volume_sentiment: number // based on volume analysis
  whale_activity: number // large transaction analysis
}

// Historical Data Point
interface HistoricalDataPoint {
  timestamp: number
  price: number
  volume: number
  market_cap: number
  price_change_24h: number
}

class MLForecastingEngine {
  
  // Generate mock historical data for ML training
  private generateHistoricalData(crypto: CryptoData, days: number = 90): HistoricalDataPoint[] {
    const data: HistoricalDataPoint[] = []
    const currentPrice = crypto.quote.USD.price
    const currentVolume = crypto.quote.USD.volume_24h
    const currentMarketCap = crypto.quote.USD.market_cap
    
    for (let i = days; i >= 0; i--) {
      const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000)
      
      // Simulate price evolution with trend and noise
      const trendFactor = 1 + (crypto.quote.USD.percent_change_7d / 100) * (7 - Math.min(i, 7)) / 7
      const noiseFactor = 1 + (Math.random() - 0.5) * 0.1 // 10% noise
      const seasonalFactor = 1 + Math.sin(i / 7) * 0.02 // Weekly seasonality
      
      const price = currentPrice * trendFactor * noiseFactor * seasonalFactor
      const volume = currentVolume * (0.8 + Math.random() * 0.4) // Volume variation
      const market_cap = price * crypto.circulating_supply
      const price_change_24h = i > 0 ? (price - data[data.length - 1]?.price || price) / price * 100 : crypto.quote.USD.percent_change_24h
      
      data.push({
        timestamp,
        price: parseFloat(price.toFixed(6)),
        volume: parseFloat(volume.toFixed(0)),
        market_cap: parseFloat(market_cap.toFixed(0)),
        price_change_24h: parseFloat(price_change_24h.toFixed(2))
      })
    }
    
    return data.reverse()
  }

  // Calculate comprehensive technical indicators
  private calculateTechnicalIndicators(data: HistoricalDataPoint[]): TechnicalIndicators {
    const prices = data.map(d => d.price)
    const volumes = data.map(d => d.volume)
    
    // Simple Moving Averages
    const sma_20 = this.calculateSMA(prices, 20)
    const sma_50 = this.calculateSMA(prices, 50)
    
    // Exponential Moving Averages
    const ema_12 = this.calculateEMA(prices, 12)
    const ema_26 = this.calculateEMA(prices, 26)
    
    // RSI (Relative Strength Index)
    const rsi = this.calculateRSI(prices, 14)
    
    // MACD (Moving Average Convergence Divergence)
    const macd = ema_12 - ema_26
    const macd_signal = this.calculateEMA([macd], 9)
    const macd_histogram = macd - macd_signal
    
    // Bollinger Bands
    const bb_middle = sma_20
    const stdDev = this.calculateStandardDeviation(prices.slice(-20))
    const bb_upper = bb_middle + (stdDev * 2)
    const bb_lower = bb_middle - (stdDev * 2)
    
    // Stochastic Oscillator
    const { stochastic_k, stochastic_d } = this.calculateStochastic(data, 14)
    
    // Williams %R
    const williams_r = this.calculateWilliamsR(data, 14)
    
    // Momentum and Rate of Change
    const momentum = this.calculateMomentum(prices, 10)
    const roc = this.calculateROC(prices, 10)
    
    return {
      sma_20,
      sma_50,
      ema_12,
      ema_26,
      rsi,
      macd,
      macd_signal,
      macd_histogram,
      bb_upper,
      bb_middle,
      bb_lower,
      stochastic_k,
      stochastic_d,
      williams_r,
      momentum,
      roc
    }
  }

  // LSTM Neural Network Simulation
  private lstmPredict(data: HistoricalDataPoint[], indicators: TechnicalIndicators): number {
    // Simulate LSTM prediction based on sequence patterns
    const prices = data.slice(-30).map(d => d.price) // Last 30 days
    const volumes = data.slice(-30).map(d => d.volume)
    
    // Normalize data (simplified)
    const priceNorm = prices.map(p => p / Math.max(...prices))
    const volumeNorm = volumes.map(v => v / Math.max(...volumes))
    
    // Simulate neural network weights and bias
    const weights = {
      price_trend: 0.4,
      volume_trend: 0.2,
      rsi_signal: 0.15,
      macd_signal: 0.15,
      bb_position: 0.1
    }
    
    // Calculate trends
    const priceTrend = (priceNorm[priceNorm.length - 1] - priceNorm[0]) / priceNorm.length
    const volumeTrend = (volumeNorm[volumeNorm.length - 1] - volumeNorm[0]) / volumeNorm.length
    
    // Technical signals
    const rsiSignal = (indicators.rsi - 50) / 50 // -1 to 1
    const macdSignal = indicators.macd_histogram > 0 ? 1 : -1
    const bbPosition = (prices[prices.length - 1] - indicators.bb_lower) / (indicators.bb_upper - indicators.bb_lower) - 0.5
    
    // LSTM output simulation
    const lstmOutput = (
      priceTrend * weights.price_trend +
      volumeTrend * weights.volume_trend +
      rsiSignal * weights.rsi_signal +
      macdSignal * weights.macd_signal +
      bbPosition * weights.bb_position
    )
    
    return Math.tanh(lstmOutput) // Output between -1 and 1
  }

  // ARIMA Model Simulation
  private arimaPredict(data: HistoricalDataPoint[]): number {
    const prices = data.slice(-21).map(d => d.price) // Last 21 days
    
    // Simplified ARIMA (1,1,1) simulation
    const returns = []
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
    
    // AR component (autoregressive)
    const ar1 = returns[returns.length - 1] * 0.3
    
    // MA component (moving average)
    const ma1 = returns.slice(-5).reduce((sum, r) => sum + r, 0) / 5 * 0.2
    
    // Forecast return
    const forecastReturn = ar1 + ma1
    
    return Math.tanh(forecastReturn * 10) // Normalize to -1 to 1
  }

  // Random Forest Simulation
  private randomForestPredict(indicators: TechnicalIndicators, sentiment: MarketSentiment): number {
    // Simulate decision trees voting
    const trees = [
      // Tree 1: RSI-focused
      indicators.rsi > 70 ? -0.2 : indicators.rsi < 30 ? 0.3 : 0,
      
      // Tree 2: MACD-focused
      indicators.macd > indicators.macd_signal ? 0.2 : -0.1,
      
      // Tree 3: Bollinger Bands
      indicators.bb_upper > indicators.bb_middle * 1.1 ? 0.1 : -0.05,
      
      // Tree 4: Sentiment-focused
      sentiment.social_sentiment * 0.3,
      
      // Tree 5: Volume-based
      sentiment.volume_sentiment * 0.2
    ]
    
    return trees.reduce((sum, vote) => sum + vote, 0) / trees.length
  }

  // Linear Regression Simulation
  private linearRegressionPredict(data: HistoricalDataPoint[], indicators: TechnicalIndicators): number {
    const features = [
      indicators.rsi / 100,
      indicators.macd_histogram,
      indicators.momentum,
      indicators.roc / 100,
      indicators.stochastic_k / 100
    ]
    
    // Simulated regression coefficients
    const coefficients = [0.15, 0.25, 0.2, 0.3, 0.1]
    const intercept = 0.02
    
    const prediction = features.reduce((sum, feature, i) => sum + feature * coefficients[i], intercept)
    
    return Math.tanh(prediction)
  }

  // Generate market sentiment (simulated)
  private generateMarketSentiment(crypto: CryptoData, data: HistoricalDataPoint[]): MarketSentiment {
    const recentVolumes = data.slice(-7).map(d => d.volume)
    const avgVolume = recentVolumes.reduce((sum, v) => sum + v, 0) / recentVolumes.length
    
    return {
      social_sentiment: Math.tanh((crypto.quote.USD.percent_change_24h / 100) * 2), // Based on price movement
      news_sentiment: Math.random() * 0.4 - 0.2, // Random news sentiment
      fear_greed_index: Math.max(0, Math.min(100, 50 + crypto.quote.USD.percent_change_7d * 2)),
      volume_sentiment: Math.tanh((crypto.quote.USD.volume_24h - avgVolume) / avgVolume),
      whale_activity: Math.random() * 0.6 - 0.3 // Simulated whale activity
    }
  }

  // Main prediction function
  public predict(crypto: CryptoData): MLPrediction {
    // Generate training data
    const historicalData = this.generateHistoricalData(crypto, 90)
    
    // Calculate technical indicators
    const indicators = this.calculateTechnicalIndicators(historicalData)
    
    // Generate market sentiment
    const sentiment = this.generateMarketSentiment(crypto, historicalData)
    
    // Get predictions from different models
    const lstmScore = this.lstmPredict(historicalData, indicators)
    const arimaScore = this.arimaPredict(historicalData)
    const rfScore = this.randomForestPredict(indicators, sentiment)
    const lrScore = this.linearRegressionPredict(historicalData, indicators)
    const sentimentScore = (sentiment.social_sentiment + sentiment.news_sentiment) / 2
    
    // Ensemble prediction (weighted average)
    const weights = { lstm: 0.3, arima: 0.2, rf: 0.25, lr: 0.15, sentiment: 0.1 }
    const ensemblePrediction = (
      lstmScore * weights.lstm +
      arimaScore * weights.arima +
      rfScore * weights.rf +
      lrScore * weights.lr +
      sentimentScore * weights.sentiment
    )
    
    // Convert ensemble prediction to price forecasts
    const currentPrice = crypto.quote.USD.price
    const baseChange = ensemblePrediction * 0.2 // Scale to reasonable percentage
    
    const short_term = currentPrice * (1 + baseChange)
    const medium_term = currentPrice * (1 + baseChange * 2.5)
    const long_term = currentPrice * (1 + baseChange * 4)
    
    // Calculate confidence based on model agreement
    const predictions = [lstmScore, arimaScore, rfScore, lrScore, sentimentScore]
    const variance = this.calculateVariance(predictions)
    const confidence = Math.max(60, Math.min(95, 90 - variance * 100))
    
    // Calculate trend strength and volatility forecast
    const trend_strength = Math.abs(ensemblePrediction) * 100
    const volatility_forecast = variance * 100
    
    return {
      short_term: parseFloat(short_term.toFixed(6)),
      medium_term: parseFloat(medium_term.toFixed(6)),
      long_term: parseFloat(long_term.toFixed(6)),
      confidence: parseFloat(confidence.toFixed(1)),
      model_scores: {
        lstm: parseFloat((lstmScore * 100).toFixed(1)),
        arima: parseFloat((arimaScore * 100).toFixed(1)),
        linear_regression: parseFloat((lrScore * 100).toFixed(1)),
        random_forest: parseFloat((rfScore * 100).toFixed(1)),
        sentiment: parseFloat((sentimentScore * 100).toFixed(1))
      },
      trend_strength: parseFloat(trend_strength.toFixed(1)),
      volatility_forecast: parseFloat(volatility_forecast.toFixed(1))
    }
  }

  // Helper calculation methods
  private calculateSMA(prices: number[], period: number): number {
    const slice = prices.slice(-period)
    return slice.reduce((sum, price) => sum + price, 0) / slice.length
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1)
    let ema = prices[0]
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier))
    }
    
    return ema
  }

  private calculateRSI(prices: number[], period: number): number {
    const gains = []
    const losses = []
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? -change : 0)
    }
    
    const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period
    const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period
    
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  private calculateStandardDeviation(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2))
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length
    return Math.sqrt(variance)
  }

  private calculateStochastic(data: HistoricalDataPoint[], period: number): { stochastic_k: number, stochastic_d: number } {
    const recentData = data.slice(-period)
    const currentPrice = data[data.length - 1].price
    const highestHigh = Math.max(...recentData.map(d => d.price))
    const lowestLow = Math.min(...recentData.map(d => d.price))
    
    const stochastic_k = ((currentPrice - lowestLow) / (highestHigh - lowestLow)) * 100
    const stochastic_d = stochastic_k // Simplified - should be SMA of %K
    
    return { stochastic_k, stochastic_d }
  }

  private calculateWilliamsR(data: HistoricalDataPoint[], period: number): number {
    const recentData = data.slice(-period)
    const currentPrice = data[data.length - 1].price
    const highestHigh = Math.max(...recentData.map(d => d.price))
    const lowestLow = Math.min(...recentData.map(d => d.price))
    
    return ((highestHigh - currentPrice) / (highestHigh - lowestLow)) * -100
  }

  private calculateMomentum(prices: number[], period: number): number {
    const current = prices[prices.length - 1]
    const previous = prices[prices.length - 1 - period]
    return current - previous
  }

  private calculateROC(prices: number[], period: number): number {
    const current = prices[prices.length - 1]
    const previous = prices[prices.length - 1 - period]
    return ((current - previous) / previous) * 100
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
  }
}

// Export singleton instance
export const mlForecastingEngine = new MLForecastingEngine()
