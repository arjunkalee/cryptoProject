import axios from 'axios'

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
  category: 'general' | 'bitcoin' | 'ethereum' | 'defi' | 'nft' | 'regulation' | 'technology'
  sentiment: 'positive' | 'negative' | 'neutral'
  relevanceScore: number
}

export interface NewsFilters {
  category: string
  source: string
  sentiment: string
  timeRange: '1h' | '24h' | '7d' | '30d'
  searchQuery: string
}

const NEWS_API_URL = 'https://newsapi.org/v2'
const NEWS_API_KEY = 'demo-key' // In production, use a real API key

// Mock news data for development
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
    description: 'Bitcoin has surged to new record levels as major corporations continue to add the cryptocurrency to their balance sheets.',
    content: 'Bitcoin reached a new all-time high of $73,000 today, driven by increased institutional adoption and growing mainstream acceptance. Major corporations including Tesla, MicroStrategy, and others have been accumulating Bitcoin as a hedge against inflation...',
    url: 'https://example.com/bitcoin-ath',
    urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: { id: 'crypto-news', name: 'CryptoNews' },
    category: 'bitcoin',
    sentiment: 'positive',
    relevanceScore: 0.95
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Staking Reaches 32 Million ETH Milestone',
    description: 'The Ethereum network continues to see strong staking participation as validators lock up more ETH for network security.',
    content: 'Ethereum 2.0 staking has reached a significant milestone with over 32 million ETH now staked on the network. This represents approximately 26% of the total ETH supply...',
    url: 'https://example.com/ethereum-staking',
    urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: { id: 'ethereum-foundation', name: 'Ethereum Foundation' },
    category: 'ethereum',
    sentiment: 'positive',
    relevanceScore: 0.88
  },
  {
    id: '3',
    title: 'New SEC Guidelines on Cryptocurrency Regulations Expected Soon',
    description: 'The Securities and Exchange Commission is preparing to release new guidelines for cryptocurrency trading and custody services.',
    content: 'The SEC is expected to announce new regulatory guidelines for cryptocurrency trading platforms and custody services within the next month. These guidelines are expected to provide clearer frameworks for compliance...',
    url: 'https://example.com/sec-crypto-regulations',
    urlToImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: { id: 'financial-times', name: 'Financial Times' },
    category: 'regulation',
    sentiment: 'neutral',
    relevanceScore: 0.82
  },
  {
    id: '4',
    title: 'DeFi Protocol Launches Revolutionary Yield Farming Strategy',
    description: 'A new DeFi protocol introduces an innovative yield farming mechanism that could reshape decentralized finance.',
    content: 'A groundbreaking DeFi protocol has launched with a novel yield farming strategy that combines multiple liquidity pools to maximize returns while minimizing risks...',
    url: 'https://example.com/defi-yield-farming',
    urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: { id: 'defi-pulse', name: 'DeFi Pulse' },
    category: 'defi',
    sentiment: 'positive',
    relevanceScore: 0.79
  },
  {
    id: '5',
    title: 'Major NFT Marketplace Reports Record Trading Volume',
    description: 'Leading NFT marketplace sees unprecedented trading activity as digital collectibles gain mainstream traction.',
    content: 'The largest NFT marketplace has reported record-breaking trading volume this month, with over $500 million in transactions. This surge is attributed to increased interest from institutional investors...',
    url: 'https://example.com/nft-trading-volume',
    urlToImage: 'https://images.unsplash.com/photo-1639322537228-f912d0e4d6b4?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: { id: 'nft-now', name: 'NFT Now' },
    category: 'nft',
    sentiment: 'positive',
    relevanceScore: 0.75
  },
  {
    id: '6',
    title: 'Blockchain Technology Adoption Accelerates in Healthcare Sector',
    description: 'Healthcare organizations are increasingly adopting blockchain solutions for secure patient data management.',
    content: 'The healthcare industry is witnessing rapid adoption of blockchain technology for secure patient data management and medical record keeping. Several major hospitals have implemented pilot programs...',
    url: 'https://example.com/blockchain-healthcare',
    urlToImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    source: { id: 'tech-crunch', name: 'TechCrunch' },
    category: 'technology',
    sentiment: 'positive',
    relevanceScore: 0.71
  },
  {
    id: '7',
    title: 'Market Volatility Continues as Crypto Assets Experience Correction',
    description: 'Cryptocurrency markets face continued volatility as investors react to global economic uncertainties.',
    content: 'The cryptocurrency market is experiencing heightened volatility as major digital assets face downward pressure amid global economic uncertainties and regulatory concerns...',
    url: 'https://example.com/crypto-volatility',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    source: { id: 'coindesk', name: 'CoinDesk' },
    category: 'general',
    sentiment: 'negative',
    relevanceScore: 0.85
  },
  {
    id: '8',
    title: 'Layer 2 Solutions Show Promising Growth in Transaction Volume',
    description: 'Layer 2 scaling solutions are demonstrating significant improvements in transaction throughput and cost reduction.',
    content: 'Layer 2 scaling solutions are showing remarkable growth in transaction volume, with protocols like Polygon, Arbitrum, and Optimism processing millions of transactions daily...',
    url: 'https://example.com/layer2-growth',
    urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    source: { id: 'layer2-research', name: 'Layer2 Research' },
    category: 'technology',
    sentiment: 'positive',
    relevanceScore: 0.77
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchCryptoNews = async (filters?: Partial<NewsFilters>): Promise<NewsArticle[]> => {
  try {
    // Simulate API call delay
    await delay(1000)
    
    let filteredNews = [...mockNewsData]
    
    // Apply filters
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filteredNews = filteredNews.filter(article => article.category === filters.category)
      }
      
      if (filters.source && filters.source !== 'all') {
        filteredNews = filteredNews.filter(article => article.source.name.toLowerCase().includes(filters.source.toLowerCase()))
      }
      
      if (filters.sentiment && filters.sentiment !== 'all') {
        filteredNews = filteredNews.filter(article => article.sentiment === filters.sentiment)
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredNews = filteredNews.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
        )
      }
      
      if (filters.timeRange) {
        const now = new Date()
        const timeRanges = {
          '1h': 60 * 60 * 1000,
          '24h': 24 * 60 * 60 * 1000,
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000
        }
        
        const cutoffTime = new Date(now.getTime() - timeRanges[filters.timeRange])
        filteredNews = filteredNews.filter(article => 
          new Date(article.publishedAt) >= cutoffTime
        )
      }
    }
    
    // Sort by relevance score and publication date
    filteredNews.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    
    return filteredNews
  } catch (error) {
    console.error('Failed to fetch crypto news:', error)
    throw new Error('Failed to fetch crypto news')
  }
}

export const getNewsCategories = () => [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nft', label: 'NFT' },
  { value: 'regulation', label: 'Regulation' },
  { value: 'technology', label: 'Technology' }
]

export const getNewsSources = () => [
  { value: 'all', label: 'All Sources' },
  { value: 'crypto-news', label: 'CryptoNews' },
  { value: 'ethereum-foundation', label: 'Ethereum Foundation' },
  { value: 'financial-times', label: 'Financial Times' },
  { value: 'defi-pulse', label: 'DeFi Pulse' },
  { value: 'nft-now', label: 'NFT Now' },
  { value: 'tech-crunch', label: 'TechCrunch' },
  { value: 'coindesk', label: 'CoinDesk' },
  { value: 'layer2-research', label: 'Layer2 Research' }
]

export const getSentimentOptions = () => [
  { value: 'all', label: 'All Sentiments' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' }
]
