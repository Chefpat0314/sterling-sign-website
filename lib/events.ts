import { analytics } from './metrics';

// Event tracking system for personalization and lifecycle management
export interface EventPayload {
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  properties?: Record<string, any>;
  context?: {
    page?: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
  };
}

// Core event types for personalization
export const EventTypes = {
  // User lifecycle events
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PROFILE_UPDATED: 'user_profile_updated',
  
  // Product interaction events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_SAVED: 'product_saved',
  PRODUCT_SHARED: 'product_shared',
  PRODUCT_COMPARED: 'product_compared',
  
  // Design and configuration events
  DESIGN_STARTED: 'design_started',
  DESIGN_SAVED: 'design_saved',
  DESIGN_SHARED: 'design_shared',
  DESIGN_DOWNLOADED: 'design_downloaded',
  
  // Quote and order events
  QUOTE_REQUESTED: 'quote_requested',
  QUOTE_VIEWED: 'quote_viewed',
  QUOTE_ACCEPTED: 'quote_accepted',
  QUOTE_DECLINED: 'quote_declined',
  
  // Reorder and repeat purchase events
  REORDER_INITIATED: 'reorder_initiated',
  REORDER_COMPLETED: 'reorder_completed',
  SIMILAR_PRODUCT_VIEWED: 'similar_product_viewed',
  
  // Behavioral tracking events
  CART_ABANDONED: 'cart_abandoned',
  CART_RECOVERED: 'cart_recovered',
  WISHLIST_ADDED: 'wishlist_added',
  WISHLIST_REMOVED: 'wishlist_removed',
  
  // Engagement events
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  PUSH_NOTIFICATION_SENT: 'push_notification_sent',
  PUSH_NOTIFICATION_CLICKED: 'push_notification_clicked',
  
  // Support and feedback events
  SUPPORT_CONTACTED: 'support_contacted',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  REVIEW_SUBMITTED: 'review_submitted',
  
  // Business intelligence events
  SEGMENT_IDENTIFIED: 'segment_identified',
  LIFECYCLE_STAGE_CHANGED: 'lifecycle_stage_changed',
  RETENTION_RISK_IDENTIFIED: 'retention_risk_identified',
  CHURN_PREDICTED: 'churn_predicted'
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];

// Event tracking class
export class EventTracker {
  private static instance: EventTracker;
  private eventQueue: Array<{ type: EventType; payload: EventPayload }> = [];
  private isProcessing = false;

  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }

  // Track a single event
  track(type: EventType, payload: EventPayload = {}): void {
    const event = {
      type,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        context: {
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
          ...payload.context
        }
      }
    };

    this.eventQueue.push(event);
    this.processQueue();
  }

  // Track multiple events in batch
  trackBatch(events: Array<{ type: EventType; payload: EventPayload }>): void {
    events.forEach(event => this.track(event.type, event.payload));
  }

  // Process the event queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to analytics providers
      for (const event of events) {
        analytics.track(event.type, event.payload);
      }

      // Send to custom endpoints for personalization
      await this.sendToPersonalizationAPI(events);
    } catch (error) {
      console.error('Event tracking error:', error);
      // Re-queue failed events
      this.eventQueue.unshift(...events);
    } finally {
      this.isProcessing = false;
    }
  }

  // Send events to personalization API
  private async sendToPersonalizationAPI(events: Array<{ type: EventType; payload: EventPayload }>): Promise<void> {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        throw new Error(`Personalization API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send events to personalization API:', error);
    }
  }

  // Get or create session ID
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session';
    
    let sessionId = sessionStorage.getItem('event-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('event-session-id', sessionId);
    }
    return sessionId;
  }

  // Get user ID from various sources
  getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try to get from localStorage, sessionStorage, or cookies
    return localStorage.getItem('user-id') || 
           sessionStorage.getItem('user-id') || 
           this.getCookieValue('user-id');
  }

  // Set user ID
  setUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('user-id', userId);
    sessionStorage.setItem('user-id', userId);
    this.setCookie('user-id', userId, 365); // 1 year
  }

  // Helper methods for cookies
  private getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}

// Export singleton instance
export const eventTracker = EventTracker.getInstance();

// Convenience functions for common events
export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  eventTracker.track(EventTypes.USER_PROFILE_UPDATED, {
    properties: { action, ...properties }
  });
};

export const trackProductInteraction = (productId: string, interaction: string, properties?: Record<string, any>) => {
  eventTracker.track(EventTypes.PRODUCT_VIEWED, {
    properties: { productId, interaction, ...properties }
  });
};

export const trackDesignAction = (designId: string, action: string, properties?: Record<string, any>) => {
  eventTracker.track(EventTypes.DESIGN_SAVED, {
    properties: { designId, action, ...properties }
  });
};

export const trackReorderAction = (orderId: string, action: string, properties?: Record<string, any>) => {
  eventTracker.track(EventTypes.REORDER_INITIATED, {
    properties: { orderId, action, ...properties }
  });
};

// React hook for event tracking
export const useEventTracking = () => {
  return {
    track: eventTracker.track.bind(eventTracker),
    trackUserAction,
    trackProductInteraction,
    trackDesignAction,
    trackReorderAction,
    getUserId: eventTracker.getUserId.bind(eventTracker),
    setUserId: eventTracker.setUserId.bind(eventTracker)
  };
};
