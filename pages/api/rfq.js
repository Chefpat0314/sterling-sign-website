// pages/api/rfq.js
// Forwards fallback RFQ submissions to HubSpot Forms Submissions API.

export const config = {
  api: { bodyParser: false }, // we'll parse urlencoded manually
};

async function readRawBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw;
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, cur) => {
    const [k, v] = cur.split('=');
    if (!k) return acc;
    acc[k.trim()] = decodeURIComponent((v || '').trim());
    return acc;
  }, {});
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const raw = await readRawBody(req);
    const ct = (req.headers['content-type'] || '').toLowerCase();

    // Parse form-urlencoded or JSON
    let data = {};
    if (ct.includes('application/json')) {
      data = JSON.parse(raw || '{}');
    } else {
      const params = new URLSearchParams(raw);
      for (const [k, v] of params) data[k] = v;
    }

    // Honeypot — silently "succeed" if bot filled it
    if (data.company_website) {
      res.setHeader('Location', '/request-a-quote?success=1');
      return res.status(303).end();
    }

    // Extract fields
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const details = String(data.details || '').trim();
    const rfq_source = String(data.rfq_source || 'direct').trim();

    if (!name || !email) {
      res.setHeader('Location', '/request-a-quote?error=missing');
      return res.status(303).end();
    }

    // ---- Submit to HubSpot Forms API ----
    const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
    const formId   = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

    if (portalId && formId) {
      try {
        const cookies = parseCookies(req.headers.cookie || '');
        const hutk = cookies.hubspotutk;

        // Field names must match your HubSpot property internal names
        const payload = {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: name }, // single "name" -> firstname
            { name: 'phone', value: phone },
            { name: 'message', value: details },
            { name: 'rfq_source', value: rfq_source }, // add this hidden field to your form
          ],
          context: {
            hutk: hutk || undefined,
            pageUri: `${req.headers.origin || ''}/request-a-quote`,
            pageName: 'Request a Quote',
            ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
          },
        };

        const hsRes = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
        );

        const hsText = await hsRes.text();
        if (!hsRes.ok) {
          console.error('HubSpot submission failed:', hsRes.status, hsText);
        } else {
          console.log('HubSpot submission ok:', hsRes.status, hsText);
        }
      } catch (e) {
        console.warn('HubSpot forward error (continuing):', e?.message);
      }
    } else {
      console.warn('HubSpot env not set — skipping HS forward');
    }

    // Redirect back with success banner
    res.setHeader('Location', '/request-a-quote?success=1');
    return res.status(303).end();
  } catch (err) {
    console.error('RFQ API error:', err);
    res.setHeader('Location', '/request-a-quote?error=1');
    return res.status(303).end();
  }
}
