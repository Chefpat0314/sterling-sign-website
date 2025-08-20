// pages/request-a-quote.js
import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react'

// Region-aware script host (uses your NEXT_PUBLIC_HUBSPOT_REGION)
const REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION || 'na2'
const HS_SRC_MAP = {
  na1: 'https://js.hsforms.net/forms/v2.js',
  na2: 'https://js-na2.hsforms.net/forms/v2.js',
  eu1: 'https://js-eu1.hsforms.net/forms/v2.js',
  ap1: 'https://js-ap1.hsforms.net/forms/v2.js',
}
const HS_SRC = HS_SRC_MAP[REGION] || HS_SRC_MAP.na1

export default function RequestAQuote() {
  // success banner after fallback form POST → /request-a-quote?success=1
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      if (p.get('success') === '1') setSuccess(true)
    }
  }, [])

  // Render a simple internal form if HubSpot is unavailable
  const renderFallback = () => {
    const mount = document.getElementById('hs-form')
    if (!mount) return
    const params = new URLSearchParams(window.location.search)
    const src = params.get('source') || 'direct'
    mount.innerHTML = `
      <form class="grid gap-4" action="/api/rfq" method="post">
        <input class="border p-3 rounded" name="name" placeholder="Your Name" required />
        <input class="border p-3 rounded" type="email" name="email" placeholder="Email" required />
        <input class="border p-3 rounded" name="phone" placeholder="Phone" />
        <textarea class="border p-3 rounded" name="details" rows="5" placeholder="Tell us about your project…"></textarea>
        <input type="hidden" name="rfq_source" value="${src}" />
        <input type="text" name="company_website" style="display:none" tabindex="-1" autocomplete="off" />
        <button class="bg-amber-400 text-black font-semibold px-4 py-2 rounded hover:bg-amber-500 hover:text-white">
          Send
        </button>
      </form>`
  }

  // Try to mount HubSpot form; if anything fails, fall back
  const createHubspotForm = () => {
    try {
      if (window.__rfqMounted) return
      const h = window.hbspt
      if (!h || !h.forms || !h.forms.create) {
        console.warn('HubSpot not available; using fallback.')
        renderFallback()
        return
      }
      window.__rfqMounted = true // avoid duplicate mounts during HMR

      h.forms.create({
        region: REGION, // must match your HubSpot account (e.g., 'na2')
        portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
        formId: process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID,
        target: '#hs-form',
        onFormReady: ($form) => {
          const formEl = $form?.get ? $form.get(0) : $form || document.querySelector('#hs-form form')
          if (formEl) {
            const hidden = document.createElement('input')
            hidden.type = 'hidden'
            hidden.name = 'rfq_source'
            hidden.value = new URLSearchParams(window.location.search).get('source') || 'direct'
            formEl.appendChild(hidden)
          }
        }
      })

      // Safety net—if nothing rendered after 2s, show fallback
      setTimeout(() => {
        const mount = document.getElementById('hs-form')
        if (mount && mount.innerHTML.trim() === '') renderFallback()
      }, 2000)
    } catch (e) {
      console.error('HubSpot form error:', e)
      renderFallback()
    }
  }

  return (
    <>
      <Head>
        <title>Request a Quote — Sterling Sign Solutions</title>
        <meta name="description" content="Tell us about your signage project and we’ll reply fast." />
      </Head>

      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Request a Quote</h1>
          <p className="text-center text-gray-600 mb-8">
            Tell us about your project—size, location, timeline—and we’ll get right back to you.
          </p>

          {/* Success banner after fallback submit */}
          {success && (
            <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">
              Thanks! We received your request and will reach out shortly.
            </div>
          )}

          {/* HubSpot mount target */}
          <div id="hs-form" className="bg-white rounded-xl shadow-2xl p-6"></div>

          {/* Load region-specific HubSpot script and mount the form */}
          <Script
            id="hs-forms"
            src={HS_SRC}
            strategy="afterInteractive"
            onLoad={createHubspotForm}
            onError={() => {
              console.warn('Failed to load HubSpot script; using fallback.')
              renderFallback()
            }}
          />

          <noscript>
            Please enable JavaScript to use the form, or email us at{' '}
            <a href="mailto:info@sterlingsignsolutions.com">info@sterlingsignsolutions.com</a>.
          </noscript>
        </div>
      </section>
    </>
  )
}
