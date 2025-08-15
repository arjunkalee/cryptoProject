# Crypto Tracker App

A beautiful, modern cryptocurrency tracking application built with React, TypeScript, and Tailwind CSS. This app displays real-time cryptocurrency data including prices, market caps, volume, and performance metrics using the CoinMarketCap API.

## ✨ Features

- **Real-time Data**: Live cryptocurrency prices and market data
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Search & Filter**: Find cryptocurrencies by name or symbol
- **Sorting Options**: Sort by market cap, price, or 24h change
- **Market Overview**: Total market cap, volume, and top gainers/losers
- **Performance Metrics**: 1h, 24h, and 7-day price changes
- **Auto-refresh**: Data updates every 5 minutes automatically

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cryptoProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and building
- **HTTP Client**: Axios for API requests
- **Icons**: Lucide React for beautiful icons
- **State Management**: React hooks for local state
- **API**: CoinMarketCap Sandbox API

## 📱 API Configuration

The app uses the CoinMarketCap Sandbox API. The API key is already configured in the code:

```typescript
const API_KEY = '1992a633-aae8-4ad8-b67c-13a81696ccdb'
```

**Note**: This is a sandbox API key for development purposes. For production use, you should:
1. Get your own API key from [CoinMarketCap](https://coinmarketcap.com/api/)
2. Store it in environment variables
3. Update the API endpoint to the production URL

## 🎨 Design System

The app features a custom design system with:
- **Color Palette**: Custom crypto-themed colors
- **Glassmorphism**: Modern glass-like card effects
- **Gradients**: Beautiful gradient backgrounds and text
- **Animations**: Smooth hover effects and transitions
- **Typography**: Clean, readable font hierarchy

## 📊 Data Display

Each cryptocurrency card shows:
- Current price in USD
- 24-hour price change percentage
- Market capitalization
- 24-hour trading volume
- Circulating and total supply
- 1-hour and 7-day price changes
- Market rank

## 🔧 Customization

### Adding New Cryptocurrencies
The app automatically fetches the top 100 cryptocurrencies by market cap. To change this limit, modify the `limit` parameter in `src/services/cryptoApi.ts`.

### Styling Changes
Customize the design by modifying:
- `tailwind.config.js` for color schemes and animations
- `src/index.css` for global styles and custom CSS classes
- Individual component files for component-specific styling

### API Endpoints
The app currently uses these CoinMarketCap endpoints:
- `/cryptocurrency/listings/latest` - Get latest listings
- `/cryptocurrency/quotes/latest` - Get detailed quotes

## 📱 Responsive Breakpoints

- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 3-4 column layout
- **Large Desktop**: 4 column layout

## 🚀 Performance Features

- **Lazy Loading**: Components load only when needed
- **Debounced Search**: Search input is optimized for performance
- **Efficient Re-renders**: React.memo and useCallback for optimization
- **Auto-refresh**: Smart data refresh every 5 minutes

## 🐛 Troubleshooting

### Common Issues

1. **API Rate Limits**: The sandbox API has rate limits. If you hit them, wait a few minutes and try again.

2. **CORS Issues**: The app is configured to work with the CoinMarketCap API. If you encounter CORS issues, check your API configuration.

3. **Build Errors**: Make sure you have the correct Node.js version and all dependencies are installed.

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your internet connection
3. Ensure the CoinMarketCap API is accessible
4. Check that all dependencies are properly installed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Happy Crypto Tracking! 🚀📈**
