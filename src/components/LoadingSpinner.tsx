import React from 'react'
import { TrendingUp } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-800">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-full flex items-center justify-center animate-pulse-slow">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-crypto-primary/30 rounded-full animate-ping"></div>
        </div>
        
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Loading Crypto Data
        </h2>
        
        <p className="text-gray-400 text-lg mb-8">
          Fetching real-time cryptocurrency information...
        </p>
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-crypto-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-crypto-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
