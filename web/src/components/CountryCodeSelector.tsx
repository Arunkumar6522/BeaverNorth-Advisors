import { useState } from 'react'

interface CountryCodeSelectorProps {
  value: string
  onChange: (countryCode: string) => void
  onCountryChange?: (country: string) => void
}

// Common country codes for insurance clients
const countryCodes = [
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' }
]

export default function CountryCodeSelector({ value, onChange, onCountryChange }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedCountry = countryCodes.find(country => country.code === value) || countryCodes[0]
  
  const filteredCountries = countryCodes.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  )

  const handleSelect = (countryCode: string, country: string) => {
    onChange(countryCode)
    onCountryChange?.(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Selected Country Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '14px 16px',
          border: '2px solid var(--line)',
          borderRadius: '12px 0 0 12px',
          background: 'var(--surface-1)',
          color: 'var(--text-primary)',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '120px',
          justifyContent: 'space-between'
        }}
      >
        <span>{selectedCountry.flag}</span>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedCountry.code}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>▼</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--surface-1)',
          border: '2px solid var(--line)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          zIndex: 1000,
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {/* Search Input */}
          <div style={{ padding: '12px', borderBottom: '1px solid var(--line)' }}>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--surface-2)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              autoFocus
            />
          </div>

          {/* Country List */}
          <div>
            {filteredCountries.map((country) => (
              <button
                key={`${country.code}-${country.country}`}
                type="button"
                onClick={() => handleSelect(country.code, country.country)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--surface-2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: '18px' }}>{country.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{country.country}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {country.code}
                  </div>
                </div>
                {selectedCountry.code === country.code && (
                  <span style={{ color: 'var(--brand-green)', fontSize: '12px' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
