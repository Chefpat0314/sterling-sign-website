// lib/metrics.ts - Event tracking and analytics
import { z } from 'zod';

// Event Schema Validation
const EventSchema = z.object({
  event: z.string(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  orderId: z.string().optional(),
  product: z.string().optional(),
  ms: z.number().optional(),
  meta: z.record(z.string(), z.any()).optional(),
  timestamp: z.number().default(() => Date.now()),
});

export type EventName = 
  | 'view_app' | 'view_home' | 'click_cta'
  | 'view_category' | 'view_product' | 'faq_expand'
  | 'configure_change' | 'ttq_ready' | 'preflight_pass' | 'preflight_warn' | 'add_to_cart'
  | 'begin_checkout' | 'select_shipping' | 'payment_attempt' | 'purchase'
  | 'proof_request' | 'proof_view' | 'proof_approve' | 'proof_change_request'
  | 'reorder_click' | 'order_track_view'
  | 'qa_pass' | 'qa_fail' | 'ship_label' | 'delivered' | 'on_time_check'
  | 'delivery_date_shown' | 'cutoff_timer_viewed' | 'shipping_method_selected'
  | 'promise_committed' | 'promise_met' | 'promise_missed' | 'damage_claim_started';

export type EventPayload = z.infer<typeof EventSchema>;

// Session Management
let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
};

// Analytics Providers Interface
interface AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
}

// Google Analytics 4 Provider
class GA4Provider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'engagement',
        custom_parameters: properties,
      });
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        custom_map: traits,
      });
    }
  }
}

// Segment Provider
class SegmentProvider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(event, properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.identify(userId, traits);
    }
  }
}

// Development Console Provider
class ConsoleProvider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    console.log(`📊 Analytics Event: ${event}`, properties);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    console.log(`👤 User Identified: ${userId}`, traits);
  }
}

// Main Analytics Class
class Analytics {
  private providers: AnalyticsProvider[] = [];

  constructor() {
    // Add providers based on environment
    if (process.env.NODE_ENV === 'development') {
      this.providers.push(new ConsoleProvider());
    }
    
    // Add production providers
    this.providers.push(new GA4Provider());
    this.providers.push(new SegmentProvider());
  }

  track(event: EventName, payload: Partial<EventPayload> = {}): void {
    const fullPayload: EventPayload = {
      event,
      sessionId: getSessionId(),
      timestamp: Date.now(),
      ...payload,
    };

    // Send to all providers
    this.providers.forEach(provider => {
      provider.track(event, fullPayload);
    });

    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(fullPayload);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.providers.forEach(provider => {
      provider.identify(userId, traits);
    });
  }

  // Convenience methods for common events
  viewApp(): void {
    this.track('view_app');
  }

  viewHome(): void {
    this.track('view_home');
  }

  clickCTA(label: string, source: string): void {
    this.track('click_cta', {
      meta: { label, source }
    });
  }

  viewCategory(category: string): void {
    this.track('view_category', {
      meta: { category }
    });
  }

  viewProduct(productId: string, category?: string): void {
    this.track('view_product', {
      product: productId,
      meta: { category }
    });
  }

  configureChange(field: string, value: any, productId?: string): void {
    this.track('configure_change', {
      product: productId,
      meta: { field, value }
    });
  }

  ttqReady(ms: number, productId?: string): void {
    this.track('ttq_ready', {
      ms,
      product: productId
    });
  }

  preflightPass(productId: string): void {
    this.track('preflight_pass', { product: productId });
  }

  preflightWarn(warnings: string[], productId: string): void {
    this.track('preflight_warn', {
      product: productId,
      meta: { warnings }
    });
  }

  addToCart(productId: string, quantity: number, price: number): void {
    this.track('add_to_cart', {
      product: productId,
      meta: { quantity, price }
    });
  }

  beginCheckout(orderId: string, total: number): void {
    this.track('begin_checkout', {
      orderId,
      meta: { total }
    });
  }

  purchase(orderId: string, total: number, products: string[]): void {
    this.track('purchase', {
      orderId,
      meta: { total, products }
    });
  }

  proofApprove(orderId: string, proofId: string): void {
    this.track('proof_approve', {
      orderId,
      meta: { proofId }
    });
  }

  reorderClick(orderId: string, productId: string): void {
    this.track('reorder_click', {
      orderId,
      product: productId
    });
  }

  // Performance metrics
  measureTTQ(startTime: number, productId?: string): void {
    const ms = Date.now() - startTime;
    this.ttqReady(ms, productId);
  }

  // Shipping and delivery events
  deliveryDateShown(product: string, destZip: string, methodSuggested: string, arrivalDate: string, cutoffState: string): void {
    this.track('delivery_date_shown', {
      product,
      meta: { destZip, methodSuggested, arrivalDate, cutoffState }
    });
  }

  cutoffTimerViewed(secondsRemaining: number, cutoffState: string): void {
    this.track('cutoff_timer_viewed', {
      meta: { secondsRemaining, cutoffState }
    });
  }

  shippingMethodSelected(method: string, cost: number, arrival: string, guaranteed: boolean): void {
    this.track('shipping_method_selected', {
      meta: { method, cost, arrival, guaranteed }
    });
  }

  promiseCommitted(orderId: string, method: string, promisedArrivalUtc: string): void {
    this.track('promise_committed', {
      orderId,
      meta: { method, promisedArrivalUtc }
    });
  }

  promiseMet(orderId: string, actualDeliveryUtc: string, deltaDays: number): void {
    this.track('promise_met', {
      orderId,
      meta: { actualDeliveryUtc, deltaDays }
    });
  }

  promiseMissed(orderId: string, actualDeliveryUtc: string, deltaDays: number): void {
    this.track('promise_missed', {
      orderId,
      meta: { actualDeliveryUtc, deltaDays }
    });
  }

  damageClaimStarted(orderId: string, productType: string, carrier: string): void {
    this.track('damage_claim_started', {
      orderId,
      meta: { productType, carrier }
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export types and utilities
export type { EventPayload };
export { EventSchema };

// Utility function to get analytics events for debugging
export const getAnalyticsEvents = (): EventPayload[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('analytics_events') || '[]');
};

// Clear analytics events
export const clearAnalyticsEvents = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('analytics_events');
  }
};
