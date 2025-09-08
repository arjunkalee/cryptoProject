import { Portfolio, PortfolioAsset, PortfolioTransaction } from '../types/crypto'

const PORTFOLIO_STORAGE_KEY = 'crypto_portfolio'

export class PortfolioService {
  private static instance: PortfolioService
  private portfolio: Portfolio | null = null

  private constructor() {
    this.loadFromStorage()
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService()
    }
    return PortfolioService.instance
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
      if (stored) {
        this.portfolio = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load portfolio from storage:', error)
      this.portfolio = null
    }
  }

  private saveToStorage(): void {
    try {
      if (this.portfolio) {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(this.portfolio))
      }
    } catch (error) {
      console.error('Failed to save portfolio to storage:', error)
    }
  }

  public getPortfolio(userId: string): Portfolio | null {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return null
    }
    return this.portfolio
  }

  public createPortfolio(userId: string, name: string = 'My Portfolio'): Portfolio {
    const portfolio: Portfolio = {
      id: Date.now().toString(),
      userId,
      name,
      assets: [],
      transactions: [],
      summary: {
        totalValue: 0,
        totalCost: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        dayChange: 0,
        dayChangePercentage: 0,
        assetCount: 0,
        topPerformers: [],
        worstPerformers: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.portfolio = portfolio
    this.saveToStorage()
    return portfolio
  }

  public addAsset(
    userId: string,
    cryptoId: number,
    symbol: string,
    name: string,
    amount: number,
    price: number,
    currentPrice: number,
    notes?: string
  ): PortfolioAsset | null {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return null
    }

    const asset: PortfolioAsset = {
      id: Date.now().toString(),
      cryptoId,
      symbol,
      name,
      amount,
      averagePrice: price,
      currentPrice,
      totalValue: amount * currentPrice,
      totalCost: amount * price,
      profitLoss: (amount * currentPrice) - (amount * price),
      profitLossPercentage: ((currentPrice - price) / price) * 100,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    const transaction: PortfolioTransaction = {
      id: Date.now().toString(),
      assetId: asset.id,
      type: 'buy',
      amount,
      price,
      totalValue: amount * price,
      fees: 0,
      date: new Date().toISOString(),
      notes
    }

    // Check if asset already exists
    const existingAssetIndex = this.portfolio.assets.findIndex(a => a.cryptoId === cryptoId)
    
    if (existingAssetIndex >= 0) {
      // Update existing asset
      const existingAsset = this.portfolio.assets[existingAssetIndex]
      const totalAmount = existingAsset.amount + amount
      const totalCost = existingAsset.totalCost + (amount * price)
      const newAveragePrice = totalCost / totalAmount

      this.portfolio.assets[existingAssetIndex] = {
        ...existingAsset,
        amount: totalAmount,
        averagePrice: newAveragePrice,
        currentPrice,
        totalValue: totalAmount * currentPrice,
        totalCost,
        profitLoss: (totalAmount * currentPrice) - totalCost,
        profitLossPercentage: ((currentPrice - newAveragePrice) / newAveragePrice) * 100,
        lastUpdated: new Date().toISOString()
      }
    } else {
      // Add new asset
      this.portfolio.assets.push(asset)
    }

    // Add transaction
    this.portfolio.transactions.push(transaction)

    // Update summary
    this.updateSummary()

    this.saveToStorage()
    return asset
  }

  public removeAsset(userId: string, assetId: string): boolean {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return false
    }

    const assetIndex = this.portfolio.assets.findIndex(a => a.id === assetId)
    if (assetIndex === -1) {
      return false
    }

    this.portfolio.assets.splice(assetIndex, 1)
    this.updateSummary()
    this.saveToStorage()
    return true
  }

  public updateAssetPrices(userId: string, priceUpdates: { [cryptoId: number]: number }): void {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return
    }

    let hasChanges = false

    this.portfolio.assets.forEach(asset => {
      const newPrice = priceUpdates[asset.cryptoId]
      if (newPrice && newPrice !== asset.currentPrice) {
        asset.currentPrice = newPrice
        asset.totalValue = asset.amount * newPrice
        asset.profitLoss = asset.totalValue - asset.totalCost
        asset.profitLossPercentage = ((newPrice - asset.averagePrice) / asset.averagePrice) * 100
        asset.lastUpdated = new Date().toISOString()
        hasChanges = true
      }
    })

    if (hasChanges) {
      this.updateSummary()
      this.saveToStorage()
    }
  }

  private updateSummary(): void {
    if (!this.portfolio) return

    const { assets } = this.portfolio
    const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0)
    const totalCost = assets.reduce((sum, asset) => sum + asset.totalCost, 0)
    const totalProfitLoss = totalValue - totalCost
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

    // Calculate day change (simplified - in real app, you'd track previous day's value)
    const dayChange = totalValue * 0.01 // Mock 1% change
    const dayChangePercentage = 1.0

    // Get top and worst performers
    const sortedAssets = [...assets].sort((a, b) => b.profitLossPercentage - a.profitLossPercentage)
    const topPerformers = sortedAssets.slice(0, 3)
    const worstPerformers = sortedAssets.slice(-3).reverse()

    this.portfolio.summary = {
      totalValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercentage,
      dayChange,
      dayChangePercentage,
      assetCount: assets.length,
      topPerformers,
      worstPerformers
    }

    this.portfolio.updatedAt = new Date().toISOString()
  }

  public getTransactions(userId: string): PortfolioTransaction[] {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return []
    }
    return [...this.portfolio.transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  public clearPortfolio(userId: string): boolean {
    if (!this.portfolio || this.portfolio.userId !== userId) {
      return false
    }

    this.portfolio.assets = []
    this.portfolio.transactions = []
    this.updateSummary()
    this.saveToStorage()
    return true
  }
}

export const portfolioService = PortfolioService.getInstance()
