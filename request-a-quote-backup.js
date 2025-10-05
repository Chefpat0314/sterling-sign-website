// pages/request-a-quote.js
import { useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';

const HUBSPOT_REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION;
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

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
      const map = {
        firstname: "name",
        email: "email",
        phone: "phone",
        company: "company",
        product: "product",
        size: "size",
        notes: "notes",
      };
      Object.entries(map).forEach(([field, param]) => {
        const val = p.get(param);
        if (val) $form.find(`[name="${field}"]`).val(val);
      });
      ["utm_source", "utm_medium", "utm_campaign", "rfq_source"].forEach((h) => {
        const v = p.get(h);
        if (v) $form.find(`[name="${h}"]`).val(v);
      });
    },
  });
  console.log("Provider selected: hubspot");
}

export default function RequestAQuotePage() {
  const router = useRouter();
  const formMounted = useRef(false);
  const hasHubspotConfig =
    !!HUBSPOT_REGION && !!HUBSPOT_PORTAL_ID && !!HUBSPOT_FORM_ID;

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
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Request a Quote</h1>
      <div id="hubspot-form" />
    </div>
  );
}
