import { useState, useEffect } from 'react'
import { User, Eye, Palette, Shield, Bell, X, Save, Globe, Lock, Smartphone, Mail, Check } from 'lucide-react'
import { useTheme, Theme } from '../contexts/ThemeContext'

interface SettingsState {
  // User Information
  username: string
  email: string
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reduceMotion: boolean
  screenReader: boolean
  
  // Theme
  theme: 'light' | 'dark' | 'auto'
  accentColor: 'blue' | 'green' | 'purple' | 'orange'
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  priceAlerts: boolean
  newsUpdates: boolean
  
  // Privacy
  dataSharing: boolean
  analytics: boolean
  marketing: boolean
}

interface SettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: { id: string; email: string; username: string; createdAt: Date; lastLoginAt: Date }
}

export default function SettingsSidebar({ isOpen, onClose, user }: SettingsSidebarProps) {
  const { theme, setTheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'theme' | 'notifications' | 'privacy'>('theme')
  const [settings, setSettings] = useState<SettingsState>({
    username: user.username,
    email: user.email,
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    theme: theme,
    accentColor: 'blue',
    emailNotifications: true,
    pushNotifications: false,
    priceAlerts: true,
    newsUpdates: false,
    dataSharing: false,
    analytics: true,
    marketing: false
  })
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load saved settings:', error)
      }
    }
  }, [])

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply theme changes immediately and save
    if (key === 'theme') {
      setTheme(value as Theme)
    }
    
    // Save settings immediately
    const newSettings = { ...settings, [key]: value }
    localStorage.setItem('userSettings', JSON.stringify(newSettings))
  }

  const saveSettings = () => {
    // Save to localStorage immediately
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Account info' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, description: 'Customize experience' },
    { id: 'theme', label: 'Appearance', icon: Palette, description: 'Theme & colors' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Control alerts' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Data & security' }
  ] as const

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 ${isDark ? 'bg-crypto-dark' : 'bg-crypto-light-surface'} shadow-2xl z-50 transform transition-transform duration-300 ease-in-out`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-crypto-accent/20' : 'border-crypto-light-border'}`}>
                     <div className="flex items-center justify-between">
             <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
               Settings
             </h2>
             <button
               onClick={onClose}
               className={`p-2 rounded-lg transition-colors ${
                 isDark 
                   ? 'hover:bg-crypto-accent/20 text-gray-300 hover:text-white' 
                   : 'hover:bg-gray-100 text-crypto-light-text-secondary hover:text-crypto-light-text'
               }`}
             >
               <X className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-crypto-accent/20">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-crypto-primary text-white shadow-lg'
                      : isDark 
                        ? 'text-gray-300 hover:bg-crypto-accent/20 hover:text-white' 
                        : 'text-crypto-light-text-secondary hover:bg-gray-100 hover:text-crypto-light-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Theme Tab - Most Important */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                  Appearance & Theme
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                  Personalize your interface
                </p>
              </div>
              
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-crypto-dark/50 border-crypto-accent/20' : 'bg-gray-50 border-crypto-light-border'}`}>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-crypto-light-text'}`}>
                  Theme Mode
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value as SettingsState['theme'])}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-crypto-dark border border-crypto-accent/20 text-white' 
                      : 'bg-white border border-crypto-light-border text-crypto-light-text'
                  }`}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-crypto-dark/50 border-crypto-accent/20' : 'bg-gray-50 border-crypto-light-border'}`}>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-crypto-light-text'}`}>
                  Accent Color
                </label>
                <div className="flex gap-3 justify-center">
                  {(['blue', 'green', 'purple', 'orange'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSetting('accentColor', color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                        settings.accentColor === color
                          ? 'border-white shadow-lg shadow-white/20 scale-110'
                          : 'border-crypto-accent/30 hover:border-crypto-accent/50'
                      }`}
                      style={{
                        backgroundColor: color === 'blue' ? '#3B82F6' : 
                                       color === 'green' ? '#10B981' : 
                                       color === 'purple' ? '#8B5CF6' : '#F59E0B'
                      }}
                    />
                  ))}
                </div>
                <p className={`text-center text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                  Choose your preferred accent color
                </p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-crypto-primary/20">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-crypto-light-text'}`}>
                  Profile Information
                </h3>
              </div>
              
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-crypto-dark/50 border-crypto-accent/20' : 'bg-gray-50 border-crypto-light-border'}`}>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-crypto-light-text'}`}>
                  Username
                </label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => updateSetting('username', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-crypto-dark border border-crypto-accent/20 text-white' 
                      : 'bg-white border border-crypto-light-border text-crypto-light-text'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-crypto-dark/50 border-crypto-accent/20' : 'bg-gray-50 border-crypto-light-border'}`}>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-crypto-light-text'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-crypto-dark border border-crypto-accent/20 text-white' 
                      : 'bg-white border border-crypto-light-border text-crypto-light-text'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          )}

          {/* Other tabs can be added here */}
          {activeTab === 'accessibility' && (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className={`${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Accessibility settings coming soon...
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className={`${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Notification settings coming soon...
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className={`${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Privacy settings coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
