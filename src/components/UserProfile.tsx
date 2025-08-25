import React, { useState } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { User as UserType } from '../types/auth'
import SettingsPage from './SettingsPage'

interface UserProfileProps {
  user: UserType
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    onLogout()
    setIsDropdownOpen(false)
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
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

      {/* Settings Page */}
      <SettingsPage
        user={user}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}
