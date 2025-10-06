/**
 * Next-Best-Action System
 * 
 * Rule-based and ML-assisted nudges for personalized user guidance
 */

export type NBAContext = 'PDP' | 'CART' | 'CHECKOUT' | 'ACCOUNT' | 'HOMEPAGE';
export type NBAVariant = 'info' | 'success' | 'warning' | 'error';

export type NBAAction = {
  id: string;
  label: string;
  description?: string;
  href: string;
  variant: NBAVariant;
  priority: number;
  conditions: NBACondition[];
  metadata?: Record<string, any>;
};

export type NBACondition = {
  type: 'user_activity' | 'product_context' | 'time_based' | 'behavioral' | 'cart_state';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  field?: string;
};

export type NBARequest = {
  context: NBAContext;
  userId?: string;
  productId?: string;
  sessionId?: string;
  userState?: {
    recentViews: string[];
    cartItems: string[];
    purchaseHistory: string[];
    lastActivity: Date;
    totalSpent: number;
    avgOrderValue: number;
  };
  productState?: {
    category: string;
    price: number;
    popularity: boolean;
    availability: boolean;
  };
};

export type NBAResponse = {
  action: NBAAction | null;
  reasoning: string;
  confidence: number;
  metadata: {
    conditionsMet: string[];
    conditionsFailed: string[];
    processingTime: number;
  };
};

/**
 * NBA Action Registry
 */
const NBA_ACTIONS: NBAAction[] = [
  {
    id: 'design-now',
    label: 'Pick up where you left off—design this product now.',
    description: 'Continue customizing your product with our design tools.',
    href: '#customize',
    variant: 'info',
    priority: 8,
    conditions: [
      { type: 'user_activity', operator: 'greater_than', value: 300000, field: 'inactivity_ms' }, // 5 minutes
      { type: 'product_context', operator: 'equals', value: 'PDP', field: 'context' },
    ],
  },
  {
    id: 'reorder-last',
    label: 'Reorder your last purchase for quick turnaround.',
    description: 'Get the same product you ordered before with one click.',
    href: '/account/orders',
    variant: 'success',
    priority: 9,
    conditions: [
      { type: 'time_based', operator: 'greater_than', value: 30, field: 'days_since_purchase' },
      { type: 'behavioral', operator: 'equals', value: true, field: 'has_purchase_history' },
    ],
  },
  {
    id: 'add-upsell',
    label: 'Add grommets or stands to complete your kit.',
    description: 'Enhance your order with professional accessories.',
    href: '/accessories',
    variant: 'success',
    priority: 7,
    conditions: [
      { type: 'cart_state', operator: 'greater_than', value: 1, field: 'cart_quantity' },
      { type: 'product_context', operator: 'contains', value: 'banner', field: 'product_category' },
    ],
  },
  {
    id: 'rush-order',
    label: 'Need it faster? Rush production available.',
    description: 'Get your order in 24 hours with rush processing.',
    href: '#rush-options',
    variant: 'warning',
    priority: 6,
    conditions: [
      { type: 'time_based', operator: 'less_than', value: 3, field: 'days_until_deadline' },
      { type: 'product_context', operator: 'equals', value: 'PDP', field: 'context' },
    ],
  },
  {
    id: 'bulk-discount',
    label: 'Save 15% on orders of 10+ items.',
    description: 'Get volume pricing for larger orders.',
    href: '#bulk-pricing',
    variant: 'info',
    priority: 5,
    conditions: [
      { type: 'cart_state', operator: 'greater_than', value: 5, field: 'cart_quantity' },
      { type: 'behavioral', operator: 'equals', value: true, field: 'is_bulk_customer' },
    ],
  },
  {
    id: 'design-help',
    label: 'Need design help? Our team is standing by.',
    description: 'Get professional design assistance for your project.',
    href: '/services/design',
    variant: 'info',
    priority: 4,
    conditions: [
      { type: 'user_activity', operator: 'greater_than', value: 600000, field: 'inactivity_ms' }, // 10 minutes
      { type: 'product_context', operator: 'equals', value: 'PDP', field: 'context' },
    ],
  },
  {
    id: 'save-design',
    label: 'Save your design to SpecVault for later.',
    description: 'Don\'t lose your work—save it for future orders.',
    href: '/account/specs',
    variant: 'info',
    priority: 3,
    conditions: [
      { type: 'user_activity', operator: 'greater_than', value: 120000, field: 'inactivity_ms' }, // 2 minutes
      { type: 'product_context', operator: 'equals', value: 'PDP', field: 'context' },
    ],
  },
  {
    id: 'checkout-reminder',
    label: 'Complete your order to secure your spot.',
    description: 'Your cart is ready—finish checkout to proceed.',
    href: '/checkout',
    variant: 'warning',
    priority: 8,
    conditions: [
      { type: 'cart_state', operator: 'greater_than', value: 0, field: 'cart_quantity' },
      { type: 'product_context', operator: 'equals', value: 'CART', field: 'context' },
    ],
  },
];

/**
 * Get next best action for user context
 */
export async function getNextBestAction(request: NBARequest): Promise<NBAResponse> {
  const startTime = Date.now();
  
  try {
    // Evaluate all actions against current context
    const eligibleActions = NBA_ACTIONS.filter(action => 
      evaluateConditions(action.conditions, request)
    );
    
    if (eligibleActions.length === 0) {
      return {
        action: null,
        reasoning: 'No actions match current context',
        confidence: 0,
        metadata: {
          conditionsMet: [],
          conditionsFailed: [],
          processingTime: Date.now() - startTime,
        },
      };
    }
    
    // Sort by priority and select highest priority action
    const sortedActions = eligibleActions.sort((a, b) => b.priority - a.priority);
    const selectedAction = sortedActions[0];
    
    // Calculate confidence based on conditions met
    const confidence = calculateConfidence(selectedAction, request);
    
    return {
      action: selectedAction,
      reasoning: `Selected ${selectedAction.id} based on priority ${selectedAction.priority}`,
      confidence,
      metadata: {
        conditionsMet: selectedAction.conditions.map(c => c.type),
        conditionsFailed: [],
        processingTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error('Error getting next best action:', error);
    return {
      action: null,
      reasoning: 'Error processing NBA request',
      confidence: 0,
      metadata: {
        conditionsMet: [],
        conditionsFailed: [],
        processingTime: Date.now() - startTime,
      },
    };
  }
}

/**
 * Evaluate conditions for an NBA action
 */
function evaluateConditions(conditions: NBACondition[], request: NBARequest): boolean {
  return conditions.every(condition => {
    const value = getConditionValue(condition, request);
    return evaluateCondition(condition, value);
  });
}

/**
 * Get value for a condition from the request
 */
function getConditionValue(condition: NBACondition, request: NBARequest): any {
  const { type, field } = condition;
  
  switch (type) {
    case 'user_activity':
      if (field === 'inactivity_ms') {
        const lastActivity = request.userState?.lastActivity || new Date();
        return Date.now() - lastActivity.getTime();
      }
      break;
    
    case 'product_context':
      if (field === 'context') return request.context;
      if (field === 'product_category') return request.productState?.category;
      break;
    
    case 'time_based':
      if (field === 'days_since_purchase') {
        // Simplified: assume 30 days for demo
        return 30;
      }
      if (field === 'days_until_deadline') {
        // Simplified: assume 5 days for demo
        return 5;
      }
      break;
    
    case 'behavioral':
      if (field === 'has_purchase_history') {
        return (request.userState?.purchaseHistory?.length || 0) > 0;
      }
      if (field === 'is_bulk_customer') {
        return (request.userState?.avgOrderValue || 0) > 100;
      }
      break;
    
    case 'cart_state':
      if (field === 'cart_quantity') {
        return request.userState?.cartItems?.length || 0;
      }
      break;
  }
  
  return null;
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(condition: NBACondition, value: any): boolean {
  const { operator, value: expectedValue } = condition;
  
  if (value === null || value === undefined) return false;
  
  switch (operator) {
    case 'equals':
      return value === expectedValue;
    case 'greater_than':
      return value > expectedValue;
    case 'less_than':
      return value < expectedValue;
    case 'contains':
      return String(value).toLowerCase().includes(String(expectedValue).toLowerCase());
    case 'not_contains':
      return !String(value).toLowerCase().includes(String(expectedValue).toLowerCase());
    default:
      return false;
  }
}

/**
 * Calculate confidence score for an action
 */
function calculateConfidence(action: NBAAction, request: NBARequest): number {
  const conditionsMet = action.conditions.length;
  const totalConditions = action.conditions.length;
  
  // Base confidence on conditions met
  let confidence = conditionsMet / totalConditions;
  
  // Boost confidence for high-priority actions
  if (action.priority >= 8) {
    confidence += 0.1;
  }
  
  // Boost confidence for users with purchase history
  if (request.userState?.purchaseHistory?.length) {
    confidence += 0.05;
  }
  
  return Math.min(1.0, confidence);
}

/**
 * Get all available NBA actions for debugging
 */
export function getAllNBAActions(): NBAAction[] {
  return NBA_ACTIONS;
}

/**
 * Get NBA action by ID
 */
export function getNBAActionById(id: string): NBAAction | null {
  return NBA_ACTIONS.find(action => action.id === id) || null;
}

/**
 * Validate NBA request
 */
export function validateNBARequest(request: NBARequest): boolean {
  return !!(
    request.context &&
    (request.userId || request.sessionId) &&
    request.userState
  );
}
