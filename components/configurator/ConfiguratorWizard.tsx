// components/configurator/ConfiguratorWizard.tsx - 4-step configurator with pricing
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quote, QuoteConfig, QuoteResult, formatPrice, getProductName } from '../../lib/pricing';
import { calculateETA, formatETA } from '../../lib/eta';
import { analytics } from '../../lib/metrics';
import { formatDimensions, formatSquareFeet } from '../../lib/format';

interface ConfiguratorWizardProps {
  productCode: string;
  onAddToCart: (config: QuoteConfig, result: QuoteResult) => void;
  className?: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const steps: Step[] = [
  { id: 1, title: 'Specs', description: 'Size & Material', completed: false },
  { id: 2, title: 'Design', description: 'Upload & Preview', completed: false },
  { id: 3, title: 'Review', description: 'Preflight & Pricing', completed: false },
  { id: 4, title: 'Confirm', description: 'Add to Cart', completed: false },
];

export default function ConfiguratorWizard({ productCode, onAddToCart, className = '' }: ConfiguratorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<Partial<QuoteConfig>>({
    productCode,
    width: 24,
    height: 12,
    quantity: 1,
    options: {},
    rushLevel: 'standard',
  });
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [etaResult, setEtaResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preflightWarnings, setPreflightWarnings] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate quote when config changes
  useEffect(() => {
    if (config.productCode && config.width && config.height && config.quantity) {
      calculateQuote();
    }
  }, [config]);

  const calculateQuote = async () => {
    setIsCalculating(true);
    try {
      const fullConfig: QuoteConfig = {
        productCode: config.productCode!,
        width: config.width!,
        height: config.height!,
        quantity: config.quantity!,
        options: config.options || {},
        rushLevel: config.rushLevel || 'standard',
        zipCode: config.zipCode,
      };

      const result = quote(fullConfig);
      setQuoteResult(result);

      // Calculate ETA if zip code is provided
      if (config.zipCode) {
        const eta = calculateETA({
          productCode: config.productCode!,
          sqFt: result.sqFt,
          qty: config.quantity!,
          rushLevel: config.rushLevel || 'standard',
          shipZip: config.zipCode!,
        });
        setEtaResult(eta);
      }

      analytics.configureChange('quote_update', result.price, productCode);
    } catch (error) {
      console.error('Quote calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Mock preflight check
      const warnings: string[] = [];
      if (file.size > 50 * 1024 * 1024) { // 50MB
        warnings.push('File size is large (>50MB). Consider optimizing for faster upload.');
      }
      
      // Mock resolution check based on dimensions
      const expectedDpi = Math.min(config.width!, config.height!) * 150 / Math.min(config.width!, config.height!);
      if (expectedDpi < 150) {
        warnings.push('Image resolution may be low for print quality. Consider 150+ DPI.');
      }
      
      setPreflightWarnings(warnings);
      analytics.configureChange('file_upload', file.name, productCode);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      analytics.configureChange('step_next', newStep, productCode);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      analytics.configureChange('step_prev', newStep, productCode);
    }
  };

  const handleAddToCart = () => {
    if (quoteResult) {
      const fullConfig: QuoteConfig = {
        productCode: config.productCode!,
        width: config.width!,
        height: config.height!,
        quantity: config.quantity!,
        options: config.options || {},
        rushLevel: config.rushLevel || 'standard',
        zipCode: config.zipCode,
      };

      analytics.addToCart(productCode, config.quantity!, quoteResult.price);
      onAddToCart(fullConfig, quoteResult);
    }
  };

  const updateConfig = (updates: Partial<QuoteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    analytics.configureChange('config_update', updates, productCode);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Product Specifications</h3>
            
            {/* Size Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (inches)
                </label>
                <input
                  type="number"
                  value={config.width}
                  onChange={(e) => updateConfig({ width: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="144"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={config.height}
                  onChange={(e) => updateConfig({ height: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="144"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={config.quantity}
                onChange={(e) => updateConfig({ quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="1000"
              />
            </div>

            {/* Rush Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Speed
              </label>
              <div className="space-y-2">
                {[
                  { value: 'standard', label: 'Standard (2-3 days)', description: 'Regular production time' },
                  { value: 'rush20', label: '20% Rush (+20% fee)', description: '20% faster production' },
                  { value: 'rush40', label: '40% Rush (+40% fee)', description: '40% faster production' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="rushLevel"
                      value={option.value}
                      checked={config.rushLevel === option.value}
                      onChange={(e) => updateConfig({ rushLevel: e.target.value as any })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Options
              </label>
              <div className="space-y-2">
                {[
                  { key: 'hemGrommet', label: 'Hem & Grommets', description: 'Reinforced edges with grommets' },
                  { key: 'polePocket', label: 'Pole Pockets', description: 'Pockets for pole insertion' },
                  { key: 'doubleSided', label: 'Double Sided', description: 'Print on both sides' },
                  { key: 'lamination', label: 'Lamination', description: 'Protective lamination' },
                ].map((option) => (
                  <label key={option.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={Boolean(config.options?.[option.key]) || false}
                      onChange={(e) => updateConfig({
                        options: { ...config.options, [option.key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Design & Artwork</h3>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="artwork-upload"
                accept="image/*,.pdf,.ai,.eps"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="artwork-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="text-4xl">📁</div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {uploadedFile ? uploadedFile.name : 'Upload your artwork'}
                    </div>
                    <div className="text-sm text-gray-500">
                      PNG, JPG, PDF, AI, EPS up to 50MB
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </label>
            </div>

            {/* Design in Browser Option */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Or Design in Browser</h4>
              <p className="text-blue-700 text-sm mb-4">
                Use our simple design tool to create your sign online.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Launch Designer
              </button>
            </div>

            {/* Preview */}
            {uploadedFile && (
              <div className="space-y-4">
                <h4 className="font-medium">Preview</h4>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-sm text-gray-600">
                      {formatDimensions(config.width!, config.height!)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Safe area marked in blue
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Review & Preflight</h3>
            
            {/* Preflight Results */}
            <div className="space-y-4">
              <h4 className="font-medium">File Check Results</h4>
              
              {preflightWarnings.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 font-medium">File looks good!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your file meets our quality standards.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span className="text-yellow-800 font-medium">Recommendations</span>
                  </div>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    {preflightWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            {quoteResult && (
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium mb-4">Pricing Breakdown</h4>
                <div className="space-y-2">
                  {quoteResult.lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span>{formatPrice(item.total)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(quoteResult.price)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ETA */}
            {etaResult && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📅</span>
                  <span className="font-medium text-blue-900">
                    Delivered by {formatETA(etaResult)}
                  </span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  {etaResult.productionDays} production + {etaResult.shipDays} shipping days
                </p>
              </div>
            )}

            {/* Approval Checkbox */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <div className="text-sm">
                  <div className="font-medium">I approve the on-screen proof</div>
                  <div className="text-gray-500">
                    I understand that Sterling will print exactly what I see in the preview.
                  </div>
                </div>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Confirm Order</h3>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium mb-4">Order Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{getProductName(productCode)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">
                    {formatDimensions(config.width!, config.height!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{config.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-medium">{formatSquareFeet(quoteResult?.sqFt || 0)}</span>
                </div>
                {etaResult && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">{formatETA(etaResult)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(quoteResult?.price || 0)}</span>
                </div>
              </div>
            </div>

            {/* Final Terms */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Terms & Guarantees</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 100% satisfaction guarantee</li>
                <li>• On-time delivery or credit back</li>
                <li>• Free revisions before printing</li>
                <li>• Professional installation available</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? '✓' : step.id}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-12 h-0.5 bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!quoteResult}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      {isCalculating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <div className="text-sm text-gray-600">Calculating...</div>
          </div>
        </div>
      )}
    </div>
  );
}
