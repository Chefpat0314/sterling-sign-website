// UTM Utilities for Step 11 National Rollout
// Parse and persist UTM parameters for analytics and routing

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

interface UTMSession {
  utm: UTMParams;
  first_touch: string;
  last_touch: string;
  session_id: string;
}

/**
 * Parse UTM parameters from URL or window.location
 */
export function parseUTMParams(url?: string): UTMParams {
  const urlObj = url ? new URL(url) : (typeof window !== 'undefined' ? window.location : null);
  if (!urlObj) return {};

  const params = new URLSearchParams(urlObj.search);
  
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined
  };
}

/**
 * Persist UTM parameters to session storage
 */
export function persistUTMParams(utmParams: UTMParams): void {
  if (typeof window === 'undefined') return;

  try {
    const existingSession = getUTMSession();
    const now = new Date().toISOString();
    
    const session: UTMSession = {
      utm: utmParams,
      first_touch: existingSession?.first_touch || now,
      last_touch: now,
      session_id: existingSession?.session_id || generateSessionId()
    };

    sessionStorage.setItem('sterling_utm_session', JSON.stringify(session));
    localStorage.setItem('sterling_utm_first_touch', session.first_touch);
  } catch (error) {
    console.error('Failed to persist UTM parameters:', error);
  }
}

/**
 * Get UTM session from storage
 */
export function getUTMSession(): UTMSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = sessionStorage.getItem('sterling_utm_session');
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Failed to get UTM session:', error);
    return null;
  }
}

/**
 * Get first touch UTM parameters
 */
export function getFirstTouchUTM(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const firstTouchData = localStorage.getItem('sterling_utm_first_touch');
    if (!firstTouchData) return null;

    // Try to get first touch session from sessionStorage
    const sessionData = sessionStorage.getItem('sterling_utm_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.first_touch === firstTouchData) {
        return session.utm;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get first touch UTM:', error);
    return null;
  }
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * HOC for components that need UTM context
 */
export function withUTMProps<T extends Record<string, any>>(
  Component: React.ComponentType<T & { utm: UTMParams }>
): React.ComponentType<T> {
  return function WrappedComponent(props: T) {
    const utm = getUTMSession()?.utm || {};
    return <Component {...props} utm={utm} />;
  };
}

/**
 * Hook for accessing UTM parameters
 */
export function useUTM(): UTMParams {
  const [utm, setUtm] = React.useState<UTMParams>({});

  React.useEffect(() => {
    const session = getUTMSession();
    if (session) {
      setUtm(session.utm);
    }
  }, []);

  return utm;
}

/**
 * Initialize UTM tracking on page load
 */
export function initializeUTMTracking(): void {
  if (typeof window === 'undefined') return;

  // Parse current UTM parameters
  const utmParams = parseUTMParams();
  
  // Only persist if we have UTM parameters
  if (Object.keys(utmParams).length > 0) {
    persistUTMParams(utmParams);
  }

  // Track UTM attribution
  if (typeof window.analytics !== 'undefined') {
    window.analytics.track('utm_attribution', {
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      gclid: utmParams.gclid,
      fbclid: utmParams.fbclid,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get UTM parameters for analytics events
 */
export function getUTMForAnalytics(): UTMParams {
  const session = getUTMSession();
  return session?.utm || {};
}

/**
 * Clear UTM session (for testing or privacy)
 */
export function clearUTMSession(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem('sterling_utm_session');
    localStorage.removeItem('sterling_utm_first_touch');
  } catch (error) {
    console.error('Failed to clear UTM session:', error);
  }
}

// React import for hooks
import React from 'react';
