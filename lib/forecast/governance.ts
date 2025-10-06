/**
 * Creator Check Governance
 * 
 * Ethical guardrails for AI models and alerts
 */

import { CreatorCheck, ForecastOutput } from '../../types/forecast';

/**
 * Run Creator Check on forecast output
 */
export async function runCreatorCheck(forecast: Partial<ForecastOutput>): Promise<CreatorCheck> {
  const notes: string[] = [];
  let passed = true;
  
  try {
    // 1. Data provenance check
    const dataProvenance = await checkDataProvenance(forecast);
    if (!dataProvenance.passed) {
      passed = false;
      notes.push(...dataProvenance.notes);
    }
    
    // 2. Transparency check
    const transparency = await checkTransparency(forecast);
    if (!transparency.passed) {
      passed = false;
      notes.push(...transparency.notes);
    }
    
    // 3. Manipulation check
    const manipulation = await checkManipulation(forecast);
    if (!manipulation.passed) {
      passed = false;
      notes.push(...manipulation.notes);
    }
    
    // 4. Contact frequency check
    const contactFrequency = await checkContactFrequency(forecast);
    if (!contactFrequency.passed) {
      passed = false;
      notes.push(...contactFrequency.notes);
    }
    
    // 5. Sensitive segments check
    const sensitiveSegments = await checkSensitiveSegments(forecast);
    if (!sensitiveSegments.passed) {
      passed = false;
      notes.push(...sensitiveSegments.notes);
    }
    
    // 6. "Would I be proud" check
    const prideCheck = await checkPride(forecast);
    if (!prideCheck.passed) {
      passed = false;
      notes.push(...prideCheck.notes);
    }
    
    // 7. "10-year feel-right" check
    const longTermCheck = await checkLongTerm(forecast);
    if (!longTermCheck.passed) {
      passed = false;
      notes.push(...longTermCheck.notes);
    }
    
    // Add positive notes if all checks pass
    if (passed && notes.length === 0) {
      notes.push('All ethical checks passed');
      notes.push('Forecast meets Sterling Sign Solutions standards');
      notes.push('Ready for customer-facing deployment');
    }
    
    return {
      passed,
      notes,
    };
    
  } catch (error) {
    console.error('Error in Creator Check:', error);
    return {
      passed: false,
      notes: [
        'Creator Check failed due to technical error',
        'Manual review required before deployment',
        'Contact development team for assistance',
      ],
    };
  }
}

/**
 * Check data provenance and PII usage
 */
async function checkDataProvenance(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for PII in explanations
  if (forecast.explanations) {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ];
    
    for (const explanation of forecast.explanations) {
      for (const pattern of piiPatterns) {
        if (pattern.test(explanation)) {
          passed = false;
          notes.push('PII detected in forecast explanations');
          break;
        }
      }
    }
  }
  
  // Check for data freshness
  if (forecast.generatedAt) {
    const generatedDate = new Date(forecast.generatedAt);
    const now = new Date();
    const ageHours = (now.getTime() - generatedDate.getTime()) / (1000 * 60 * 60);
    
    if (ageHours > 24) {
      notes.push('Forecast data is older than 24 hours');
    }
  }
  
  // Check for data quality indicators
  if (forecast.revenueForecast) {
    const hasValidForecasts = forecast.revenueForecast.every(point => 
      point.point >= 0 && point.ciLow >= 0 && point.ciHigh >= 0
    );
    
    if (!hasValidForecasts) {
      passed = false;
      notes.push('Invalid forecast values detected');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Data provenance check passed');
  }
  
  return { passed, notes };
}

/**
 * Check transparency and explainability
 */
async function checkTransparency(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for explanations
  if (!forecast.explanations || forecast.explanations.length === 0) {
    passed = false;
    notes.push('No explanations provided for forecast');
  } else {
    // Check explanation quality
    const avgExplanationLength = forecast.explanations.reduce((sum, exp) => sum + exp.length, 0) / forecast.explanations.length;
    
    if (avgExplanationLength < 20) {
      notes.push('Explanations are too brief for transparency');
    }
    
    if (avgExplanationLength > 200) {
      notes.push('Explanations may be too verbose for user comprehension');
    }
  }
  
  // Check for confidence indicators
  if (forecast.anticipatedNeed && forecast.anticipatedNeed.confidence < 0.3) {
    notes.push('Low confidence in anticipated need prediction');
  }
  
  // Check for uncertainty communication
  if (forecast.revenueForecast) {
    const hasConfidenceIntervals = forecast.revenueForecast.every(point => 
      point.ciLow !== undefined && point.ciHigh !== undefined
    );
    
    if (!hasConfidenceIntervals) {
      passed = false;
      notes.push('Confidence intervals missing from revenue forecast');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Transparency check passed');
  }
  
  return { passed, notes };
}

/**
 * Check for manipulative tactics
 */
async function checkManipulation(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for urgency manipulation
  if (forecast.explanations) {
    const urgencyWords = ['urgent', 'immediate', 'critical', 'emergency', 'now', 'today'];
    const urgencyCount = forecast.explanations.reduce((count, exp) => {
      return count + urgencyWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (urgencyCount > 3) {
      notes.push('Excessive urgency language detected');
    }
  }
  
  // Check for fear-based messaging
  if (forecast.explanations) {
    const fearWords = ['risk', 'danger', 'threat', 'loss', 'miss', 'fail'];
    const fearCount = forecast.explanations.reduce((count, exp) => {
      return count + fearWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (fearCount > 2) {
      notes.push('Fear-based messaging detected');
    }
  }
  
  // Check for false scarcity
  if (forecast.explanations) {
    const scarcityWords = ['limited', 'exclusive', 'rare', 'once-in-a-lifetime'];
    const scarcityCount = forecast.explanations.reduce((count, exp) => {
      return count + scarcityWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (scarcityCount > 1) {
      notes.push('False scarcity language detected');
    }
  }
  
  // Check for opt-out availability
  if (forecast.explanations) {
    const hasOptOut = forecast.explanations.some(exp => 
      exp.toLowerCase().includes('opt-out') || 
      exp.toLowerCase().includes('unsubscribe') ||
      exp.toLowerCase().includes('preferences')
    );
    
    if (!hasOptOut) {
      notes.push('No opt-out information provided');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Manipulation check passed');
  }
  
  return { passed, notes };
}

/**
 * Check contact frequency limits
 */
async function checkContactFrequency(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for frequency recommendations
  if (forecast.explanations) {
    const frequencyWords = ['daily', 'weekly', 'monthly', 'frequent', 'regular'];
    const frequencyCount = forecast.explanations.reduce((count, exp) => {
      return count + frequencyWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (frequencyCount > 2) {
      notes.push('High frequency contact recommendations detected');
    }
  }
  
  // Check for respectful timing
  if (forecast.anticipatedNeed) {
    const windowStart = new Date(forecast.anticipatedNeed.nextWindowStart);
    const now = new Date();
    const daysUntilWindow = Math.ceil((windowStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilWindow < 7) {
      notes.push('Very short notice for anticipated need window');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Contact frequency check passed');
  }
  
  return { passed, notes };
}

/**
 * Check for sensitive segments
 */
async function checkSensitiveSegments(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for healthcare-specific content
  if (forecast.persona === 'healthcare') {
    if (forecast.explanations) {
      const healthWords = ['patient', 'medical', 'clinical', 'diagnosis', 'treatment'];
      const healthCount = forecast.explanations.reduce((count, exp) => {
        return count + healthWords.filter(word => exp.toLowerCase().includes(word)).length;
      }, 0);
      
      if (healthCount > 0) {
        notes.push('Healthcare-specific content detected - ensure HIPAA compliance');
      }
    }
  }
  
  // Check for political content
  if (forecast.explanations) {
    const politicalWords = ['election', 'campaign', 'political', 'government', 'policy'];
    const politicalCount = forecast.explanations.reduce((count, exp) => {
      return count + politicalWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (politicalCount > 0) {
      notes.push('Political content detected - review for appropriateness');
    }
  }
  
  // Check for children-related content
  if (forecast.explanations) {
    const childrenWords = ['child', 'children', 'kids', 'youth', 'minor'];
    const childrenCount = forecast.explanations.reduce((count, exp) => {
      return count + childrenWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (childrenCount > 0) {
      notes.push('Children-related content detected - ensure COPPA compliance');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Sensitive segments check passed');
  }
  
  return { passed, notes };
}

/**
 * Check "Would I be proud" criteria
 */
async function checkPride(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for professional tone
  if (forecast.explanations) {
    const unprofessionalWords = ['awesome', 'amazing', 'incredible', 'fantastic', 'super'];
    const unprofessionalCount = forecast.explanations.reduce((count, exp) => {
      return count + unprofessionalWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (unprofessionalCount > 2) {
      notes.push('Unprofessional language detected');
    }
  }
  
  // Check for accuracy and honesty
  if (forecast.revenueForecast) {
    const hasNegativeForecasts = forecast.revenueForecast.some(point => point.point < 0);
    if (hasNegativeForecasts) {
      notes.push('Negative revenue forecasts detected - review for accuracy');
    }
  }
  
  // Check for customer benefit focus
  if (forecast.explanations) {
    const benefitWords = ['benefit', 'value', 'help', 'improve', 'enhance', 'optimize'];
    const benefitCount = forecast.explanations.reduce((count, exp) => {
      return count + benefitWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (benefitCount === 0) {
      notes.push('No customer benefit language detected');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Pride check passed');
  }
  
  return { passed, notes };
}

/**
 * Check "10-year feel-right" criteria
 */
async function checkLongTerm(forecast: Partial<ForecastOutput>): Promise<{ passed: boolean; notes: string[] }> {
  const notes: string[] = [];
  let passed = true;
  
  // Check for sustainable practices
  if (forecast.explanations) {
    const sustainableWords = ['sustainable', 'long-term', 'future', 'growth', 'partnership'];
    const sustainableCount = forecast.explanations.reduce((count, exp) => {
      return count + sustainableWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (sustainableCount === 0) {
      notes.push('No long-term thinking language detected');
    }
  }
  
  // Check for relationship building
  if (forecast.explanations) {
    const relationshipWords = ['relationship', 'partnership', 'collaboration', 'trust', 'loyalty'];
    const relationshipCount = forecast.explanations.reduce((count, exp) => {
      return count + relationshipWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (relationshipCount === 0) {
      notes.push('No relationship-building language detected');
    }
  }
  
  // Check for ethical considerations
  if (forecast.explanations) {
    const ethicalWords = ['ethical', 'responsible', 'transparent', 'fair', 'honest'];
    const ethicalCount = forecast.explanations.reduce((count, exp) => {
      return count + ethicalWords.filter(word => exp.toLowerCase().includes(word)).length;
    }, 0);
    
    if (ethicalCount === 0) {
      notes.push('No ethical considerations language detected');
    }
  }
  
  if (passed && notes.length === 0) {
    notes.push('Long-term check passed');
  }
  
  return { passed, notes };
}

/**
 * Get Creator Check summary
 */
export function getCreatorCheckSummary(creatorCheck: CreatorCheck): {
  status: 'passed' | 'warning' | 'failed';
  summary: string;
  actionRequired: string;
} {
  if (creatorCheck.passed) {
    return {
      status: 'passed',
      summary: 'All ethical checks passed',
      actionRequired: 'No action required - ready for deployment',
    };
  } else {
    const warningCount = creatorCheck.notes.filter(note => 
      note.includes('detected') || note.includes('review')
    ).length;
    
    const errorCount = creatorCheck.notes.filter(note => 
      note.includes('failed') || note.includes('missing') || note.includes('invalid')
    ).length;
    
    if (errorCount > 0) {
      return {
        status: 'failed',
        summary: `${errorCount} critical issues found`,
        actionRequired: 'Immediate action required - do not deploy',
      };
    } else {
      return {
        status: 'warning',
        summary: `${warningCount} warnings found`,
        actionRequired: 'Review and address warnings before deployment',
      };
    }
  }
}
