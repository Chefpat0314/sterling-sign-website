// lib/analytics.ts - Analytics tracking utilities

interface CTAEvent {
  event: string;
  source: string;
  entity: string;
  url?: string;
  timestamp?: number;
}

// Track CTA clicks for conversion analysis
export const trackCTAClick = (source: string, entity: string, url?: string) => {
  const event: CTAEvent = {
    event: 'cta_click',
    source,
    entity,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    timestamp: Date.now()
  };

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: `${source}_${entity}`,
      custom_parameters: {
        source,
        entity,
        url: event.url
      }
    });
  }

  // HubSpot tracking
  if (typeof window !== 'undefined' && (window as any)._hsq) {
    (window as any)._hsq.push(['trackEvent', {
      id: 'cta_click',
      value: `${source}_${entity}`
    }]);
  }

  // Custom dataLayer for GTM
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(event);
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('CTA Click Tracked:', event);
  }
};

// Track page views with context
export const trackPageView = (page: string, entity?: string) => {
  const event = {
    event: 'page_view',
    page,
    entity: entity || '',
    timestamp: Date.now()
  };

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: entity || ''
      }
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Page View Tracked:', event);
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string, source: string) => {
  const event = {
    event: 'form_submission',
    form_type: formType,
    source,
    timestamp: Date.now()
  };

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'form_submission', {
      event_category: 'conversion',
      event_label: `${formType}_${source}`,
      custom_parameters: {
        form_type: formType,
        source
      }
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Form Submission Tracked:', event);
  }
};
