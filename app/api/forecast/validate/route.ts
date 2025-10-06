/**
 * Forecast Validation API Endpoint
 * 
 * Daily validation job for forecast accuracy
 */

import { NextRequest, NextResponse } from 'next/server';
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
    const { date, persona, actualRevenue } = body;

    if (!date || !persona || actualRevenue === undefined) {
      return NextResponse.json({
        error: 'Missing required parameters',
        message: 'date, persona, and actualRevenue are required',
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

    // Validate date
    const validationDate = new Date(date);
    if (isNaN(validationDate.getTime())) {
      return NextResponse.json({
        error: 'Invalid date',
        message: 'Date must be a valid ISO date string',
      }, { status: 400 });
    }

    // Validate actual revenue
    if (typeof actualRevenue !== 'number' || actualRevenue < 0) {
      return NextResponse.json({
        error: 'Invalid actual revenue',
        message: 'Actual revenue must be a non-negative number',
      }, { status: 400 });
    }

    // Perform validation
    const validation = await performValidation(date, persona, actualRevenue);

    // Store validation results
    await storeValidationResults(validation);

    return NextResponse.json({
      success: true,
      validation,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('Error in forecast validation API:', error);
    
    return NextResponse.json({
      error: 'Validation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Forecast Validation API',
    description: 'POST to validate forecast accuracy',
    parameters: {
      date: 'ISO date string (e.g., 2024-01-01)',
      persona: 'contractor | property_manager | logistics | healthcare | smb',
      actualRevenue: 'number (actual revenue for the date)',
    },
    example: {
      date: '2024-01-01',
      persona: 'contractor',
      actualRevenue: 5000,
    },
  }, { status: 200 });
}

/**
 * Perform forecast validation
 */
async function performValidation(
  date: string,
  persona: string,
  actualRevenue: number
): Promise<{
  date: string;
  persona: string;
  actualRevenue: number;
  predictedRevenue: number;
  error: number;
  errorPercentage: number;
  withinConfidence: boolean;
  mape: number;
  rmse: number;
  mae: number;
  r2: number;
}> {
  // TODO: Replace with actual forecast retrieval
  // For now, use mock data
  const predictedRevenue = actualRevenue * (0.9 + Math.random() * 0.2); // ±10% variation
  
  const error = actualRevenue - predictedRevenue;
  const errorPercentage = Math.abs(error) / actualRevenue * 100;
  
  // Mock confidence interval (80%)
  const confidenceMargin = predictedRevenue * 0.2;
  const withinConfidence = Math.abs(error) <= confidenceMargin;
  
  // Calculate metrics
  const mape = errorPercentage;
  const rmse = Math.abs(error);
  const mae = Math.abs(error);
  const r2 = 1 - (Math.pow(error, 2) / Math.pow(actualRevenue, 2));
  
  return {
    date,
    persona,
    actualRevenue,
    predictedRevenue,
    error,
    errorPercentage,
    withinConfidence,
    mape,
    rmse,
    mae,
    r2,
  };
}

/**
 * Store validation results
 */
async function storeValidationResults(validation: any): Promise<void> {
  // TODO: Implement actual storage
  // For now, just log the results
  console.log('Validation results stored:', {
    date: validation.date,
    persona: validation.persona,
    accuracy: validation.withinConfidence ? 'PASS' : 'FAIL',
    errorPercentage: validation.errorPercentage.toFixed(2) + '%',
  });
}

/**
 * Get validation summary
 */
export async function getValidationSummary(): Promise<{
  totalValidations: number;
  passedValidations: number;
  averageError: number;
  accuracyRate: number;
  lastValidation: string;
}> {
  // TODO: Replace with actual data retrieval
  return {
    totalValidations: 30,
    passedValidations: 25,
    averageError: 8.5,
    accuracyRate: 83.3,
    lastValidation: new Date().toISOString(),
  };
}
