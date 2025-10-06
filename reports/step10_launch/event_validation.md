# Event Data Integrity Validation

**Generated:** 2025-10-06T01:50:29.795Z

## 📊 Event Definitions

- ✅ **view_product**: ✅ view_product found in metrics.ts
- ✅ **configure_change**: ✅ configure_change found in metrics.ts
- ❌ **checkout_complete**: ❌ checkout_complete not found in metrics.ts
- ✅ **reorder_click**: ✅ reorder_click found in metrics.ts
- ✅ **proof_approve**: ✅ proof_approve found in metrics.ts
- ❌ **session_start**: ❌ session_start not found in metrics.ts
- ❌ **form_submit**: ❌ form_submit not found in metrics.ts
- ❌ **email_signup**: ❌ email_signup not found in metrics.ts

## 🔗 Analytics Integrations

- ⚠️ **GA4**: ⚠️  GA4 integration not found
- ⚠️ **Segment**: ⚠️  Segment integration not found
- ⚠️ **PostHog**: ⚠️  PostHog integration not found
- ✅ **HubSpot**: ✅ HubSpot integration found
- ⚠️ **Klaviyo**: ⚠️  Klaviyo integration not found

## 📈 Data Integrity Checks

- ✅ **UTM Capture**: ✅ UTM parameters captured in analytics
- ✅ **Session Tracking**: ✅ Session ID generation and tracking
- ✅ **User Identification**: ✅ User ID and anonymous ID tracking
- ✅ **Conversion Funnel**: ✅ Product view → Configure → Checkout → Complete

## 🧠 VBOD Insights

**Analytics setup incomplete.** Missing event definitions or disconnected integrations will impact data quality and business intelligence. Immediate attention required for complete analytics coverage.

## 🔧 Recommended Actions

1. **Complete event definitions** - Add missing events
2. **Connect integrations** - Ensure data flow
3. **Test analytics** - Verify event firing
4. **Re-run validation** - Confirm completeness

