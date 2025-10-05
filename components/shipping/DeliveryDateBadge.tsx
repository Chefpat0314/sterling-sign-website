// components/shipping/DeliveryDateBadge.tsx - Delivery date display with tooltip
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildDeliveryOptions } from '../../lib/eta';
import { type ShippingInput } from '../../config/shipping';
import { formatETA } from '../../lib/eta';
import { analytics } from '../../lib/metrics';

interface DeliveryDateBadgeProps {
  product: string;
  qty: number;
  areaSqft: number;
  destZip?: string;
  rushSelected?: 'standard' | 'rush20' | 'rush40';
  width?: number;
  height?: number;
  className?: string;
}

export default function DeliveryDateBadge({
  product,
  qty,
  areaSqft,
  destZip,
  rushSelected = 'standard',
  width = 24,
  height = 12,
  className = '',
}: DeliveryDateBadgeProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!destZip || destZip.length !== 5) {
      setDeliveryOptions([]);
      return;
    }

    setIsLoading(true);
    
    const input: ShippingInput = {
      productCode: product,
      quantity: qty,
      areaSqft,
      width,
      height,
      destZip,
      rushLevel: rushSelected,
    };

    try {
      const options = buildDeliveryOptions(input);
      setDeliveryOptions(options);
      
      // Track delivery date shown
      if (options.length > 0) {
        analytics.track('delivery_date_shown', {
          product,
          destZip,
          methodSuggested: options[0].code,
          arrivalDate: options[0].arrivalDate,
          cutoffState: 'before_cutoff', // TODO: calculate actual cutoff state
        });
      }
    } catch (error) {
      console.error('Delivery calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [product, qty, areaSqft, destZip, rushSelected, width, height]);

  if (!destZip || destZip.length !== 5) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Enter ZIP code to see delivery date
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        <span className="text-sm text-gray-600">Calculating delivery...</span>
      </div>
    );
  }

  if (deliveryOptions.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Unable to calculate delivery date
      </div>
    );
  }

  const primaryOption = deliveryOptions[0];
  const arrivalDate = new Date(primaryOption.arrivalDate);
  const formattedDate = formatETA({ promisedDate: primaryOption.arrivalDate });

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-green-800">
            Arrives by {formattedDate}
          </span>
        </div>
        
        {primaryOption.guaranteed && (
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-green-700 font-medium">Guaranteed</span>
          </div>
        )}
        
        <button
          className="text-green-600 hover:text-green-700 transition-colors"
          aria-label="How we calculate delivery dates"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10"
        >
          <div className="space-y-2">
            <div className="font-semibold">How we calculate delivery dates:</div>
            <ul className="space-y-1 text-gray-300">
              <li>• Production time: {deliveryOptions[0]?.productionDays || '2-4'} business days</li>
              <li>• Transit time: {deliveryOptions[0]?.transitDays || '1-5'} business days</li>
              <li>• Cutoff: Orders by 5pm start production today</li>
              <li>• Holidays: We skip production holidays</li>
            </ul>
            <div className="text-xs text-gray-400 mt-2">
              {primaryOption.guaranteed ? 'Guaranteed delivery date' : 'Estimated delivery date'}
            </div>
          </div>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  );
}
