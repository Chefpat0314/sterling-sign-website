import { NextApiRequest, NextApiResponse } from 'next';

interface RFQFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  size?: string;
  notes: string;
}

interface RFQResponse {
  ok: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RFQResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Check if Resend is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  const destEmail = process.env.RFQ_DEST_EMAIL;

  if (!resendApiKey || !destEmail) {
    return res.status(500).json({ 
      ok: false, 
      error: 'Resend not configured. Please set RESEND_API_KEY and RFQ_DEST_EMAIL.' 
    });
  }

  try {
    // Parse and validate form data
    const formData: RFQFormData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.notes) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, and notes are required.'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address.'
      });
    }

    // Prepare email content
    const subject = `New RFQ Request from ${formData.name}`;
    const htmlContent = `
      <h2>New RFQ Request</h2>
      <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
      ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
      ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
      ${formData.product ? `<p><strong>Product:</strong> ${formData.product}</p>` : ''}
      ${formData.size ? `<p><strong>Size:</strong> ${formData.size}</p>` : ''}
      
      <h3>Project Details:</h3>
      <p>${formData.notes.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Submitted via Sterling Sign Solutions website</small></p>
    `;

    const textContent = `
New RFQ Request

From: ${formData.name} (${formData.email})
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.company ? `Company: ${formData.company}` : ''}
${formData.product ? `Product: ${formData.product}` : ''}
${formData.size ? `Size: ${formData.size}` : ''}

Project Details:
${formData.notes}

---
Submitted via Sterling Sign Solutions website
    `;

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sterling Sign Solutions <noreply@sterlingsignsolutions.com>',
        to: [destEmail],
        reply_to: formData.email,
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return res.status(500).json({
        ok: false,
        error: 'Failed to send email. Please try again later.'
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('RFQ API error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
