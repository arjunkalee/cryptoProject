export interface CryptoQuote {
  USD: {
    price: number
    volume_24h: number
    percent_change_1h: number
    percent_change_24h: number
    percent_change_7d: number
    market_cap: number
    market_cap_dominance: number
    fully_diluted_market_cap: number
    last_updated: string
  }
}

export interface CryptoData {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  num_market_pairs: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  infinite_supply: boolean
  last_updated: string
  date_added: string
  tags: string[]
  platform: {
    id: number
    name: string
    symbol: string
    slug: string
    token_address: string
  } | null
  self_reported_circulating_supply: number | null
  self_reported_market_cap: number | null
  quote: CryptoQuote
}

export interface CryptoStats {
  totalMarketCap: number
  totalVolume24h: number
  totalDominance: number
  topGainers: CryptoData[]
  topLosers: CryptoData[]
}
