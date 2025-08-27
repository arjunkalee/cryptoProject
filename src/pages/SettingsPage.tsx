import React, { useState, useEffect } from 'react'
import { User, Eye, Palette, Shield, Bell, ArrowLeft, Save, Globe, Lock, Smartphone, Mail, Check } from 'lucide-react'
import { User as UserType } from '../types/auth'

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

interface SettingsPageProps {
  user: UserType
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'theme' | 'notifications' | 'privacy'>('profile')
  const [settings, setSettings] = useState<SettingsState>({
    username: user.username,
    email: user.email,
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    theme: 'dark',
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
    setSaved(false)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'crypto-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Simulate account deletion
      alert('Account deletion requested. This would typically require additional verification.')
    }
  }

  const goBack = () => {
    window.history.back()
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your account information' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, description: 'Customize your experience' },
    { id: 'theme', label: 'Appearance', icon: Palette, description: 'Personalize your interface' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Control your alerts' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Manage your data & security' }
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-crypto-primary/10 via-crypto-accent/5 to-crypto-primary/10 border-b border-crypto-accent/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="p-2 hover:bg-crypto-accent/20 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-400 text-sm mt-1">Customize your crypto experience</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-crypto-primary to-crypto-accent hover:from-crypto-primary/90 hover:to-crypto-accent/90 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-crypto-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-crypto-dark/30 border border-crypto-accent/20 rounded-2xl p-6 h-fit sticky top-8">
            <nav className="space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-crypto-primary/20 to-crypto-accent/20 border border-crypto-primary/30 shadow-lg shadow-crypto-primary/10'
                        : 'hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-crypto-primary/20 text-crypto-primary' 
                          : 'bg-crypto-accent/10 text-gray-400 group-hover:text-white'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {tab.label}
                      </span>
                    </div>
                    <p className={`text-xs transition-colors ${
                      isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {tab.description}
                    </p>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-crypto-primary/20">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                  <p className="text-gray-400">Update your account details and preferences</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Username</label>
                    <input
                      type="text"
                      value={settings.username}
                      onChange={(e) => updateSetting('username', e.target.value)}
                      className="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      className="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                    <Eye className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Accessibility Settings</h2>
                  <p className="text-gray-400">Customize your experience for better accessibility</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Font Size</label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', e.target.value as SettingsState['fontSize'])}
                      className="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Visual Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.highContrast}
                          onChange={(e) => updateSetting('highContrast', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">High Contrast Mode</span>
                          <p className="text-sm text-gray-400">Enhanced contrast for better visibility</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.reduceMotion}
                          onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Reduce Motion</span>
                          <p className="text-sm text-gray-400">Minimize animations and transitions</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.screenReader}
                          onChange={(e) => updateSetting('screenReader', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Screen Reader Optimized</span>
                          <p className="text-sm text-gray-400">Enhanced compatibility with assistive technologies</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                    <Palette className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Appearance & Theme</h2>
                  <p className="text-gray-400">Personalize your interface with custom themes and colors</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Theme Mode</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSetting('theme', e.target.value as SettingsState['theme'])}
                      className="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Accent Color</label>
                    <div className="flex gap-4 justify-center">
                      {(['blue', 'green', 'purple', 'orange'] as const).map((color) => (
                        <button
                          key={color}
                          onClick={() => updateSetting('accentColor', color)}
                          className={`w-16 h-16 rounded-2xl border-3 transition-all duration-200 hover:scale-110 ${
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
                    <p className="text-center text-sm text-gray-400 mt-3">
                      Choose your preferred accent color for the interface
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                    <Bell className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
                  <p className="text-gray-400">Control how and when you receive notifications</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-crypto-primary" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">General Email Updates</span>
                          <p className="text-sm text-gray-400">Receive important account notifications via email</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.priceAlerts}
                          onChange={(e) => updateSetting('priceAlerts', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Price Alerts</span>
                          <p className="text-sm text-gray-400">Get notified when your watched assets reach target prices</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-crypto-primary" />
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Push Notifications</span>
                          <p className="text-sm text-gray-400">Receive real-time alerts on your device</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.newsUpdates}
                          onChange={(e) => updateSetting('newsUpdates', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Market News & Updates</span>
                          <p className="text-sm text-gray-400">Stay informed with the latest crypto market developments</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Privacy & Security</h2>
                  <p className="text-gray-400">Control your data and privacy settings</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-crypto-primary" />
                      Data & Analytics
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics}
                          onChange={(e) => updateSetting('analytics', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Analytics & Performance</span>
                          <p className="text-sm text-gray-400">Help us improve by sharing anonymous usage data</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.dataSharing}
                          onChange={(e) => updateSetting('dataSharing', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Share Anonymous Data</span>
                          <p className="text-sm text-gray-400">Contribute to research while maintaining privacy</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.marketing}
                          onChange={(e) => updateSetting('marketing', e.target.checked)}
                          className="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary"
                        />
                        <div>
                          <span className="text-gray-200 font-medium">Marketing Communications</span>
                          <p className="text-sm text-gray-400">Receive updates about new features and promotions</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-crypto-primary" />
                      Account Actions
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={exportData}
                        className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Export My Data
                      </button>
                      <button 
                        onClick={deleteAccount}
                        className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
