import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from 'react'

type Locale = 'en' | 'fr'

type Dict = Record<string, string>

const en: Dict = {
  nav_home: 'Home',
  nav_about: 'About',
  nav_services: 'Services',
  nav_blog: 'Blog',
  nav_testimonials: 'Testimonials',
  nav_contact: 'Contact',
  top_email: 'beavernorthadvisors@gmail.com',
  top_contact: 'Contact',
  top_location: 'Location',
  location_value: 'Montreal, Quebec, Canada',
  hero_tag: '#1 Canadian insurance advisory partner',
  hero_headline_1: 'New Confidence',
  hero_headline_2: 'for your Future',
  hero_subtitle: 'Get personalized insurance quotes from trusted Canadian providers',
  cta_get_in_touch: 'Get in touch',
  cta_our_services: 'Our services',
  cta_get_quote: 'Get Your Quote',
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
  footer_tag: 'Canada‑based insurance advisory',
  insurance_partners: 'Trusted Partners - Canadian Insurance Providers',
  footer_about: 'About Us',
  footer_services: 'Services',
  footer_contact: 'Contact',
  footer_rights: 'All rights reserved.',
  footer_description: 'Your trusted partner for Canadian insurance solutions.',
  footer_quick_links: 'Quick Links',
  privacy_policy: 'Privacy Policy',
  blog_title: 'Our Blog',
  blog_loading: 'Loading blog posts...',
  blog_no_posts: 'No Blog Posts Yet',
  blog_visit_direct: 'Visit our blog directly',
  blog_visit_site: 'Visit Our Blogger Site',
  blog_visit_full: 'Visit Full Blog',
  blog_error_load: 'Failed to load blog posts',
  blog_error_fetch: 'Failed to fetch blog posts from server',
  blog_error_no_posts: 'No blog posts found',
  testimonials_title: 'Client Testimonials',
  testimonials_loading: 'Loading testimonials...',
  testimonials_title_home: 'What Our Clients Say',
  testimonials_loading_home: 'Loading testimonials...',
  testimonials_empty_home: 'No testimonials available at the moment.',
  testimonials_cta_home: 'View All Testimonials',
  blogs_title_home: 'Latest Financial Insights',
  blogs_loading_home: 'Loading blog posts...',
  blogs_empty_home: 'No blog posts available at the moment.',
  blogs_subtitle_home: 'Stay informed with our latest articles on financial planning, insurance, and wealth building',
  blogs_cta_home: 'View All Blog Posts',
  // Page CTAs
  testimonials_cta_title: 'Ready to Join Our Success Stories?',
  testimonials_cta_sub: 'Let us help you achieve your financial goals with personalized advice and expert guidance',
  testimonials_cta_button: 'Get Started Today',
  contact_cta_title: 'Ready to Secure Your Future?',
  contact_cta_sub: 'Our expert advisors are here to help you make informed financial decisions',
  contact_cta_button: 'Call (438) 763-5120',
  // Privacy modal
  privacy_title: 'Privacy Policy',
  privacy_last_updated: 'Last updated',
  privacy_close: 'Close'
}

const fr: Dict = {
  nav_home: 'Accueil',
  nav_about: 'À propos',
  nav_services: 'Services',
  nav_blog: 'Blog',
  nav_testimonials: 'Témoignages',
  nav_contact: 'Contact',
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
  footer_tag: 'Cabinet-conseil en assurance basé au Canada',
  hero_subtitle: 'Obtenez des devis d\'assurance personnalisés de fournisseurs canadiens de confiance',
  cta_get_quote: 'Obtenez votre devis',
  insurance_partners: 'Partenaires de confiance - Fournisseurs d\'assurance canadiens',
  footer_about: 'À propos',
  footer_services: 'Services',
  footer_contact: 'Contact',
  footer_rights: 'Tous droits réservés.',
  footer_description: 'Votre partenaire de confiance pour les solutions d\'assurance canadiennes.',
  footer_quick_links: 'Liens rapides',
  privacy_policy: 'Politique de confidentialité',
  blog_title: 'Notre Blog',
  blog_loading: 'Chargement des articles de blog...',
  blog_no_posts: 'Aucun article de blog pour le moment',
  blog_visit_direct: 'Visitez notre blog directement',
  blog_visit_site: 'Visitez notre site Blogger',
  blog_visit_full: 'Visiter le blog complet',
  blog_error_load: 'Échec du chargement des articles de blog',
  blog_error_fetch: 'Échec de la récupération des articles de blog depuis le serveur',
  blog_error_no_posts: 'Aucun article de blog trouvé',
  testimonials_title: 'Témoignages Clients',
  testimonials_loading: 'Chargement des témoignages...',
  testimonials_title_home: 'Ce que disent nos clients',
  testimonials_loading_home: 'Chargement des témoignages...',
  testimonials_empty_home: "Aucun témoignage disponible pour le moment.",
  testimonials_cta_home: 'Voir tous les témoignages',
  blogs_title_home: 'Derniers éclairages financiers',
  blogs_loading_home: 'Chargement des articles de blog...',
  blogs_empty_home: "Aucun article de blog disponible pour le moment.",
  blogs_subtitle_home: 'Restez informé grâce à nos derniers articles sur la planification financière, l’assurance et la constitution de patrimoine',
  blogs_cta_home: 'Voir tous les articles du blog',
  // Page CTAs
  testimonials_cta_title: 'Prêt à rejoindre nos histoires de réussite ?',
  testimonials_cta_sub: 'Laissez‑nous vous aider à atteindre vos objectifs financiers avec des conseils personnalisés et une expertise reconnue',
  testimonials_cta_button: "Commencer aujourd'hui",
  contact_cta_title: 'Prêt à sécuriser votre avenir ?',
  contact_cta_sub: 'Nos conseillers experts sont là pour vous aider à prendre des décisions éclairées',
  contact_cta_button: 'Appeler (438) 763‑5120',
  // Privacy modal
  privacy_title: 'Politique de confidentialité',
  privacy_last_updated: 'Dernière mise à jour',
  privacy_close: 'Fermer'
}

const dictionaries: Record<Locale, Dict> = { en, fr }

type I18nContextType = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, else default to English
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('locale') as Locale | null : null
    return saved === 'en' || saved === 'fr' ? saved : 'en'
  })

  // Persist locale on change
  useEffect(() => {
    try {
      window.localStorage.setItem('locale', locale)
    } catch {}
  }, [locale])

  const t = useMemo(() => (key: string) => dictionaries[locale][key] ?? key, [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}


