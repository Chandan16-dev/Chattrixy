import React from 'react'

function AdBanner({ height = 80, label = 'Advertisement' }) {
  return (
    <div
      className="ad-placeholder"
      role="complementary"
      aria-label="Advertisement placeholder"
      style={{ height, width: '100%' }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '0.65rem', opacity: 0.6 }}>Your ad here</p>
      </div>
    </div>
  )
}

export default AdBanner
