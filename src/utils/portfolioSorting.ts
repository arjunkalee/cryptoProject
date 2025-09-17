import { PortfolioAsset, SortField, SortDirection } from '../components/PortfolioSortControls'

export const sortPortfolioAssets = (
  assets: PortfolioAsset[],
  field: SortField,
  direction: SortDirection
): PortfolioAsset[] => {
  const sortedAssets = [...assets].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'symbol':
        aValue = a.symbol.toLowerCase()
        bValue = b.symbol.toLowerCase()
        break
      case 'amount':
        aValue = a.amount
        bValue = b.amount
        break
      case 'averagePrice':
        aValue = a.averagePrice
        bValue = b.averagePrice
        break
      case 'currentPrice':
        aValue = a.currentPrice
        bValue = b.currentPrice
        break
      case 'totalValue':
        aValue = a.totalValue
        bValue = b.totalValue
        break
      case 'profitLoss':
        aValue = a.profitLoss
        bValue = b.profitLoss
        break
      case 'profitLossPercentage':
        aValue = a.profitLossPercentage
        bValue = b.profitLossPercentage
        break
      case 'dateAdded':
        aValue = new Date(a.dateAdded).getTime()
        bValue = new Date(b.dateAdded).getTime()
        break
      default:
        return 0
    }

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (direction === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    }

    // Handle numeric comparison
    if (direction === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  return sortedAssets
}

// Preset sorting configurations
export const PRESET_SORTS = {
  HIGHEST_VALUE: { field: 'totalValue' as SortField, direction: 'desc' as SortDirection },
  LOWEST_VALUE: { field: 'totalValue' as SortField, direction: 'asc' as SortDirection },
  BEST_PERFORMANCE: { field: 'profitLossPercentage' as SortField, direction: 'desc' as SortDirection },
  WORST_PERFORMANCE: { field: 'profitLossPercentage' as SortField, direction: 'asc' as SortDirection },
  BIGGEST_PROFIT: { field: 'profitLoss' as SortField, direction: 'desc' as SortDirection },
  BIGGEST_LOSS: { field: 'profitLoss' as SortField, direction: 'asc' as SortDirection },
  MOST_RECENT: { field: 'dateAdded' as SortField, direction: 'desc' as SortDirection },
  OLDEST: { field: 'dateAdded' as SortField, direction: 'asc' as SortDirection },
  ALPHABETICAL: { field: 'name' as SortField, direction: 'asc' as SortDirection },
  SYMBOL_ASC: { field: 'symbol' as SortField, direction: 'asc' as SortDirection },
  HIGHEST_PRICE: { field: 'currentPrice' as SortField, direction: 'desc' as SortDirection },
  LOWEST_PRICE: { field: 'currentPrice' as SortField, direction: 'asc' as SortDirection }
} as const

// Helper function to get sort description
export const getSortDescription = (field: SortField, direction: SortDirection): string => {
  const fieldLabels: Record<SortField, string> = {
    name: 'Name',
    symbol: 'Symbol',
    amount: 'Amount',
    averagePrice: 'Average Price',
    currentPrice: 'Current Price',
    totalValue: 'Total Value',
    profitLoss: 'Profit/Loss',
    profitLossPercentage: 'Profit/Loss %',
    dateAdded: 'Date Added'
  }

  const directionLabel = direction === 'asc' ? 'Ascending' : 'Descending'
  return `${fieldLabels[field]} (${directionLabel})`
}
