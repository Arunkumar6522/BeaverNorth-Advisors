import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Locale = 'en' | 'fr'

type Dict = Record<string, string>

const en: Dict = {
  nav_home: 'Home',
  nav_about: 'About Us',
  nav_services: 'Services',
  nav_blog: 'Blog',
  nav_contact: 'Contact Us',
  top_email: 'beavernorthadvisors@gmail.com',
  top_contact: 'Contact',
  top_location: 'Location',
  location_value: 'Montreal, Quebec, Canada',
  hero_tag: '#1 Canadian insurance advisory partner',
  hero_headline_1: 'New Confidence',
  hero_headline_2: 'for your Future',
  cta_get_in_touch: 'Get in touch',
  cta_our_services: 'Our services',
  metrics_1_label: 'Annual client savings guided',
  metrics_2_label: 'Projects completed nationwide',
  metrics_3_label: 'Canadians supported to date',
  about_title: 'About BeaverNorth',
  about_body: 'We are a Canada‑based insurance advisory focused on clarity and trust. Our mission is to simplify insurance decisions with transparent guidance and tailored recommendations.',
  capabilities_title: 'Capabilities',
  services_title: 'Services',
  ready_title: 'Ready to protect what matters?',
  ready_sub: 'Talk to a licensed advisor today.',
  contact_title: 'Contact Us',
  footer_tag: 'Canada‑based insurance advisory'
}

const fr: Dict = {
  nav_home: 'Accueil',
  nav_about: 'À propos',
  nav_services: 'Services',
  nav_blog: 'Blog',
  nav_contact: 'Nous contacter',
  top_email: 'beavernorthadvisors@gmail.com',
  top_contact: 'Contact',
  top_location: 'Localisation',
  location_value: 'Montréal, Québec, Canada',
  hero_tag: "Conseiller d'assurance canadien n°1",
  hero_headline_1: 'Une nouvelle confiance',
  hero_headline_2: 'pour votre avenir',
  cta_get_in_touch: 'Nous joindre',
  cta_our_services: 'Nos services',
  metrics_1_label: 'Économies annuelles guidées',
  metrics_2_label: 'Projets réalisés au pays',
  metrics_3_label: 'Canadiens accompagnés à ce jour',
  about_title: 'À propos de BeaverNorth',
  about_body: "Nous sommes un cabinet-conseil canadien axé sur la clarté et la confiance. Notre mission est de simplifier les décisions d'assurance avec des recommandations transparentes et adaptées.",
  capabilities_title: 'Capacités',
  services_title: 'Services',
  ready_title: 'Prêt à protéger l’essentiel ?',
  ready_sub: 'Parlez à un conseiller agréé dès aujourd’hui.',
  contact_title: 'Nous contacter',
  footer_tag: 'Cabinet-conseil en assurance basé au Canada'
}

const dictionaries: Record<Locale, Dict> = { en, fr }

type I18nContextType = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const t = useMemo(() => (key: string) => dictionaries[locale][key] ?? key, [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}


