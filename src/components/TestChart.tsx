import React from 'react'
import { CryptoData } from '../types/crypto'

interface TestChartProps {
  crypto: CryptoData
}

const TestChart: React.FC<TestChartProps> = ({ crypto }) => {
  console.log('TestChart rendering with crypto:', crypto)
  
  if (!crypto) {
    return <div className="p-4 bg-red-100 text-red-800">No crypto data provided</div>
  }
  
  if (!crypto.quote || !crypto.quote.USD) {
    return <div className="p-4 bg-red-100 text-red-800">Invalid crypto data structure</div>
  }
  
  return (
    <div className="p-4 bg-green-100 text-green-800 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Chart Test - {crypto.symbol}</h3>
      <p>Price: ${crypto.quote.USD.price}</p>
      <p>24h Change: {crypto.quote.USD.percent_change_24h}%</p>
      <p>Market Cap: ${crypto.quote.USD.market_cap}</p>
      <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded">
        <p>✅ Chart component is rendering successfully!</p>
        <p>Data is valid and accessible.</p>
      </div>
    </div>
  )
}

export default TestChart
