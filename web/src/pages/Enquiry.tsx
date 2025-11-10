import ContactModal from '../components/ContactModal'
import { useNavigate } from 'react-router-dom'

export default function Enquiry() {
  const navigate = useNavigate()
  return (
    <ContactModal
      isOpen
      showCloseButton={false}
      onClose={() => navigate('/')}
    />
  )
}
