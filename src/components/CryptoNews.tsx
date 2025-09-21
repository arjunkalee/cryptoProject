import React, { useState, useEffect } from 'react'
import { Search, Filter, Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Calendar, Newspaper } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { NewsArticle, NewsFilters, fetchCryptoNews, getNewsCategories, getNewsSources, getSentimentOptions } from '../services/newsApi'

interface CryptoNewsProps {
  className?: string
}

const CryptoNews: React.FC<CryptoNewsProps> = ({ className = '' }) => {
  const { isDark } = useTheme()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<NewsFilters>({
    category: 'all',
    source: 'all',
    sentiment: 'all',
    timeRange: '24h',
    searchQuery: ''
  })

  const categories = getNewsCategories()
  const sources = getNewsSources()
  const sentimentOptions = getSentimentOptions()

  const loadNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const newsData = await fetchCryptoNews(filters)
      setArticles(newsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [filters])

  const updateFilter = <K extends keyof NewsFilters>(key: K, value: NewsFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      source: 'all',
      sentiment: 'all',
      timeRange: '24h',
      searchQuery: ''
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const articleDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return articleDate.toLocaleDateString()
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      bitcoin: 'bg-orange-100 text-orange-800 border-orange-200',
      ethereum: 'bg-blue-100 text-blue-800 border-blue-200',
      defi: 'bg-purple-100 text-purple-800 border-purple-200',
      nft: 'bg-pink-100 text-pink-800 border-pink-200',
      regulation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      technology: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Crypto News & Insights</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
            Stay updated with the latest cryptocurrency news and market insights
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-crypto-primary text-white'
              : isDark
              ? 'bg-white/10 text-gray-300 hover:bg-white/20'
              : 'bg-gray-100 text-crypto-light-text hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search news articles..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? 'bg-crypto-dark border-crypto-accent/20 text-white placeholder-gray-400 focus:border-crypto-primary'
                : 'bg-white border-crypto-light-border text-crypto-light-text placeholder-gray-400 focus:border-crypto-primary'
            } focus:outline-none focus:ring-2 focus:ring-crypto-primary/20`}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-crypto-dark border-crypto-accent/20 text-white focus:border-crypto-primary'
                : 'bg-white border-crypto-light-border text-crypto-light-text focus:border-crypto-primary'
            } focus:outline-none focus:ring-2 focus:ring-crypto-primary/20`}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={filters.source}
            onChange={(e) => updateFilter('source', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-crypto-dark border-crypto-accent/20 text-white focus:border-crypto-primary'
                : 'bg-white border-crypto-light-border text-crypto-light-text focus:border-crypto-primary'
            } focus:outline-none focus:ring-2 focus:ring-crypto-primary/20`}
          >
            {sources.map(source => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>

          {/* Sentiment Filter */}
          <select
            value={filters.sentiment}
            onChange={(e) => updateFilter('sentiment', e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-crypto-dark border-crypto-accent/20 text-white focus:border-crypto-primary'
                : 'bg-white border-crypto-light-border text-crypto-light-text focus:border-crypto-primary'
            } focus:outline-none focus:ring-2 focus:ring-crypto-primary/20`}
          >
            {sentimentOptions.map(sentiment => (
              <option key={sentiment.value} value={sentiment.value}>
                {sentiment.label}
              </option>
            ))}
          </select>

          {/* Time Range Filter */}
          <select
            value={filters.timeRange}
            onChange={(e) => updateFilter('timeRange', e.target.value as NewsFilters['timeRange'])}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-crypto-dark border-crypto-accent/20 text-white focus:border-crypto-primary'
                : 'bg-white border-crypto-light-border text-crypto-light-text focus:border-crypto-primary'
            } focus:outline-none focus:ring-2 focus:ring-crypto-primary/20`}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-crypto-primary hover:text-crypto-secondary transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`p-6 rounded-xl border ${
          isDark ? 'bg-red-900/20 border-red-500/20' : 'bg-red-50 border-red-200'
        }`}>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadNews}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* News Articles */}
      {!loading && !error && (
        <div className="grid gap-6">
          {articles.length === 0 ? (
            <div className={`p-12 text-center rounded-xl ${
              isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'
            }`}>
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <article
                key={article.id}
                className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                  isDark ? 'glass-card hover:bg-white/5' : 'bg-white shadow-lg border border-crypto-light-border hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Article Image */}
                  <div className="lg:w-80 lg:flex-shrink-0">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 lg:h-40 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop`
                      }}
                    />
                  </div>

                  {/* Article Content */}
                  <div className="flex-1">
                    {/* Article Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                          {article.category.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
                          {getSentimentIcon(article.sentiment)}
                          {article.sentiment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(article.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-crypto-primary transition-colors">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {article.title}
                      </a>
                    </h3>

                    {/* Article Description */}
                    <p className={`mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
                      {article.description}
                    </p>

                    {/* Article Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                          {article.source.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {Math.round(article.relevanceScore * 100)}% relevant
                        </span>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-crypto-primary hover:text-crypto-secondary transition-colors text-sm font-medium"
                      >
                        Read full article
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !error && articles.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadNews}
            className="px-6 py-3 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  )
}

export default CryptoNews
