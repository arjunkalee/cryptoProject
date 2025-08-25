import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth'

// Mock user storage - in a real app, this would be a database
const MOCK_USERS_KEY = 'crypto_app_users'
const AUTH_TOKEN_KEY = 'crypto_app_token'
const CURRENT_USER_KEY = 'crypto_app_current_user'

// Initialize mock users if none exist
const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem(MOCK_USERS_KEY)
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: '1',
        email: 'demo@example.com',
        username: 'demo_user',
        password: 'demo123', // In real app, this would be hashed
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date()
      }
    ]
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers))
  }
}

// Get mock users from localStorage
const getMockUsers = (): Array<User & { password: string }> => {
  const users = localStorage.getItem(MOCK_USERS_KEY)
  return users ? JSON.parse(users) : []
}

// Save mock users to localStorage
const saveMockUsers = (users: Array<User & { password: string }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

// Generate a mock JWT token
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    iat: Date.now() 
  }))
  const signature = btoa('mock_signature')
  return `${header}.${payload}.${signature}`
}

// Validate mock JWT token
const validateMockToken = (token: string): string | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp < Date.now()) return null
    
    return payload.userId
  } catch {
    return null
  }
}

export const authService = {
  // Initialize the service
  init: () => {
    initializeMockUsers()
  },

  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = getMockUsers()
          
          // Check if email already exists
          if (users.find(u => u.email === credentials.email)) {
            reject(new Error('Email already registered'))
            return
          }
          
          // Check if username already exists
          if (users.find(u => u.username === credentials.username)) {
            reject(new Error('Username already taken'))
            return
          }
          
          // Validate password confirmation
          if (credentials.password !== credentials.confirmPassword) {
            reject(new Error('Passwords do not match'))
            return
          }
          
          // Validate password strength
          if (credentials.password.length < 6) {
            reject(new Error('Password must be at least 6 characters'))
            return
          }
          
          // Create new user
          const newUser: User & { password: string } = {
            id: Date.now().toString(),
            email: credentials.email,
            username: credentials.username,
            password: credentials.password, // In real app, hash this
            createdAt: new Date(),
            lastLoginAt: new Date()
          }
          
          users.push(newUser)
          saveMockUsers(users)
          
          // Generate token
          const token = generateMockToken(newUser.id)
          
          // Store auth data
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
          
          const { password, ...userWithoutPassword } = newUser
          resolve({ user: userWithoutPassword, token })
        } catch (error) {
          reject(error)
        }
      }, 1000) // Simulate network delay
    })
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = getMockUsers()
          const user = users.find(u => u.email === credentials.email && u.password === credentials.password)
          
          if (!user) {
            reject(new Error('Invalid email or password'))
            return
          }
          
          // Update last login
          user.lastLoginAt = new Date()
          saveMockUsers(users)
          
          // Generate token
          const token = generateMockToken(user.id)
          
          // Store auth data
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
          
          const { password, ...userWithoutPassword } = user
          resolve({ user: userWithoutPassword, token })
        } catch (error) {
          reject(error)
        }
      }, 1000) // Simulate network delay
    })
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  // Get current user from storage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    if (!userStr) return null
    
    try {
      const user = JSON.parse(userStr)
      // Validate token
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!token || !validateMockToken(token)) {
        authService.logout()
        return null
      }
      return user
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const user = localStorage.getItem(CURRENT_USER_KEY)
    
    if (!token || !user) return false
    
    try {
      const userId = validateMockToken(token)
      if (!userId) {
        authService.logout()
        return false
      }
      
      const userData = JSON.parse(user)
      return userData.id === userId
    } catch {
      return false
    }
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
}
