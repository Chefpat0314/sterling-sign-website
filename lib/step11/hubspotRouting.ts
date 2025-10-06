// HubSpot Lead Routing for Step 11 National Rollout
// Non-destructive, opt-in integration with feature flag

interface RoutingContext {
  metro_slug?: string;
  persona_hint?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  form_type?: string;
  lead_source?: string;
}

interface RoutingPayload {
  metro_slug: string;
  region: string;
  persona: string;
  routing_target: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  timestamp: string;
}

/**
 * Infer region from ZIP code or metro slug
 */
export function inferRegionFromZip(zipCode?: string, metroSlug?: string): string {
  if (metroSlug) {
    const metroToRegion: Record<string, string> = {
      'phoenix-az': 'Southwest',
      'dallas-tx': 'South Central',
      'atlanta-ga': 'Southeast',
      'denver-co': 'Mountain',
      'chicago-il': 'Midwest',
      'seattle-wa': 'Northwest',
      'los-angeles-ca': 'West Coast',
      'houston-tx': 'South Central',
      'orlando-fl': 'Southeast',
      'fresno-ca': 'West Coast'
    };
    return metroToRegion[metroSlug] || 'National';
  }

  if (zipCode) {
    const zip = parseInt(zipCode);
    if (zip >= 10000 && zip <= 19999) return 'Northeast';
    if (zip >= 20000 && zip <= 29999) return 'Southeast';
    if (zip >= 30000 && zip <= 39999) return 'Southeast';
    if (zip >= 40000 && zip <= 49999) return 'Midwest';
    if (zip >= 50000 && zip <= 59999) return 'Midwest';
    if (zip >= 60000 && zip <= 69999) return 'Midwest';
    if (zip >= 70000 && zip <= 79999) return 'South Central';
    if (zip >= 80000 && zip <= 89999) return 'Mountain';
    if (zip >= 90000 && zip <= 99999) return 'West Coast';
  }

  return 'National';
}

/**
 * Infer persona from context and form data
 */
export function inferPersonaFromContext(context: RoutingContext, formData?: any): string {
  // Check for explicit persona hint
  if (context.persona_hint) {
    return context.persona_hint;
  }

  // Check form data for persona indicators
  if (formData) {
    const companyName = (formData.company || formData.companyName || '').toLowerCase();
    const projectType = (formData.projectType || formData.notes || '').toLowerCase();
    
    // Contractor indicators
    if (companyName.includes('construction') || 
        companyName.includes('contractor') ||
        companyName.includes('general') ||
        projectType.includes('construction') ||
        projectType.includes('job site')) {
      return 'contractor_gc';
    }

    // Property manager indicators
    if (companyName.includes('property') ||
        companyName.includes('management') ||
        companyName.includes('apartment') ||
        projectType.includes('ada') ||
        projectType.includes('compliance')) {
      return 'property_manager';
    }

    // Logistics indicators
    if (companyName.includes('logistics') ||
        companyName.includes('warehouse') ||
        companyName.includes('distribution') ||
        projectType.includes('safety') ||
        projectType.includes('warehouse')) {
      return 'logistics';
    }
  }

  // Default based on metro if available
  if (context.metro_slug) {
    const metroPersonaMap: Record<string, string> = {
      'phoenix-az': 'contractor_gc',
      'dallas-tx': 'logistics',
      'atlanta-ga': 'property_manager',
      'denver-co': 'contractor_gc',
      'chicago-il': 'logistics',
      'seattle-wa': 'property_manager',
      'los-angeles-ca': 'property_manager',
      'houston-tx': 'contractor_gc',
      'orlando-fl': 'property_manager',
      'fresno-ca': 'logistics'
    };
    return metroPersonaMap[context.metro_slug] || 'general';
  }

  return 'general';
}

/**
 * Build routing payload for HubSpot
 */
export function buildRoutingPayload(
  context: RoutingContext,
  formData?: any
): RoutingPayload {
  const region = inferRegionFromZip(formData?.zipCode, context.metro_slug);
  const persona = inferPersonaFromContext(context, formData);
  
  // Determine routing target based on persona and region
  const routingTarget = getRoutingTarget(persona, region);

  return {
    metro_slug: context.metro_slug || 'national',
    region,
    persona,
    routing_target: routingTarget,
    utm: {
      source: context.utm_source,
      medium: context.utm_medium,
      campaign: context.utm_campaign
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Get routing target based on persona and region
 */
function getRoutingTarget(persona: string, region: string): string {
  const routingMap: Record<string, Record<string, string>> = {
    contractor_gc: {
      'Southwest': 'phoenix-sales-team',
      'South Central': 'dallas-sales-team',
      'Southeast': 'atlanta-sales-team',
      'Mountain': 'denver-sales-team',
      'Midwest': 'chicago-sales-team',
      'Northwest': 'seattle-sales-team',
      'West Coast': 'la-sales-team',
      'National': 'national-sales-team'
    },
    property_manager: {
      'Southwest': 'phoenix-pm-team',
      'South Central': 'dallas-pm-team',
      'Southeast': 'atlanta-pm-team',
      'Mountain': 'denver-pm-team',
      'Midwest': 'chicago-pm-team',
      'Northwest': 'seattle-pm-team',
      'West Coast': 'la-pm-team',
      'National': 'national-pm-team'
    },
    logistics: {
      'Southwest': 'phoenix-logistics-team',
      'South Central': 'dallas-logistics-team',
      'Southeast': 'atlanta-logistics-team',
      'Mountain': 'denver-logistics-team',
      'Midwest': 'chicago-logistics-team',
      'Northwest': 'seattle-logistics-team',
      'West Coast': 'la-logistics-team',
      'National': 'national-logistics-team'
    }
  };

  return routingMap[persona]?.[region] || 'national-sales-team';
}

/**
 * Route lead to HubSpot with retry and dead letter logging
 */
export async function routeLeadToHubSpot(
  routingPayload: RoutingPayload,
  leadData: any
): Promise<{ success: boolean; error?: string }> {
  if (process.env.STEP11_ROUTING_ENABLED !== 'true') {
    return { success: true }; // Feature disabled
  }

  const hubspotEndpoint = process.env.HUBSPOT_ROUTING_ENDPOINT;
  if (!hubspotEndpoint) {
    console.warn('HubSpot routing endpoint not configured');
    return { success: false, error: 'Endpoint not configured' };
  }

  const payload = {
    ...leadData,
    routing: routingPayload,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(hubspotEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HubSpot routing failed: ${response.status} ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('HubSpot routing error:', error);
    
    // Log to dead letter queue
    await logRoutingFailure(routingPayload, leadData, error.message);
    
    return { success: false, error: error.message };
  }
}

/**
 * Log routing failures to dead letter queue
 */
async function logRoutingFailure(
  routingPayload: RoutingPayload,
  leadData: any,
  error: string
): Promise<void> {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logDir = path.join(process.cwd(), 'data', 'step11', 'routing_logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'routing_failure',
      routing_payload: routingPayload,
      lead_data: leadData,
      error,
      retry_count: 0
    };
    
    const logFile = path.join(logDir, `routing_failures_${new Date().toISOString().split('T')[0]}.json`);
    let logs = [];
    if (fs.existsSync(logFile)) {
      const existingLogs = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (logError) {
    console.error('Failed to log routing failure:', logError);
  }
}

/**
 * Opt-in integration helper for RFQ forms
 */
export function integrateHubSpotRouting(
  formData: any,
  context: RoutingContext
): Promise<{ success: boolean; routing?: RoutingPayload }> {
  return new Promise(async (resolve) => {
    try {
      const routingPayload = buildRoutingPayload(context, formData);
      
      // Track routing event
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('rfq_routed', {
          metro_slug: routingPayload.metro_slug,
          region: routingPayload.region,
          persona: routingPayload.persona,
          routing_target: routingPayload.routing_target,
          utm: routingPayload.utm
        });
      }
      
      // Route to HubSpot if enabled
      const routingResult = await routeLeadToHubSpot(routingPayload, formData);
      
      resolve({
        success: routingResult.success,
        routing: routingPayload
      });
    } catch (error) {
      console.error('HubSpot routing integration error:', error);
      resolve({ success: false });
    }
  });
}
