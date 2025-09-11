import React, { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownLeft, CreditCard, Building2, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { User } from '../types/auth'

interface BankAccount {
  id: string
  bankName: string
  accountType: 'checking' | 'savings'
  lastFour: string
  routingNumber: string
  isVerified: boolean
  addedAt: string
}

interface Transfer {
  id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  bankAccountId: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  reference?: string
}

interface TransferPageProps {
  user: User
}

const TransferPage: React.FC<TransferPageProps> = ({ user }) => {
  const { isDark } = useTheme()
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferType, setTransferType] = useState<'deposit' | 'withdrawal'>('deposit')
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [transferAmount, setTransferAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // Load bank accounts and transfers from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedAccounts = localStorage.getItem(`bank_accounts_${user.id}`)
      const storedTransfers = localStorage.getItem(`transfers_${user.id}`)
      
      if (storedAccounts) {
        setBankAccounts(JSON.parse(storedAccounts))
      }
      if (storedTransfers) {
        setTransfers(JSON.parse(storedTransfers))
      }
    }
    
    loadData()
  }, [user.id])

  // Save bank accounts to localStorage
  const saveBankAccounts = (accounts: BankAccount[]) => {
    setBankAccounts(accounts)
    localStorage.setItem(`bank_accounts_${user.id}`, JSON.stringify(accounts))
  }

  // Save transfers to localStorage
  const saveTransfers = (newTransfers: Transfer[]) => {
    setTransfers(newTransfers)
    localStorage.setItem(`transfers_${user.id}`, JSON.stringify(newTransfers))
  }

  // Add new bank account
  const handleAddAccount = (accountData: Omit<BankAccount, 'id' | 'addedAt' | 'isVerified'>) => {
    const newAccount: BankAccount = {
      ...accountData,
      id: Date.now().toString(),
      isVerified: false, // In real app, this would be verified through bank API
      addedAt: new Date().toISOString()
    }
    
    saveBankAccounts([...bankAccounts, newAccount])
    setShowAddAccount(false)
  }

  // Remove bank account
  const handleRemoveAccount = (accountId: string) => {
    const updatedAccounts = bankAccounts.filter(account => account.id !== accountId)
    saveBankAccounts(updatedAccounts)
  }

  // Process transfer
  const handleTransfer = async () => {
    if (!selectedAccount || !transferAmount) return

    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newTransfer: Transfer = {
      id: Date.now().toString(),
      type: transferType,
      amount: parseFloat(transferAmount),
      bankAccountId: selectedAccount.id,
      status: 'completed', // In real app, this would be 'pending' initially
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      reference: `TXN${Date.now().toString().slice(-8)}`
    }
    
    saveTransfers([newTransfer, ...transfers])
    
    // Reset form
    setTransferAmount('')
    setSelectedAccount(null)
    setShowTransferModal(false)
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Transfer Funds</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-crypto-light-text-secondary'}`}>
            Deposit and withdraw funds to/from your bank account
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => {
              setTransferType('deposit')
              setShowTransferModal(true)
            }}
            className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              isDark ? 'glass-card hover:bg-green-500/20' : 'bg-white shadow-lg border border-crypto-light-border hover:border-green-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <ArrowDownLeft className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Deposit Funds</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                  Add money from your bank account
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setTransferType('withdrawal')
              setShowTransferModal(true)
            }}
            className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              isDark ? 'glass-card hover:bg-red-500/20' : 'bg-white shadow-lg border border-crypto-light-border hover:border-red-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <ArrowUpRight className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Withdraw Funds</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                  Send money to your bank account
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Bank Accounts Section */}
        <div className={`p-6 rounded-xl mb-8 ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-crypto-primary" />
                Bank Accounts
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Manage your connected bank accounts
              </p>
            </div>
            <button
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crypto-primary/20 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-crypto-primary" />
              </div>
              <h4 className="text-lg font-medium mb-2">No Bank Accounts</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Add a bank account to start transferring funds
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-crypto-light-border bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{account.bankName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isVerified ? (
                        <span className="flex items-center gap-1 text-green-500 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveAccount(account.id)}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account</div>
                    <div>****{account.lastFour}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transfer History */}
        <div className={`p-6 rounded-xl ${isDark ? 'glass-card' : 'bg-white shadow-lg border border-crypto-light-border'}`}>
          <h3 className="text-xl font-semibold mb-6">Transfer History</h3>
          
          {transfers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-medium mb-2">No Transfers Yet</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-crypto-light-text-secondary'}`}>
                Your transfer history will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => {
                    const account = bankAccounts.find(acc => acc.id === transfer.bankAccountId)
                    return (
                      <tr key={transfer.id} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                        <td className="py-4 px-4 text-sm">{formatDate(transfer.createdAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {transfer.type === 'deposit' ? (
                              <ArrowDownLeft className="w-4 h-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-red-500" />
                            )}
                            <span className="capitalize">{transfer.type}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 font-medium">
                          {formatCurrency(transfer.amount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transfer.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transfer.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {transfer.reference}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Bank Account Modal */}
      {showAddAccount && (
        <AddBankAccountModal
          isOpen={showAddAccount}
          onClose={() => setShowAddAccount(false)}
          onAddAccount={handleAddAccount}
          isDark={isDark}
        />
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
          transferType={transferType}
          bankAccounts={bankAccounts}
          loading={loading}
          isDark={isDark}
        />
      )}
    </div>
  )
}

// Add Bank Account Modal Component
interface AddBankAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onAddAccount: (account: Omit<BankAccount, 'id' | 'addedAt' | 'isVerified'>) => void
  isDark: boolean
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
  isDark
}) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: 'checking' as 'checking' | 'savings',
    accountNumber: '',
    routingNumber: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.bankName && formData.accountNumber && formData.routingNumber) {
      onAddAccount({
        bankName: formData.bankName,
        accountType: formData.accountType,
        lastFour: formData.accountNumber.slice(-4),
        routingNumber: formData.routingNumber
      })
      setFormData({ bankName: '', accountType: 'checking', accountNumber: '', routingNumber: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
        isDark ? 'glass-card' : 'bg-white border border-crypto-light-border'
      }`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Bank Account</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                }`}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'checking' | 'savings' })}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text'
                }`}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                }`}
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Routing Number</label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                }`}
                placeholder="Enter routing number"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-crypto-primary to-crypto-secondary hover:from-crypto-secondary hover:to-crypto-accent text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
              >
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Transfer Modal Component
interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: () => void
  transferType: 'deposit' | 'withdrawal'
  bankAccounts: BankAccount[]
  loading: boolean
  isDark: boolean
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  transferType,
  bankAccounts,
  loading,
  isDark
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAccountId && amount) {
      onTransfer()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
        isDark ? 'glass-card' : 'bg-white border border-crypto-light-border'
      }`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {transferType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Bank Account</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text'
                }`}
                required
              >
                <option value="">Choose an account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - ****{account.lastFour}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-crypto-light-border text-crypto-light-text placeholder-crypto-light-text-secondary'
                }`}
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-crypto-light-text-secondary hover:text-crypto-light-text'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedAccountId || !amount}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  transferType === 'deposit'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : transferType === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransferPage
