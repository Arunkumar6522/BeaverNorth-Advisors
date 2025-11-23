import { Box, Typography } from '@mui/material'
import { useI18n } from '../i18n'

// Import logos
import manulifeLogo from '../assets/insurance companies/manulife-logo-preview.png'
import benevaLogo from '../assets/insurance companies/beneva-ssq-lacapitale-brand-1536x672.jpg'
import allianzLogo from '../assets/insurance companies/Allianz.svg.png'
import iaLogo from '../assets/insurance companies/IA_Financial_Group-Logo.wine.png'
import travelanceLogo from '../assets/insurance companies/travelance-logo.png'
import visitCanadaLogo from '../assets/insurance companies/2-visit-canada_logo.svg'
import empireLifeLogo from '../assets/insurance companies/logo-en.png'

interface InsuranceLogo {
  name: string
  src: string
  alt: string
}

const insuranceLogos: InsuranceLogo[] = [
  {
    name: 'Manulife',
    src: manulifeLogo,
    alt: 'Manulife Insurance'
  },
  {
    name: 'Beneva',
    src: benevaLogo,
    alt: 'Beneva Insurance'
  },
  {
    name: 'Allianz',
    src: allianzLogo,
    alt: 'Allianz Insurance'
  },
  {
    name: 'Industrial Alliance',
    src: iaLogo,
    alt: 'Industrial Alliance Insurance'
  },
  {
    name: 'Travelance',
    src: travelanceLogo,
    alt: 'Travelance Insurance'
  },
  {
    name: '2VisitCanada',
    src: visitCanadaLogo,
    alt: '2VisitCanada Insurance'
  },
  {
    name: 'Empire Life',
    src: empireLifeLogo,
    alt: 'Empire Life Insurance'
  }
]

export default function InsuranceCarousel() {
  // Logos are hidden as per user request
  return null
}
