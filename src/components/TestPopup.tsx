import React from 'react'

interface TestPopupProps {
  isOpen: boolean
  onClose: () => void
}

const TestPopup: React.FC<TestPopupProps> = ({ isOpen, onClose }) => {
  console.log('TestPopup render - isOpen:', isOpen)

  if (!isOpen) {
    console.log('TestPopup not rendering - isOpen is false')
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ color: 'black', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Blank Modal Test
        </h2>
        <p style={{ color: 'gray', marginBottom: '16px' }}>
          This is a simple blank modal to test if popups work.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default TestPopup
