import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { CryptoRecommendation } from '../types/crypto'

interface CryptoChartProps {
  recommendation: CryptoRecommendation
  className?: string
}

const CryptoChart: React.FC<CryptoChartProps> = ({ recommendation, className = '' }) => {
  const { crypto, technical_analysis, forecast } = recommendation
  
  const formatCurrency = (value: number) => {
    if (value >= 100) return `$${value.toFixed(0)}`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Generate mock historical data based on current price and changes
  const generateHistoricalData = () => {
    const currentPrice = crypto.quote.USD.price
    const data = []
    
    // Generate 30 days of historical data
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Calculate price based on 24h and 7d changes
      let price = currentPrice
      if (i === 0) {
        price = currentPrice
      } else if (i === 1) {
        price = currentPrice / (1 + crypto.quote.USD.percent_change_24h / 100)
      } else if (i === 7) {
        price = currentPrice / (1 + crypto.quote.USD.percent_change_7d / 100)
      } else {
        // Interpolate between known points
        const daysFrom7d = Math.abs(i - 7)
        const daysFrom24h = Math.abs(i - 1)
        const totalDays = 6
        
        if (i > 7) {
          // Before 7 days ago
          const weeklyChange = crypto.quote.USD.percent_change_7d / 100
          const dailyChange = weeklyChange / 7
          price = currentPrice / (1 + weeklyChange) * (1 + dailyChange * (7 - i))
        } else if (i > 1) {
          // Between 24h and 7 days ago
          const weeklyChange = crypto.quote.USD.percent_change_7d / 100
          const dailyChange = weeklyChange / 7
          price = currentPrice / (1 + weeklyChange) * (1 + dailyChange * (7 - i))
        } else {
          // Between now and 24h ago
          const dailyChange = crypto.quote.USD.percent_change_24h / 100
          price = currentPrice / (1 + dailyChange * i)
        }
      }
      
      // Add some realistic volatility
      const volatility = 0.02
      const randomChange = (Math.random() - 0.5) * volatility
      price = price * (1 + randomChange)
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(4)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        day: i
      })
    }
    
    return data
  }

  // Generate forecast data
  const generateForecastData = () => {
    const currentPrice = crypto.quote.USD.price
    const data = []
    
    // 1 week forecast (7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      let price = currentPrice
      if (i <= 7) {
        price = forecast.short_term
      }
      
      // Add some variation to the forecast
      const variation = 0.01
      const randomChange = (Math.random() - 0.5) * variation
      price = price * (1 + randomChange)
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(4)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        day: 30 + i,
        isForecast: true
      })
    }
    
    // 1 month forecast (additional 23 days)
    for (let i = 8; i <= 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      let price = currentPrice
      if (i <= 30) {
        price = forecast.medium_term
      }
      
      // Add some variation to the forecast
      const variation = 0.02
      const randomChange = (Math.random() - 0.5) * variation
      price = price * (1 + randomChange)
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(4)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        day: 30 + i,
        isForecast: true
      })
    }
    
    return data
  }

  const historicalData = generateHistoricalData()
  const forecastData = generateForecastData()
  
  // Create a bridge point at current date for smooth transition
  const currentDate = new Date()
  const bridgePoint = {
    date: currentDate.toISOString().split('T')[0],
    price: crypto.quote.USD.price,
    volume: crypto.quote.USD.volume_24h,
    day: 30,
    isBridge: true
  }
  
  // Combine historical, bridge, and forecast data
  const chartData = [
    ...historicalData,
    bridgePoint,
    ...forecastData
  ]

  const formatDate = (value: number) => {
    const dataPoint = chartData[value]
    if (!dataPoint) return ''
    
    const date = new Date(dataPoint.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTrendColor = () => {
    switch (technical_analysis.trend) {
      case 'Bullish': return '#10B981'
      case 'Bearish': return '#EF4444'
      default: return '#F59E0B'
    }
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">
          {crypto.symbol} AI-Powered Price Chart & Forecast
          {forecast.ml_prediction && (
            <span className="ml-2 px-2 py-1 bg-purple-600 text-xs rounded-full">ML Enhanced</span>
          )}
        </h4>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Historical Performance</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">AI Forecast</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Today</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            tickFormatter={formatDate}
            stroke="#9CA3AF"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={formatCurrency}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelFormatter={(value) => {
              const dataPoint = chartData[value]
              return dataPoint ? new Date(dataPoint.date).toLocaleDateString() : ''
            }}
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'historical' ? 'Historical Price' : 
              name === 'forecast' ? 'Forecast Price' : 'Price'
            ]}
          />
          
          {/* Historical Price Line */}
          <Line
            type="monotone"
            dataKey="price"
            data={historicalData}
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#3B82F6' }}
            name="Historical Price"
            connectNulls={false}
          />
          
          {/* Forecast Price Line */}
          <Line
            type="monotone"
            dataKey="price"
            data={[bridgePoint, ...forecastData]}
            stroke="#10B981"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#10B981' }}
            name="Forecast Price"
            connectNulls={false}
          />
          
          {/* Current Date Vertical Line */}
          <ReferenceLine
            x={30}
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{ value: "Today", position: "top", fill: "#F59E0B", fontSize: 12 }}
          />
          
          {/* Support Level */}
          <ReferenceLine
            y={technical_analysis.support_level}
            stroke="#EF4444"
            strokeDasharray="3 3"
            strokeWidth={1}
            label="Support"
          />
          
          {/* Resistance Level */}
          <ReferenceLine
            y={technical_analysis.resistance_level}
            stroke="#EF4444"
            strokeDasharray="3 3"
            strokeWidth={1}
            label="Resistance"
          />
          
          {/* Current Price Line */}
          <ReferenceLine
            y={crypto.quote.USD.price}
            stroke="#F59E0B"
            strokeWidth={2}
            label="Current Price"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Forecast Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-xs">1 Week Target</p>
          <p className={`text-sm font-semibold ${
            forecast.short_term > crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(forecast.short_term)}
          </p>
          <p className={`text-xs ${
            forecast.short_term > crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercentage(((forecast.short_term - crypto.quote.USD.price) / crypto.quote.USD.price) * 100)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">1 Month Target</p>
          <p className={`text-sm font-semibold ${
            forecast.medium_term > crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(forecast.medium_term)}
          </p>
          <p className={`text-xs ${
            forecast.medium_term > crypto.quote.USD.price ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercentage(((forecast.medium_term - crypto.quote.USD.price) / crypto.quote.USD.price) * 100)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Confidence</p>
          <p className="text-white font-semibold text-sm">{forecast.confidence.toFixed(0)}%</p>
          <p className="text-gray-400 text-xs">in forecast</p>
        </div>
      </div>
      
      {/* Technical Indicators & ML Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-xs">RSI</p>
          <p className={`text-sm font-semibold ${
            technical_analysis.rsi > 70 ? 'text-red-400' : 
            technical_analysis.rsi < 30 ? 'text-green-400' : 'text-white'
          }`}>
            {technical_analysis.rsi.toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Trend</p>
          <p className={`text-sm font-semibold ${getTrendColor()}`}>
            {technical_analysis.trend}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Volatility</p>
          <p className="text-white font-semibold text-sm">
            {technical_analysis.volatility.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Risk Level</p>
          <p className={`text-sm font-semibold ${
            recommendation.risk_score > 70 ? 'text-red-400' : 
            recommendation.risk_score > 50 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {recommendation.risk_score > 70 ? 'High' : 
             recommendation.risk_score > 50 ? 'Medium' : 'Low'}
          </p>
        </div>
      </div>
      
      {/* ML Model Performance */}
      {forecast.ml_prediction && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h5 className="text-sm font-semibold text-white mb-2">🤖 ML Model Performance</h5>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="text-center">
              <p className="text-gray-400">LSTM</p>
              <p className="text-blue-400 font-semibold">{forecast.ml_prediction.model_scores.lstm.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">ARIMA</p>
              <p className="text-green-400 font-semibold">{forecast.ml_prediction.model_scores.arima.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">RF</p>
              <p className="text-purple-400 font-semibold">{forecast.ml_prediction.model_scores.random_forest.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Linear</p>
              <p className="text-yellow-400 font-semibold">{forecast.ml_prediction.model_scores.linear_regression.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Sentiment</p>
              <p className="text-pink-400 font-semibold">{forecast.ml_prediction.model_scores.sentiment.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Trend Str.</p>
              <p className="text-white font-semibold">{forecast.ml_prediction.trend_strength.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CryptoChart
