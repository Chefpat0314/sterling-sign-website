/**
 * Feature Flags for Step 12 AI Analytics & Optimization
 * 
 * Non-destructive, env-driven flags. Default OFF.
 * All AI features are opt-in and can be toggled independently.
 */

export const FLAGS = {
  // Recommendation Engine
  RECS_ENABLED: process.env.NEXT_PUBLIC_RECS_ENABLED === "true",
  
  // Next-Best-Action Nudges
  NBA_ENABLED: process.env.NEXT_PUBLIC_NBA_ENABLED === "true",
  
  // Price Elasticity Testing
  PRICING_TESTS_ENABLED: process.env.NEXT_PUBLIC_PRICING_TESTS_ENABLED === "true",
  
  // Automated A/B Test Rotation
  AUTO_ROTATE_WINNERS: process.env.NEXT_PUBLIC_AUTO_ROTATE_WINNERS === "true",
  
  // Advanced Analytics
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ADVANCED_ANALYTICS === "true",
  
  // AI-Powered Personalization
  AI_PERSONALIZATION: process.env.NEXT_PUBLIC_AI_PERSONALIZATION === "true",
  
  // Real-time Recommendations
  REALTIME_RECS: process.env.NEXT_PUBLIC_REALTIME_RECS === "true",
  
  // ML-Assisted NBA
  ML_NBA: process.env.NEXT_PUBLIC_ML_NBA === "true",
  
  // Price Optimization
  PRICE_OPTIMIZATION: process.env.NEXT_PUBLIC_PRICE_OPTIMIZATION === "true",
  
  // Automated Reporting
  AUTO_REPORTING: process.env.NEXT_PUBLIC_AUTO_REPORTING === "true",
} as const;

/**
 * Feature flag validation and fallbacks
 */
export function validateFlags(): Record<string, boolean> {
  const validated: Record<string, boolean> = {};
  
  Object.entries(FLAGS).forEach(([key, value]) => {
    // Ensure all flags are boolean
    validated[key] = Boolean(value);
    
    // Log flag status in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚩 Feature Flag: ${key} = ${validated[key]}`);
    }
  });
  
  return validated;
}

/**
 * Check if any AI features are enabled
 */
export function hasAIFeatures(): boolean {
  return Object.values(FLAGS).some(flag => flag === true);
}

/**
 * Get enabled features for analytics
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key);
}

/**
 * Feature flag documentation
 */
export const FLAG_DOCUMENTATION = {
  RECS_ENABLED: "Enables product recommendation engine with content-based and collaborative filtering",
  NBA_ENABLED: "Enables next-best-action nudges for personalized user guidance",
  PRICING_TESTS_ENABLED: "Enables price elasticity testing with guardrails",
  AUTO_ROTATE_WINNERS: "Automatically promotes winning A/B test variants",
  ADVANCED_ANALYTICS: "Enables advanced analytics and KPI tracking",
  AI_PERSONALIZATION: "Enables AI-powered personalization features",
  REALTIME_RECS: "Enables real-time recommendation updates",
  ML_NBA: "Enables ML-assisted next-best-action logic",
  PRICE_OPTIMIZATION: "Enables automated price optimization",
  AUTO_REPORTING: "Enables automated weekly KPI reports",
} as const;

/**
 * Environment variable examples for .env.local
 */
export const ENV_EXAMPLES = `
# Step 12 AI Analytics Feature Flags
# Set to "true" to enable features (default: false)

# Core AI Features
NEXT_PUBLIC_RECS_ENABLED=false
NEXT_PUBLIC_NBA_ENABLED=false
NEXT_PUBLIC_PRICING_TESTS_ENABLED=false
NEXT_PUBLIC_AUTO_ROTATE_WINNERS=false

# Advanced Features
NEXT_PUBLIC_ADVANCED_ANALYTICS=false
NEXT_PUBLIC_AI_PERSONALIZATION=false
NEXT_PUBLIC_REALTIME_RECS=false
NEXT_PUBLIC_ML_NBA=false
NEXT_PUBLIC_PRICE_OPTIMIZATION=false
NEXT_PUBLIC_AUTO_REPORTING=false
`;

export default FLAGS;
