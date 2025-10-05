/**
 * RFQ Provider Detection and Configuration
 * Inspects environment variables to determine which RFQ provider to use
 */

export type RFQProvider = 
  | { type: 'hubspot'; embed?: string; region?: string; portalId?: string; formId?: string }
  | { type: 'resend' }
  | { type: 'web3forms'; key: string }
  | { type: 'basin'; endpoint: string }
  | { type: 'none' };

/**
 * Determines the active RFQ provider based on environment variables
 * Priority: HubSpot → Resend → Web3Forms → Basin → None
 * Formspree is disabled - prefer HubSpot script mode
 */
export function getRFQProvider(): RFQProvider {
  // HubSpot (preferred) - check for embed first, then script mode
  const hubspotEmbed = process.env.NEXT_PUBLIC_HUBSPOT_FORM_EMBED || process.env.HUBSPOT_FORM_EMBED;
  const hubspotRegion = process.env.NEXT_PUBLIC_HUBSPOT_REGION || process.env.HUBSPOT_REGION;
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || process.env.HUBSPOT_PORTAL_ID;
  const hubspotFormId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || process.env.HUBSPOT_FORM_ID;

  if (hubspotEmbed || (hubspotPortalId && hubspotFormId && hubspotFormId !== 'YOUR_FORM_ID_HERE')) {
    return {
      type: 'hubspot',
      embed: hubspotEmbed,
      region: hubspotRegion,
      portalId: hubspotPortalId,
      formId: hubspotFormId
    };
  }

  // Resend (server-side email)
  // Note: We only check for RFQ_DEST_EMAIL on client since RESEND_API_KEY is server-only
  const rfqDestEmail = process.env.NEXT_PUBLIC_RFQ_DEST_EMAIL || process.env.RFQ_DEST_EMAIL;
  if (rfqDestEmail) {
    return { type: 'resend' };
  }

  // Web3Forms (client-safe)
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    return { type: 'web3forms', key: web3formsKey };
  }

  // Basin (client-safe)
  const basinEndpoint = process.env.NEXT_PUBLIC_BASIN_ENDPOINT || process.env.BASIN_ENDPOINT;
  if (basinEndpoint) {
    return { type: 'basin', endpoint: basinEndpoint };
  }

  // No provider configured
  return { type: 'none' };
}

/**
 * Client-side version that only reads NEXT_PUBLIC_ prefixed variables
 * Used in browser environments where server-only env vars aren't available
 */
export function getRFQProviderClient(): RFQProvider {
  // HubSpot
  const hubspotEmbed = process.env.NEXT_PUBLIC_HUBSPOT_FORM_EMBED;
  const hubspotRegion = process.env.NEXT_PUBLIC_HUBSPOT_REGION;
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const hubspotFormId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

  if (hubspotEmbed || (hubspotPortalId && hubspotFormId && hubspotFormId !== 'YOUR_FORM_ID_HERE')) {
    return {
      type: 'hubspot',
      embed: hubspotEmbed,
      region: hubspotRegion,
      portalId: hubspotPortalId,
      formId: hubspotFormId
    };
  }

  // Resend (check for destination email)
  const rfqDestEmail = process.env.NEXT_PUBLIC_RFQ_DEST_EMAIL;
  if (rfqDestEmail) {
    return { type: 'resend' };
  }

  // Web3Forms
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    return { type: 'web3forms', key: web3formsKey };
  }

  // Basin
  const basinEndpoint = process.env.NEXT_PUBLIC_BASIN_ENDPOINT;
  if (basinEndpoint) {
    return { type: 'basin', endpoint: basinEndpoint };
  }

  return { type: 'none' };
}
