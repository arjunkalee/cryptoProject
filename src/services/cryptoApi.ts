import axios from 'axios'
import { CryptoData } from '../types/crypto'

// Try CoinMarketCap first, fallback to CoinGecko if it fails
const CMC_API_URL = 'https://sandbox-api.coinmarketcap.com/v1'
const CMC_API_KEY = '1992a633-aae8-4ad8-b67c-13a81696ccdb'
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

const cmcClient = axios.create({
  baseURL: CMC_API_URL,
  headers: {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
  },
  timeout: 10000,
})

const coingeckoClient = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 15000,
})

// Transform CoinGecko data to match our CryptoData interface
const transformCoinGeckoData = (data: any[]): CryptoData[] => {
  return data.map((coin, index) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    slug: coin.id,
    cmc_rank: index + 1,
    num_market_pairs: 0,
    circulating_supply: coin.circulating_supply || 0,
    total_supply: coin.total_supply || 0,
    max_supply: coin.max_supply,
    infinite_supply: false,
    last_updated: new Date().toISOString(),
    date_added: new Date().toISOString(),
    tags: coin.categories || [],
    platform: null,
    self_reported_circulating_supply: null,
    self_reported_market_cap: null,
    quote: {
      USD: {
        price: coin.current_price,
        volume_24h: coin.total_volume,
        percent_change_1h: coin.price_change_percentage_1h_in_currency || 0,
        percent_change_24h: coin.price_change_percentage_24h || 0,
        percent_change_7d: coin.price_change_percentage_7d_in_currency || 0,
        market_cap: coin.market_cap,
        market_cap_dominance: 0,
        fully_diluted_market_cap: coin.fully_diluted_valuation || 0,
        last_updated: new Date().toISOString(),
      }
    }
  }))
}

export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  // Try CoinMarketCap first
  try {
    console.log('Attempting to fetch from CoinMarketCap...')
    const response = await cmcClient.get('/cryptocurrency/listings/latest', {
      params: {
        start: '1',
        limit: '100',
        convert: 'USD',
      },
    })

    if (response.data.status.error_code !== 0) {
      throw new Error(response.data.status.error_message || 'API Error')
    }

    console.log('Successfully fetched from CoinMarketCap')
    return response.data.data
  } catch (error) {
    console.log('CoinMarketCap failed, trying CoinGecko...', error)
    
    // Fallback to CoinGecko
    try {
      const response = await coingeckoClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '1h,24h,7d'
        },
      })

      console.log('Successfully fetched from CoinGecko')
      return transformCoinGeckoData(response.data)
    } catch (coingeckoError) {
      console.error('Both APIs failed:', coingeckoError)
      throw new Error('Failed to fetch crypto data from both CoinMarketCap and CoinGecko. Please check your internet connection and try again.')
    }
  }
}

export const fetchCryptoDetails = async (id: number): Promise<CryptoData> => {
  try {
    const response = await cmcClient.get(`/cryptocurrency/quotes/latest`, {
      params: {
        id: id.toString(),
        convert: 'USD',
      },
    })

    if (response.data.status.error_code !== 0) {
      throw new Error(response.data.status.error_message || 'API Error')
    }

    return response.data.data[id]
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch crypto details: ${error.message}`)
    }
    throw new Error('Failed to fetch crypto details')
  }
}
