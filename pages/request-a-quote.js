// pages/request-a-quote.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const PRODUCT_LABELS = {
  banners_13oz: '13oz Vinyl Banner',
  aluminum_040: '.040 Aluminum Sign',
  door_hours_cut_vinyl: 'Door Hours (Cut Vinyl)',
};

export default function RequestQuotePage() {
  const router = useRouter();
  const selectedSlug =
    typeof router.query.product === 'string' ? router.query.product : undefined;
  const selectedName = selectedSlug ? (PRODUCT_LABELS[selectedSlug] || selectedSlug) : '';

  // Load HubSpot script and render the form once
  useEffect(() => {
    const renderForm = () => {
      if (!window.hbspt) return;

      window.hbspt.forms.create({
        region: process.env.NEXT_PUBLIC_HUBSPOT_REGION || 'na1',
        portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
        formId: process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID,
        target: '#hubspot-form',
        onFormReady: () => {
          const formEl = document.querySelector('#hubspot-form form');
          if (!formEl) return;

          const addHidden = (name, value) => {
            let el = formEl.querySelector(`input[name="${name}"]`);
            if (!el) {
              el = document.createElement('input');
              el.type = 'hidden';
              el.name = name;
              formEl.appendChild(el);
            }
            el.value = value || '';
          };

          // selected product (human friendly)
          addHidden('selected_product', selectedName);

          // common UTM params
          const qs = new URLSearchParams(window.location.search);
          addHidden('utm_source', qs.get('utm_source'));
          addHidden('utm_medium', qs.get('utm_medium'));
          addHidden('utm_campaign', qs.get('utm_campaign'));
          addHidden('utm_term', qs.get('utm_term'));
        },
      });
    };

    if (document.getElementById('hs-form-script')) {
      renderForm();
      return;
    }

    const s = document.createElement('script');
    s.id = 'hs-form-script';
    s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.async = true;
    s.onload = renderForm;
    document.body.appendChild(s);
  }, []); // mount only

  // Update hidden field if ?product= changes while on the page
  useEffect(() => {
    const formEl = document.querySelector('#hubspot-form form');
    if (!formEl) return;
    const existing = formEl.querySelector('input[name="selected_product"]');
    if (existing) existing.value = selectedName || '';
  }, [selectedName]);

  return (
    <>
      <Head>
        <title>Request a Quote – Sterling Sign Solutions</title>
        <meta
          name="description"
          content="Tell us about your project and we’ll follow up with pricing and next steps."
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
      </div>
    </>
  );
}
