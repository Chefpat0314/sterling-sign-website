import React from 'react';

export default function PDPTrustRail() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Why Choose Sterling?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">97% On-Time</div>
            <div className="text-gray-600">Delivery Promise</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">0.5% Damage Rate</div>
            <div className="text-gray-600">Quality Guarantee</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">Free Online Proof</div>
            <div className="text-gray-600">Before Production</div>
          </div>
        </div>
      </div>
    </div>
  );
}
