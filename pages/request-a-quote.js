// pages/request-a-quote.js
import { useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';

const HUBSPOT_REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION;
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

const PRODUCT_LABELS = {
  '13oz-vinyl-banner': '13oz Vinyl Banner',
  'aluminum-sign': 'Aluminum Sign',
  'door-hours-vinyl': 'Door Hours Decal',
  banners_13oz: '13oz Vinyl Banner',
  aluminum_040: '.040 Aluminum Sign',
  door_hours_cut_vinyl: 'Door Hours (Cut Vinyl)',
};

function loadScriptOnce(src) {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load HubSpot script"));
    document.head.appendChild(s);
  });
}

function createHubspotForm(targetSelector) {
  const hbspt = window.hbspt;
  if (!hbspt || !hbspt.forms || !HUBSPOT_REGION || !HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_ID) return;

  hbspt.forms.create({
    region: HUBSPOT_REGION,
    portalId: HUBSPOT_PORTAL_ID,
    formId: HUBSPOT_FORM_ID,
    target: targetSelector,
    onFormReady: function ($form) {
      const p = new URLSearchParams(window.location.search);
      
      // Map URL parameters to form fields
      const fieldMap = {
        firstname: "name",
        email: "email",
        phone: "phone",
        company: "company",
        product: "product",
        size: "size",
        notes: "notes",
        message: "notes"
      };
      
      // Pre-fill form fields from URL parameters
      Object.entries(fieldMap).forEach(([field, param]) => {
        const val = p.get(param);
        if (val) {
          const input = $form.find(`[name="${field}"]`);
          if (input.length) {
            input.val(decodeURIComponent(val));
          }
        }
      });
      
      // Handle UTM and tracking parameters
      const trackingFields = [
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "rfq_source", "referrer", "landing_page"
      ];
      
      trackingFields.forEach((param) => {
        const val = p.get(param);
        if (val) {
          const input = $form.find(`[name="${param}"]`);
          if (input.length) {
            input.val(decodeURIComponent(val));
          } else {
            // Create hidden field if it doesn't exist
            $form.append(`<input type="hidden" name="${param}" value="${decodeURIComponent(val)}" />`);
          }
        }
      });
      
      // Set default source if not provided
      if (!p.get("rfq_source")) {
        const existingSource = $form.find('[name="rfq_source"]');
        if (existingSource.length) {
          existingSource.val("website");
        } else {
          $form.append('<input type="hidden" name="rfq_source" value="website" />');
        }
      }
      
      // Set landing page
      if (!p.get("landing_page")) {
        $form.append(`<input type="hidden" name="landing_page" value="${window.location.href}" />`);
      }
    },
  });
  console.log("Provider selected: hubspot");
}

export default function RequestQuotePage() {
  const router = useRouter();
  const formMounted = useRef(false);
  const hasHubspotConfig =
    !!HUBSPOT_REGION && !!HUBSPOT_PORTAL_ID && !!HUBSPOT_FORM_ID;

  const selectedSlug =
    typeof router.query.product === 'string' ? router.query.product : undefined;
  const selectedName = selectedSlug ? (PRODUCT_LABELS[selectedSlug] || selectedSlug) : '';

  useEffect(() => {
    if (!hasHubspotConfig || formMounted.current) return;

    const init = async () => {
      try {
        await loadScriptOnce("//js.hsforms.net/forms/embed/v2.js");
        createHubspotForm("#hubspot-form");
        formMounted.current = true;
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [hasHubspotConfig]);

  if (!hasHubspotConfig) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Request a Quote</h1>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
          <strong>Form configuration needed</strong><br />
          Add NEXT_PUBLIC_HUBSPOT_REGION, NEXT_PUBLIC_HUBSPOT_PORTAL_ID, NEXT_PUBLIC_HUBSPOT_FORM_ID to your environment, then restart the dev server.
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Request a Quote – Sterling Sign Solutions</title>
        <meta
          name="description"
          content="Tell us about your project and we'll follow up with pricing and next steps."
        />
        <link rel="canonical" href="http://localhost:3000/request-a-quote" />
      </Head>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold">Request a Quote</h1>

        {selectedName && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Selected: <strong className="font-semibold">{selectedName}</strong>
              <button
                type="button"
                aria-label="Clear selected product"
                className="ml-1 rounded-full px-2 leading-none hover:bg-blue-100"
                onClick={() => router.push('/request-a-quote')}
              >
                ×
              </button>
            </span>
          </div>
        )}

        <p className="mt-6 text-gray-600">
          Share a few details and our team will reach out with pricing and next steps.
        </p>

        <div id="hubspot-form" className="mt-6" />
        
        {/* Noscript fallback */}
        <noscript>
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">JavaScript Required</h3>
            <p className="text-blue-800 mb-4">
              This form requires JavaScript to function properly. Please enable JavaScript in your browser or contact us directly.
            </p>
            <div className="space-y-2 text-blue-700">
              <p><strong>Phone:</strong> <a href="tel:+1234567890" className="hover:underline">(123) 456-7890</a></p>
              <p><strong>Email:</strong> <a href="mailto:info@sterlingsignsolutions.com" className="hover:underline">info@sterlingsignsolutions.com</a></p>
            </div>
          </div>
        </noscript>
      </div>
    </>
  );
}
