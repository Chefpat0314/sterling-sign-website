// components/checkout/ShippingOptionsPicker.tsx - Shipping method selection
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildDeliveryOptions, type ShippingInput, type DeliveryOption } from '../../lib/eta';
import { analytics } from '../../lib/metrics';
import { formatCurrency } from '../../lib/format';

interface ShippingOptionsPickerProps {
  productCode: string;
  quantity: number;
  areaSqft: number;
  width: number;
  height: number;
  destZip: string;
  rushLevel?: 'standard' | 'rush20' | 'rush40';
  selectedOption?: string;
  onSelect: (option: DeliveryOption) => void;
  className?: string;
}

export default function ShippingOptionsPicker({
  productCode,
  quantity,
  areaSqft,
  width,
  height,
  destZip,
  rushLevel = 'standard',
  selectedOption,
  onSelect,
  className = '',
}: ShippingOptionsPickerProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destZip || destZip.length !== 5) {
      setDeliveryOptions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const input: ShippingInput = {
      productCode,
      quantity,
      areaSqft,
      width,
      height,
      destZip,
      rushLevel,
    };

    try {
      const options = buildDeliveryOptions(input);
      setDeliveryOptions(options);
    } catch (err) {
      console.error('Shipping options error:', err);
      setError('Unable to calculate shipping options');
    } finally {
      setIsLoading(false);
    }
  }, [productCode, quantity, areaSqft, width, height, destZip, rushLevel]);

  const handleOptionSelect = (option: DeliveryOption) => {
    onSelect(option);
    
    // Track shipping method selection
    analytics.track('shipping_method_selected', {
      method: option.code,
      cost: option.costCents / 100,
      arrival: option.arrivalDate,
      guaranteed: option.guaranteed,
    });
  };

  if (!destZip || destZip.length !== 5) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500 mb-4">Enter your ZIP code to see shipping options</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-600">Calculating shipping options...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 mb-2">{error}</div>
        <div className="text-sm text-gray-500">Please try again or contact support</div>
      </div>
    );
  }

  if (deliveryOptions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500">No shipping options available for this location</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Options</h3>
        <p className="text-sm text-gray-600">
          Dates shown include production & transit. Guaranteed options arrive by the date shown.
        </p>
      </div>

      <div className="space-y-3">
        {deliveryOptions.map((option, index) => (
          <motion.div
            key={option.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              selectedOption === option.code
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="shipping-option"
                  value={option.code}
                  checked={selectedOption === option.code}
                  onChange={() => handleOptionSelect(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {option.label.split(' — ')[0]}
                    </span>
                    {option.guaranteed && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-green-700 font-medium">Guaranteed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    {option.label.split(' — ').slice(1).join(' — ')}
                  </div>
                  
                  {option.notes && (
                    <div className="text-xs text-gray-500 mt-1 italic">
                      {option.notes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {option.costCents === 0 ? 'FREE' : formatCurrency(option.costCents / 100)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust elements */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>97% On-Time</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Damage-Free Guarantee</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>On-Time or we refund shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}
