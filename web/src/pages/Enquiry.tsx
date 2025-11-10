import { useState, useEffect } from 'react'
import ContactModal from '../components/ContactModal'
import { useNavigate } from 'react-router-dom'

export default function Enquiry() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      // If modal somehow closes, return to home
      navigate('/')
    }
  }, [isOpen, navigate])

  if (!isOpen) {
    return null
  }

  return (
    <ContactModal
      isOpen={isOpen}
      showCloseButton={false}
      disableBackdropClose
      onClose={() => setIsOpen(false)}
    />
  )
}
