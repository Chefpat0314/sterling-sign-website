/**
 * Forecast Run API Endpoint
 * 
 * POST trigger for forecast pipeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { PredictionPipeline } from '../../../../lib/forecast/predict';
import { checkAlerts } from '../../../../lib/forecast/alerts';
import { FLAGS } from '../../../../config/featureFlags';

export async function POST(req: NextRequest) {
  // Check if forecasting is enabled
  if (!FLAGS.ADVANCED_ANALYTICS) {
    return NextResponse.json({
      error: 'Advanced analytics disabled',
      message: 'Forecasting features are not enabled',
    }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { persona, horizons = ['14d', '30d', '60d'] } = body;

    if (!persona) {
      return NextResponse.json({
        error: 'Missing required parameter',
        message: 'Persona is required',
      }, { status: 400 });
    }

    // Validate persona
    const validPersonas = ['contractor', 'property_manager', 'logistics', 'healthcare', 'smb'];
    if (!validPersonas.includes(persona)) {
      return NextResponse.json({
        error: 'Invalid persona',
        message: `Persona must be one of: ${validPersonas.join(', ')}`,
      }, { status: 400 });
    }

    // Validate horizons
    const validHorizons = ['14d', '30d', '60d'];
    const invalidHorizons = horizons.filter(h => !validHorizons.includes(h));
    if (invalidHorizons.length > 0) {
      return NextResponse.json({
        error: 'Invalid horizons',
        message: `Horizons must be one of: ${validHorizons.join(', ')}`,
      }, { status: 400 });
    }

    // Generate forecast
    const pipeline = new PredictionPipeline();
    const forecast = await pipeline.generateForecast(persona, horizons);

    // Check alerts
    const alerts = await checkAlerts(forecast);

    // Return forecast with alerts
    return NextResponse.json({
      ...forecast,
      alerts: {
        triggered: alerts.triggered,
        actions: alerts.actions,
        creatorCheck: alerts.creatorCheck,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error in forecast run API:', error);
    
    return NextResponse.json({
      error: 'Forecast generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Forecast Run API',
    description: 'POST to generate forecasts',
    parameters: {
      persona: 'contractor | property_manager | logistics | healthcare | smb',
      horizons: '14d | 30d | 60d (array)',
    },
    example: {
      persona: 'contractor',
      horizons: ['14d', '30d', '60d'],
    },
  }, { status: 200 });
}
