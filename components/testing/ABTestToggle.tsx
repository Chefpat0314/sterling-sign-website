import React, { useState, useEffect } from 'react';
import { analytics } from '../../lib/metrics';

interface ABTestToggleProps {
  testName: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  defaultVariant?: 'A' | 'B';
  onVariantChange?: (variant: 'A' | 'B') => void;
}

export default function ABTestToggle({ 
  testName, 
  variantA, 
  variantB, 
  defaultVariant = 'A',
  onVariantChange 
}: ABTestToggleProps) {
  const [variant, setVariant] = useState<'A' | 'B'>(defaultVariant);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load variant from localStorage or assign randomly
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    if (storedVariant) {
      setVariant(storedVariant as 'A' | 'B');
    } else {
      // Random assignment (50/50 split)
      const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
      setVariant(randomVariant);
      localStorage.setItem(`ab_test_${testName}`, randomVariant);
    }
    
    setIsLoaded(true);
    
    // Track test assignment
    analytics.track('ab_test_assigned', {
      testName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
    
    if (onVariantChange) {
      onVariantChange(variant);
    }
  }, [testName, onVariantChange]);

  if (!isLoaded) {
    // Show default variant while loading
    return <>{variantA}</>;
  }

  return (
    <>
      {variant === 'A' ? variantA : variantB}
    </>
  );
}

// Hook for accessing current variant
export function useABTest(testName: string) {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    if (storedVariant) {
      setVariant(storedVariant as 'A' | 'B');
    }
  }, [testName]);

  return variant;
}

// Utility for tracking test interactions
export function trackABTestInteraction(testName: string, interaction: string, variant: 'A' | 'B') {
  analytics.track('ab_test_interaction', {
    testName,
    interaction,
    variant,
    timestamp: new Date().toISOString()
  });
}
