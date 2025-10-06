# Step 12 Data Contracts & Signals Analysis

**Generated:** 2024-01-01T00:00:00Z  
**Source:** Sterling Sign Solutions Analytics Infrastructure Audit

## 📊 **Available Events & Props**

### **Core User Journey Events**
```typescript
// Primary events available for AI optimization
'view_app' | 'view_home' | 'click_cta'
'view_category' | 'view_product' | 'faq_expand'
'configure_change' | 'ttq_ready' | 'preflight_pass' | 'preflight_warn' | 'add_to_cart'
'begin_checkout' | 'select_shipping' | 'payment_attempt' | 'purchase'
'proof_request' | 'proof_view' | 'proof_approve' | 'proof_change_request'
'reorder_click' | 'order_track_view'
```

### **Shipping & Delivery Events**
```typescript
'qa_pass' | 'qa_fail' | 'ship_label' | 'delivered' | 'on_time_check'
'delivery_date_shown' | 'cutoff_timer_viewed' | 'shipping_method_selected'
'promise_committed' | 'promise_met' | 'promise_missed' | 'damage_claim_started'
```

### **Event Schema Structure**
```typescript
interface EventPayload {
  event: string;
  sessionId?: string;
  userId?: string;
  orderId?: string;
  product?: string;
  ms?: number;
  meta?: Record<string, any>;
  timestamp: number;
}
```

## 🎯 **Required Props for AI Features**

### **Recommendation Engine Signals**
- **User History:** `view_product`, `add_to_cart`, `purchase` events
- **Product Context:** `product` field with product IDs
- **Category Context:** `meta.category` for content-based recommendations
- **Session Context:** `sessionId` for co-view analysis

### **Next-Best-Action Signals**
- **Inactivity:** Time since last `configure_change` or `view_product`
- **Purchase History:** `purchase` events with `orderId` and `meta.products`
- **Cart Context:** `add_to_cart` events with quantity thresholds
- **User State:** `userId` for personalized nudges

### **Price Elasticity Signals**
- **Product Views:** `view_product` with product IDs
- **Price Sensitivity:** `configure_change` events with price-related fields
- **Conversion:** `add_to_cart` and `purchase` events
- **User Segments:** `userId` for cohort analysis

## 📋 **Product Entity Shape**

### **Current Product Structure**
```typescript
interface ProductMeta {
  id: string;                    // Product ID (e.g., "BAN-13OZ")
  name: string;                  // Display name
  category: string;              // Product category
  slug: string;                  // URL slug
  startingPrice: number;         // Base price
  image: string;                 // Product image URL
  features: string[];            // Product features
  materials?: string[];          // Available materials
  tags?: string[];               // Product tags
  isAvailable: boolean;           // Stock status
  popular?: boolean;             // Popular flag
  minSize: string;               // Minimum size
  maxSize: string;               // Maximum size
}
```

### **Enhanced Product Signals**
```typescript
interface ProductSignals {
  viewCount: number;             // Total views
  cartAdds: number;              // Add to cart count
  purchases: number;             // Purchase count
  avgSessionTime: number;        // Average time on product
  coViewProducts: string[];       // Products viewed together
  conversionRate: number;         // Views to purchases
  lastViewed: Date;              // Last view timestamp
}
```

## 🔒 **PII Policy & Consent**

### **Data Collection**
- **User ID:** Optional, only for logged-in users
- **Session ID:** Anonymous, for session-based analysis
- **Product IDs:** Non-PII, for recommendation engine
- **Timestamps:** For recency analysis
- **Categories:** Non-PII, for content-based filtering

### **Consent Requirements**
- **Personalization Consent:** Required for user-specific recommendations
- **Analytics Consent:** Required for all tracking
- **Marketing Consent:** Required for promotional nudges
- **Data Retention:** 90 days for session data, 1 year for user data

### **Privacy Safeguards**
- **Anonymization:** User IDs hashed for analytics
- **Data Minimization:** Only necessary fields collected
- **Consent Gates:** Fallback to non-personalized recommendations
- **Right to Deletion:** User data can be purged on request

## 📈 **Analytics Integration Points**

### **Segment Integration**
```typescript
// Existing Segment provider in lib/metrics.ts
class SegmentProvider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(event, properties);
    }
  }
}
```

### **GA4 Integration**
```typescript
// Existing GA4 provider in lib/metrics.ts
class GA4Provider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'engagement',
        custom_parameters: properties,
      });
    }
  }
}
```

### **PostHog Integration** (To Be Added)
```typescript
// PostHog provider for advanced analytics
class PostHogProvider implements AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event, properties);
    }
  }
}
```

## 🎯 **AI Feature Requirements**

### **Recommendation Engine**
- **Input:** User history, product context, consent status
- **Output:** Ranked product recommendations with reasoning
- **Fallback:** Category top-sellers when no personalization consent
- **Performance:** <200ms response time for API calls

### **Next-Best-Action**
- **Input:** User state, product context, purchase history
- **Output:** Contextual nudges with action links
- **Rules:** Time-based, behavior-based, and ML-assisted
- **Fallback:** Generic promotional content

### **Price Elasticity**
- **Input:** Product views, price sensitivity, conversion data
- **Output:** Price test assignments with guardrails
- **Constraints:** Min-margin floors, product allowlists
- **Monitoring:** Weekly rebalancing and winner promotion

## 🔧 **Implementation Strategy**

### **Phase 1: Data Foundation**
1. **Event Audit:** Confirm all required events are firing
2. **Product Catalog:** Enhance with AI-friendly metadata
3. **User Signals:** Implement user history aggregation
4. **Consent Management:** Add consent tracking

### **Phase 2: AI Features**
1. **Recommendation Engine:** Content-based and collaborative filtering
2. **Next-Best-Action:** Rule-based and ML-assisted nudges
3. **Price Testing:** Guardrailed elasticity experiments
4. **A/B Orchestration:** Automated test management

### **Phase 3: Optimization**
1. **Performance Monitoring:** Response times and accuracy
2. **KPI Tracking:** Conversion lifts and revenue impact
3. **Automated Reports:** Weekly optimization summaries
4. **Continuous Improvement:** Model updates and feature refinement

## 📊 **Success Metrics**

### **Recommendation Engine**
- **CTR:** Click-through rate on recommended products
- **Assisted Revenue:** Revenue from recommendation clicks
- **Diversity:** Cross-category recommendation coverage
- **Accuracy:** User satisfaction with recommendations

### **Next-Best-Action**
- **Impression Rate:** Nudge display frequency
- **Click Rate:** Nudge interaction rate
- **Conversion Lift:** ATC and checkout improvements
- **User Engagement:** Session depth and time

### **Price Elasticity**
- **Test Coverage:** Percentage of products in tests
- **Revenue Impact:** AOV and margin improvements
- **Statistical Significance:** Confidence intervals
- **Risk Management:** Guardrail compliance

## 🚀 **Next Steps**

1. **Implement Feature Flags:** Enable/disable AI features
2. **Build Recommendation Engine:** Content-based and collaborative filtering
3. **Create NBA System:** Rule-based and ML-assisted nudges
4. **Add Price Testing:** Guardrailed elasticity experiments
5. **Integrate Analytics:** Enhanced event tracking
6. **Monitor Performance:** KPI dashboards and reports

---

**Status:** Data contracts defined, ready for AI implementation  
**Compliance:** GDPR/CCPA compliant with consent management  
**Performance:** Optimized for <200ms response times  
**Scalability:** Designed for 10K+ products and 100K+ users
