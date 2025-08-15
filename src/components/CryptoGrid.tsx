import React from 'react'
import CryptoCard from './CryptoCard'
import { CryptoData } from '../types/crypto'

interface CryptoGridProps {
  cryptoData: CryptoData[]
}

const CryptoGrid: React.FC<CryptoGridProps> = ({ cryptoData }) => {
  if (cryptoData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No cryptocurrencies found</div>
        <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cryptoData.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} />
      ))}
    </div>
  )
}

export default CryptoGrid
