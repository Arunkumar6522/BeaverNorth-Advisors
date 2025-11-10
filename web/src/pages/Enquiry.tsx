import { useState, useEffect } from 'react'
import ContactModal from '../components/ContactModal'
import { useNavigate } from 'react-router-dom'

export default function Enquiry() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Prevent browser back button navigation
  useEffect(() => {
    if (formSubmitted) return

    // Add a history entry to prevent back navigation
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      // Push state again to prevent navigation
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)

    // Also prevent page unload with a warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [formSubmitted])

  // Handle successful form submission
  const handleFormSuccess = () => {
    setFormSubmitted(true)
    // Navigate to success page after form is submitted
    navigate('/success', { state: { submitted: true } })
  }

  // Prevent closing the modal unless form is submitted
  const handleClose = () => {
    if (!formSubmitted) {
      // Do nothing - prevent closing
      return
    }
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <ContactModal
      isOpen={isOpen}
      showCloseButton={false}
      disableBackdropClose={true}
      onClose={handleClose}
      onFormSuccess={handleFormSuccess}
    />
  )
}
