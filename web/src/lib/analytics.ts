declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Ads conversion labels - Replace these with your actual conversion labels from Google Ads
// You can find these in Google Ads > Tools & Settings > Conversions > [Your Conversion Action] > Tag Setup
const GOOGLE_ADS_CONVERSIONS = {
  LEAD_SUBMIT: 'YOUR_LEAD_CONVERSION_LABEL', // TODO: Replace with your lead conversion label
  FORM_START: 'YOUR_FORM_START_CONVERSION_LABEL', // TODO: Replace with your form start conversion label
  OTP_VERIFIED: 'YOUR_OTP_VERIFIED_CONVERSION_LABEL', // TODO: Replace with your OTP verified conversion label
  PHONE_CLICK: 'YOUR_PHONE_CLICK_CONVERSION_LABEL', // TODO: Replace with your phone click conversion label
  EMAIL_CLICK: 'YOUR_EMAIL_CLICK_CONVERSION_LABEL', // TODO: Replace with your email click conversion label
};

// Google Ads conversion ID - should match the one in index.html
const GOOGLE_ADS_ID = 'AW-XXXXXXXXX'; // TODO: Replace with your Google Ads ID

export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', name, params || {});
    }
    // Facebook Pixel - map common events
    if (window.fbq) {
      const fbEventMap: Record<string, string> = {
        'page_view': 'PageView',
        'lead_submit_success': 'Lead',
        'form_start': 'InitiateCheckout',
        'otp_verified': 'CompleteRegistration',
        'phone_click': 'Contact',
        'email_click': 'Contact',
      };
      const fbEventName = fbEventMap[name] || name;
      window.fbq('track', fbEventName, params || {});
    }
  }
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { page_path: path });
  // Facebook Pixel PageView
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView', { content_name: path });
  }
};

export const trackOutboundClick = (url: string) => {
  trackEvent('outbound_click', { link_url: url });
};

export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', { scroll_percentage: depth });
};

export const trackFormStart = () => {
  trackEvent('form_start', { form_name: 'contact_enquiry_modal' });
  // Google Ads conversion - Form Start
  trackGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.FORM_START, { value: 0, currency: 'CAD' });
};

export const trackOtpSent = (phoneNumber: string) => {
  trackEvent('otp_sent', { phone_number: phoneNumber });
};

export const trackOtpVerified = (phoneNumber: string) => {
  trackEvent('otp_verified', { phone_number: phoneNumber });
  // Facebook Pixel CompleteRegistration event (client-side)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }
  // Facebook Conversions API (server-side)
  sendFacebookConversion('CompleteRegistration', {}, { phone: phoneNumber });
  // Google Ads conversion - OTP Verified
  trackGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.OTP_VERIFIED, { value: 0, currency: 'CAD' });
  // Google Ads Conversions API (server-side)
  sendGoogleAdsConversion('OTP_VERIFIED', { value: '0', currency: 'CAD' }, { phone: phoneNumber });
};

// Send event to Facebook Conversions API (server-side)
const sendFacebookConversion = async (eventName: string, eventData?: Record<string, any>, userData?: Record<string, any>) => {
  try {
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api/facebook-conversions'
      : '/.netlify/functions/facebook-conversions';
    
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, eventData, userData })
    });
  } catch (error) {
    console.error('Facebook Conversions API error:', error);
    // Don't throw - fail silently to not break user flow
  }
};

export const trackLeadSubmitSuccess = (leadData: any) => {
  trackEvent('lead_submit_success', {
    lead_name: leadData.name,
    lead_email: leadData.email,
    insurance_product: leadData.insuranceProduct,
  });
  // Facebook Pixel Lead event (client-side)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: leadData.insuranceProduct || 'Insurance Enquiry',
      value: 0,
      currency: 'CAD',
    });
  }
  // Facebook Conversions API (server-side)
  sendFacebookConversion('Lead', {
    content_name: leadData.insuranceProduct || 'Insurance Enquiry',
    value: '0',
    currency: 'CAD'
  }, {
    email: leadData.email,
    phone: leadData.phone
  });
  // Google Ads conversion - Lead Submit (client-side)
  trackGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.LEAD_SUBMIT, {
    value: 0,
    currency: 'CAD',
    transaction_id: `lead_${Date.now()}_${leadData.email?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`,
  });
  // Google Ads Conversions API (server-side)
  sendGoogleAdsConversion('LEAD_SUBMIT', {
    value: '0',
    currency: 'CAD',
    transaction_id: `lead_${Date.now()}_${leadData.email?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`,
  }, {
    email: leadData.email,
    phone: leadData.phone
  });
};

export const trackLeadSubmitError = (errorMessage: string, leadData?: any) => {
  trackEvent('lead_submit_error', { error_message: errorMessage });
  // Facebook Conversions API - track failed submissions
  sendFacebookConversion('Lead', {
    content_name: 'Form Submission Failed',
    value: '0',
    currency: 'CAD'
  }, {
    email: leadData?.email,
    phone: leadData?.phone
  });
};

// New helpers
export const trackPhoneClick = (phone: string, context?: string) => {
  trackEvent('phone_click', { phone_number: phone, context });
  // Google Ads conversion - Phone Click
  trackGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.PHONE_CLICK, { value: 0, currency: 'CAD' });
  // Google Ads Conversions API (server-side)
  sendGoogleAdsConversion('PHONE_CLICK', { value: '0', currency: 'CAD' }, { phone });
};

export const trackEmailClick = (email: string, context?: string) => {
  trackEvent('email_click', { email, context });
  // Google Ads conversion - Email Click
  trackGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.EMAIL_CLICK, { value: 0, currency: 'CAD' });
  // Google Ads Conversions API (server-side)
  sendGoogleAdsConversion('EMAIL_CLICK', { value: '0', currency: 'CAD' }, { email });
};

export const trackFileDownload = (fileName: string, fileType?: string) => {
  trackEvent('file_download', { file_name: fileName, file_type: fileType });
};

export const trackArticleClick = (title: string, postId?: string) => {
  trackEvent('article_click', { title, post_id: postId });
};

export const trackArticleRead = (title: string, postId?: string) => {
  trackEvent('article_read', { title, post_id: postId });
};

export const trackPagination = (module: string, page: number) => {
  trackEvent('pagination', { module, page });
};

export const trackFilterApplied = (module: string, filterName: string, value: string) => {
  trackEvent('filter_applied', { module, filter_name: filterName, value });
};

export const trackModuleView = (module: string) => {
  trackEvent('module_view', { module });
};

export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', { language });
};

// Google Ads conversion tracking (client-side)
const trackGoogleAdsConversion = (conversionLabel: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (conversionLabel === 'YOUR_LEAD_CONVERSION_LABEL' || 
      conversionLabel === 'YOUR_FORM_START_CONVERSION_LABEL' ||
      conversionLabel === 'YOUR_OTP_VERIFIED_CONVERSION_LABEL' ||
      conversionLabel === 'YOUR_PHONE_CLICK_CONVERSION_LABEL' ||
      conversionLabel === 'YOUR_EMAIL_CLICK_CONVERSION_LABEL' ||
      GOOGLE_ADS_ID === 'AW-XXXXXXXXX') {
    console.log('⚠️ Google Ads conversion tracking not configured. Please set your conversion labels and Google Ads ID.');
    return;
  }
  
  window.gtag('event', 'conversion', {
    'send_to': `${GOOGLE_ADS_ID}/${conversionLabel}`,
    ...params
  });
};

// Send event to Google Ads Conversions API (server-side)
const sendGoogleAdsConversion = async (eventName: string, eventData?: Record<string, any>, userData?: Record<string, any>) => {
  try {
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api/google-ads-conversions'
      : '/.netlify/functions/google-ads-conversions';
    
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, eventData, userData })
    });
  } catch (error) {
    console.error('Google Ads Conversions API error:', error);
    // Don't throw - fail silently to not break user flow
  }
};

// Backwards compatibility aliases
export const gtagEvent = trackEvent;
export const gtagPageView = trackPageView;
