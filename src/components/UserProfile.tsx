import React, { useState } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { User as UserType } from '../types/auth'

interface UserProfileProps {
  user: UserType
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    onLogout()
    setIsDropdownOpen(false)
  }

  const handleSettingsClick = () => {
    // Create a new window with the settings page
    const settingsWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    
    if (settingsWindow) {
      // Write the settings page HTML to the new window
      settingsWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Crypto Tracker - Settings</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'crypto-primary': '#3B82F6',
                    'crypto-accent': '#10B981',
                    'crypto-dark': '#1F2937',
                    'crypto-darker': '#111827'
                  }
                }
              }
            }
          </script>
          <style>
            .gradient-text {
              background: linear-gradient(135deg, #3B82F6, #10B981);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          </style>
        </head>
        <body class="bg-gradient-to-br from-crypto-darker via-crypto-dark to-slate-900 text-white">
          <div class="min-h-screen">
            <!-- Header -->
            <div class="bg-gradient-to-r from-crypto-primary/10 via-crypto-accent/5 to-crypto-primary/10 border-b border-crypto-accent/20">
              <div class="max-w-7xl mx-auto px-6 py-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <button
                      onclick="window.close()"
                      class="p-2 hover:bg-crypto-accent/20 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                    </button>
                    <div>
                      <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Settings
                      </h1>
                      <p class="text-gray-400 text-sm mt-1">Customize your crypto experience</p>
                    </div>
                  </div>
                  <button
                    onclick="saveSettings()"
                    class="px-6 py-2 bg-gradient-to-r from-crypto-primary to-crypto-accent hover:from-crypto-primary/90 hover:to-crypto-accent/90 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-crypto-primary/20 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save All
                  </button>
                </div>
              </div>
            </div>

            <div class="max-w-7xl mx-auto px-6 py-8">
              <div class="flex gap-8">
                <!-- Sidebar -->
                <div class="w-80 bg-crypto-dark/30 border border-crypto-accent/20 rounded-2xl p-6 h-fit sticky top-8">
                  <nav class="space-y-3">
                    <button onclick="showTab('profile')" class="w-full text-left p-4 rounded-2xl transition-all duration-200 group bg-gradient-to-r from-crypto-primary/20 to-crypto-accent/20 border border-crypto-primary/30 shadow-lg shadow-crypto-primary/10">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 rounded-xl transition-all duration-200 bg-crypto-primary/20 text-crypto-primary">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <span class="font-semibold text-white">Profile</span>
                      </div>
                      <p class="text-xs text-gray-300">Manage your account information</p>
                    </button>
                    
                    <button onclick="showTab('accessibility')" class="w-full text-left p-4 rounded-2xl transition-all duration-200 group hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 rounded-xl transition-all duration-200 bg-crypto-accent/10 text-gray-400 group-hover:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </div>
                        <span class="font-semibold text-gray-300 group-hover:text-white">Accessibility</span>
                      </div>
                      <p class="text-xs text-gray-500 group-hover:text-gray-400">Customize your experience</p>
                    </button>
                    
                    <button onclick="showTab('theme')" class="w-full text-left p-4 rounded-2xl transition-all duration-200 group hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 rounded-xl transition-all duration-200 bg-crypto-accent/10 text-gray-400 group-hover:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485-7.071-7.07a2 2 0 010-2.829z"></path>
                          </svg>
                        </div>
                        <span class="font-semibold text-gray-300 group-hover:text-white">Appearance</span>
                      </div>
                      <p class="text-xs text-gray-500 group-hover:text-gray-400">Personalize your interface</p>
                    </button>
                    
                    <button onclick="showTab('notifications')" class="w-full text-left p-4 rounded-2xl transition-all duration-200 group hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 rounded-xl transition-all duration-200 bg-crypto-accent/10 text-gray-400 group-hover:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span class="font-semibold text-gray-300 group-hover:text-white">Notifications</span>
                      </div>
                      <p class="text-xs text-gray-500 group-hover:text-gray-400">Control your alerts</p>
                    </button>
                    
                    <button onclick="showTab('privacy')" class="w-full text-left p-4 rounded-2xl transition-all duration-200 group hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 rounded-xl transition-all duration-200 bg-crypto-accent/10 text-gray-400 group-hover:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                        </div>
                        <span class="font-semibold text-gray-300 group-hover:text-white">Privacy</span>
                      </div>
                      <p class="text-xs text-gray-500 group-hover:text-gray-400">Manage your data & security</p>
                    </button>
                  </nav>
                </div>

                <!-- Content -->
                <div class="flex-1">
                  <div id="profile-tab" class="tab-content">
                    <div class="space-y-8">
                      <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-crypto-primary to-crypto-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-crypto-primary/20">
                          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Profile Information</h2>
                        <p class="text-gray-400">Update your account details and preferences</p>
                      </div>
                      
                      <div class="max-w-2xl mx-auto space-y-6">
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <label class="block text-sm font-semibold text-gray-300 mb-3">Username</label>
                          <input
                            type="text"
                            value="${user.username}"
                            class="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                            placeholder="Enter your username"
                          />
                        </div>
                        
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <label class="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                          <input
                            type="email"
                            value="${user.email}"
                            class="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="accessibility-tab" class="tab-content hidden">
                    <div class="space-y-8">
                      <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Accessibility Settings</h2>
                        <p class="text-gray-400">Customize your experience for better accessibility</p>
                      </div>
                      
                      <div class="max-w-2xl mx-auto space-y-6">
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <label class="block text-sm font-semibold text-gray-300 mb-3">Font Size</label>
                          <select class="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all">
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <h3 class="text-lg font-semibold text-white mb-4">Visual Preferences</h3>
                          <div class="space-y-4">
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">High Contrast Mode</span>
                                <p class="text-sm text-gray-400">Enhanced contrast for better visibility</p>
                              </div>
                            </label>
                            
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">Reduce Motion</span>
                                <p class="text-sm text-gray-400">Minimize animations and transitions</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="theme-tab" class="tab-content hidden">
                    <div class="space-y-8">
                      <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485-7.071-7.07a2 2 0 010-2.829z"></path>
                          </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Appearance & Theme</h2>
                        <p class="text-gray-400">Personalize your interface with custom themes and colors</p>
                      </div>
                      
                      <div class="max-w-2xl mx-auto space-y-6">
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <label class="block text-sm font-semibold text-gray-300 mb-3">Theme Mode</label>
                          <select class="w-full px-4 py-3 bg-crypto-dark border border-crypto-accent/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:border-transparent transition-all">
                            <option value="light">Light Mode</option>
                            <option value="dark" selected>Dark Mode</option>
                            <option value="auto">Auto (System)</option>
                          </select>
                        </div>
                        
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <label class="block text-sm font-semibold text-gray-300 mb-4">Accent Color</label>
                          <div class="flex gap-4 justify-center">
                            <button class="w-16 h-16 rounded-2xl border-3 border-white shadow-lg shadow-white/20 scale-110" style="background-color: #3B82F6;"></button>
                            <button class="w-16 h-16 rounded-2xl border-3 border-crypto-accent/30 hover:border-crypto-accent/50" style="background-color: #10B981;"></button>
                            <button class="w-16 h-16 rounded-2xl border-3 border-crypto-accent/30 hover:border-crypto-accent/50" style="background-color: #8B5CF6;"></button>
                            <button class="w-16 h-16 rounded-2xl border-3 border-crypto-accent/30 hover:border-crypto-accent/50" style="background-color: #F59E0B;"></button>
                          </div>
                          <p class="text-center text-sm text-gray-400 mt-3">
                            Choose your preferred accent color for the interface
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="notifications-tab" class="tab-content hidden">
                    <div class="space-y-8">
                      <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
                        <p class="text-gray-400">Control how and when you receive notifications</p>
                      </div>
                      
                      <div class="max-w-2xl mx-auto space-y-6">
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-crypto-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Email Notifications
                          </h3>
                          <div class="space-y-4">
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" checked class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">General Email Updates</span>
                                <p class="text-sm text-gray-400">Receive important account notifications via email</p>
                              </div>
                            </label>
                            
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" checked class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">Price Alerts</span>
                                <p class="text-sm text-gray-400">Get notified when your watched assets reach target prices</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="privacy-tab" class="tab-content hidden">
                    <div class="space-y-8">
                      <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
                          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-white mb-2">Privacy & Security</h2>
                        <p class="text-gray-400">Control your data and privacy settings</p>
                      </div>
                      
                      <div class="max-w-2xl mx-auto space-y-6">
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-crypto-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Data & Analytics
                          </h3>
                          <div class="space-y-4">
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" checked class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">Analytics & Performance</span>
                                <p class="text-sm text-gray-400">Help us improve by sharing anonymous usage data</p>
                              </div>
                            </label>
                            
                            <label class="flex items-center gap-4 p-3 hover:bg-crypto-accent/10 rounded-xl transition-colors cursor-pointer">
                              <input type="checkbox" class="w-5 h-5 text-crypto-primary bg-crypto-dark border-crypto-accent/20 rounded focus:ring-crypto-primary" />
                              <div>
                                <span class="text-gray-200 font-medium">Share Anonymous Data</span>
                                <p class="text-sm text-gray-400">Contribute to research while maintaining privacy</p>
                              </div>
                            </label>
                          </div>
                        </div>
                        
                        <div class="bg-crypto-dark/50 rounded-2xl p-6 border border-crypto-accent/20">
                          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-crypto-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Account Actions
                          </h3>
                          <div class="space-y-3">
                            <button onclick="exportData()" class="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Export My Data
                            </button>
                            <button onclick="deleteAccount()" class="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                              </svg>
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script>
            function showTab(tabName) {
              // Hide all tabs
              document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
              });
              
              // Show selected tab
              document.getElementById(tabName + '-tab').classList.remove('hidden');
              
              // Update active state in sidebar
              document.querySelectorAll('nav button').forEach(btn => {
                btn.className = btn.className.replace('bg-gradient-to-r from-crypto-primary/20 to-crypto-accent/20 border border-crypto-primary/30 shadow-lg shadow-crypto-primary/10', 'hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20');
                btn.querySelector('span').className = btn.querySelector('span').className.replace('text-white', 'text-gray-300 group-hover:text-white');
                btn.querySelector('p').className = btn.querySelector('p').className.replace('text-gray-300', 'text-gray-500 group-hover:text-gray-400');
                btn.querySelector('div').className = btn.querySelector('div').className.replace('bg-crypto-primary/20 text-crypto-primary', 'bg-crypto-accent/10 text-gray-400 group-hover:text-white');
              });
              
              // Set active state for clicked button
              event.target.closest('button').className = event.target.closest('button').className.replace('hover:bg-crypto-accent/10 border border-transparent hover:border-crypto-accent/20', 'bg-gradient-to-r from-crypto-primary/20 to-crypto-accent/20 border border-crypto-primary/30 shadow-lg shadow-crypto-primary/10');
              event.target.closest('button').querySelector('span').className = event.target.closest('button').querySelector('span').className.replace('text-gray-300 group-hover:text-white', 'text-white');
              event.target.closest('button').querySelector('p').className = event.target.closest('button').querySelector('p').className.replace('text-gray-500 group-hover:text-gray-400', 'text-gray-300');
              event.target.closest('button').querySelector('div').className = event.target.closest('button').querySelector('div').className.replace('bg-crypto-accent/10 text-gray-400 group-hover:text-white', 'bg-crypto-primary/20 text-crypto-primary');
            }
            
            function saveSettings() {
              // Simulate saving
              const saveBtn = event.target;
              const originalText = saveBtn.innerHTML;
              saveBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Saving...';
              saveBtn.disabled = true;
              
              setTimeout(() => {
                saveBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Saved!';
                setTimeout(() => {
                  saveBtn.innerHTML = originalText;
                  saveBtn.disabled = false;
                }, 2000);
              }, 1000);
            }
            
            function exportData() {
              const data = {
                username: '${user.username}',
                email: '${user.email}',
                settings: 'User preferences and settings data'
              };
              const dataStr = JSON.stringify(data, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'crypto-settings.json';
              link.click();
              URL.revokeObjectURL(url);
            }
            
            function deleteAccount() {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion requested. This would typically require additional verification.');
              }
            }
          </script>
        </body>
        </html>
      `)
      
      settingsWindow.document.close()
    }
    
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative">
      {/* User button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 px-4 py-2 bg-crypto-primary/20 hover:bg-crypto-primary/30 text-crypto-primary rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-crypto-primary/30 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-crypto-primary" />
        </div>
        <span className="font-medium text-white">{user.username}</span>
        <ChevronDown className={`w-4 h-4 text-crypto-primary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-crypto-darker border border-crypto-accent/20 rounded-xl shadow-xl z-50">
          {/* User info */}
          <div className="p-4 border-b border-crypto-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-crypto-primary/30 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-crypto-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <button 
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-crypto-accent/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}
