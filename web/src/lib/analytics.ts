declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params || {});
  }
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { page_path: path });
};

export const trackOutboundClick = (url: string) => {
  trackEvent('outbound_click', { link_url: url });
};

export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', { scroll_percentage: depth });
};

export const trackFormStart = () => {
  trackEvent('form_start', { form_name: 'contact_enquiry_modal' });
};

export const trackOtpSent = (phoneNumber: string) => {
  trackEvent('otp_sent', { phone_number: phoneNumber });
};

export const trackOtpVerified = (phoneNumber: string) => {
  trackEvent('otp_verified', { phone_number: phoneNumber });
};

export const trackLeadSubmitSuccess = (leadData: any) => {
  trackEvent('lead_submit_success', {
    lead_name: leadData.name,
    lead_email: leadData.email,
    insurance_product: leadData.insuranceProduct,
  });
};

export const trackLeadSubmitError = (errorMessage: string) => {
  trackEvent('lead_submit_error', { error_message: errorMessage });
};

// New helpers
export const trackPhoneClick = (phone: string, context?: string) => {
  trackEvent('phone_click', { phone_number: phone, context });
};

export const trackEmailClick = (email: string, context?: string) => {
  trackEvent('email_click', { email, context });
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

// Backwards compatibility aliases
export const gtagEvent = trackEvent;
export const gtagPageView = trackPageView;
