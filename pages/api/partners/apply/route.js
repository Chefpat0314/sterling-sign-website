import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const applicationData = {
      ...req.body,
      submittedAt: new Date().toISOString(),
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'step11');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file (non-destructive, no DB schema changes)
    const filePath = path.join(dataDir, 'partner_applications.json');
    
    let applications = [];
    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, 'utf8');
      applications = JSON.parse(existingData);
    }

    applications.push(applicationData);
    fs.writeFileSync(filePath, JSON.stringify(applications, null, 2));

    // Log to routing logs for monitoring
    const logDir = path.join(dataDir, 'routing_logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'partner_application',
      applicationId: applicationData.id,
      companyName: applicationData.companyName,
      serviceAreas: applicationData.serviceAreas,
      status: 'logged'
    };

    const logFile = path.join(logDir, `partner_${new Date().toISOString().split('T')[0]}.json`);
    let logs = [];
    if (fs.existsSync(logFile)) {
      const existingLogs = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    // Feature flag: HubSpot integration (optional)
    if (process.env.STEP11_ROUTING_ENABLED === 'true' && process.env.HUBSPOT_WEBHOOK_URL) {
      try {
        // Send to HubSpot webhook (non-blocking)
        fetch(process.env.HUBSPOT_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formId: 'partner_application',
            fields: applicationData,
            context: {
              pageUrl: req.headers.referer,
              userAgent: req.headers['user-agent'],
              timestamp: new Date().toISOString()
            }
          })
        }).catch(error => {
          console.error('HubSpot webhook failed:', error);
          // Log error but don't fail the request
        });
      } catch (error) {
        console.error('HubSpot integration error:', error);
      }
    }

    // Analytics event (non-breaking)
    if (typeof window !== 'undefined' && window.analytics) {
      try {
        window.analytics.track('installer_signup', {
          company: applicationData.companyName,
          metros: applicationData.serviceAreas,
          specialties: applicationData.specialties,
          insured: applicationData.insured,
          bonded: applicationData.bonded,
          source: 'partner_application_form'
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    }

    res.status(200).json({ 
      success: true, 
      applicationId: applicationData.id,
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing partner application:', error);
    
    // Log error to routing logs
    const logDir = path.join(process.cwd(), 'data', 'step11', 'routing_logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const errorLog = {
      timestamp: new Date().toISOString(),
      type: 'partner_application_error',
      error: error.message,
      stack: error.stack,
      body: req.body
    };

    const errorFile = path.join(logDir, `errors_${new Date().toISOString().split('T')[0]}.json`);
    let errorLogs = [];
    if (fs.existsSync(errorFile)) {
      const existingErrors = fs.readFileSync(errorFile, 'utf8');
      errorLogs = JSON.parse(existingErrors);
    }
    errorLogs.push(errorLog);
    fs.writeFileSync(errorFile, JSON.stringify(errorLogs, null, 2));

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process application' 
    });
  }
}
