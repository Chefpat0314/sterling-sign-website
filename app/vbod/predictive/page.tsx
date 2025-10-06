/**
 * VBOD Predictive Analytics Dashboard
 * 
 * Mobile-first dashboard for predictive analytics insights
 */

"use client";
import React, { useEffect, useState } from 'react';
import { ForecastOutput, PersonaType } from '../../../types/forecast';

interface DashboardData {
  forecast: ForecastOutput | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export default function PredictiveDashboard() {
  const [data, setData] = useState<DashboardData>({
    forecast: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('contractor');
  const [selectedHorizon, setSelectedHorizon] = useState<'14d' | '30d' | '60d'>('30d');

  useEffect(() => {
    loadForecast();
  }, [selectedPersona, selectedHorizon]);

  const loadForecast = async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/forecast/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: selectedPersona,
          horizons: [selectedHorizon],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const forecast = await response.json();
      setData({
        forecast,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      setData({
        forecast: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load forecast',
        lastUpdated: null,
      });
    }
  };

  if (data.loading) {
    return <LoadingState />;
  }

  if (data.error) {
    return <ErrorState error={data.error} onRetry={loadForecast} />;
  }

  if (!data.forecast) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Never'}
              </p>
            </div>
            <button
              onClick={loadForecast}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value as PersonaType)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="contractor">Contractor</option>
                <option value="property_manager">Property Manager</option>
                <option value="logistics">Logistics</option>
                <option value="healthcare">Healthcare</option>
                <option value="smb">SMB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horizon</label>
              <select
                value={selectedHorizon}
                onChange={(e) => setSelectedHorizon(e.target.value as '14d' | '30d' | '60d')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="14d">14 Days</option>
                <option value="30d">30 Days</option>
                <option value="60d">60 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* What's Happening */}
          <div className="lg:col-span-2">
            <WhatHappeningCard forecast={data.forecast} />
          </div>

          {/* Why */}
          <div>
            <WhyCard forecast={data.forecast} />
          </div>
        </div>

        {/* Next Action */}
        <div className="mt-6">
          <NextActionCard forecast={data.forecast} />
        </div>

        {/* Detailed Charts */}
        <div className="mt-6">
          <DetailedChartsCard forecast={data.forecast} />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading predictive analytics...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Forecast</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Forecast Data</h2>
        <p className="text-gray-600">Unable to generate forecast data at this time.</p>
      </div>
    </div>
  );
}

function WhatHappeningCard({ forecast }: { forecast: ForecastOutput }) {
  const revenueForecast = forecast.revenueForecast.filter(point => 
    point.date >= new Date().toISOString().split('T')[0]
  );

  const avgForecast = revenueForecast.reduce((sum, point) => sum + point.point, 0) / revenueForecast.length;
  const totalForecast = revenueForecast.reduce((sum, point) => sum + point.point, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Happening</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">${totalForecast.toLocaleString()}</div>
          <div className="text-sm text-blue-700">Total Forecasted Revenue</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{forecast.cashFlowStabilityIndex.toFixed(0)}</div>
          <div className="text-sm text-green-700">Cash Flow Stability Index</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Churn Risk</span>
          <span className={`text-sm font-medium ${
            forecast.churnRisk < 0.3 ? 'text-green-600' :
            forecast.churnRisk < 0.6 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {(forecast.churnRisk * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Anticipated Need</span>
          <span className="text-sm font-medium text-blue-600">
            {forecast.anticipatedNeed.nextWindowStart} to {forecast.anticipatedNeed.nextWindowEnd}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence</span>
          <span className="text-sm font-medium text-gray-900">
            {(forecast.anticipatedNeed.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function WhyCard({ forecast }: { forecast: ForecastOutput }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Why</h2>
      
      <div className="space-y-3">
        {forecast.explanations.map((explanation, index) => (
          <div key={index} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            {explanation}
          </div>
        ))}
      </div>
      
      {forecast.creatorCheck && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              forecast.creatorCheck.passed ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-900">
              {forecast.creatorCheck.passed ? 'Ethical Check Passed' : 'Ethical Check Failed'}
            </span>
          </div>
          {forecast.creatorCheck.notes.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {forecast.creatorCheck.notes[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NextActionCard({ forecast }: { forecast: ForecastOutput }) {
  const actions = [
    {
      title: 'Monitor Churn Risk',
      description: forecast.churnRisk > 0.6 ? 'High churn risk detected - immediate action required' : 'Churn risk is manageable',
      priority: forecast.churnRisk > 0.6 ? 'high' : 'medium',
    },
    {
      title: 'Prepare for Anticipated Need',
      description: `Next window: ${forecast.anticipatedNeed.nextWindowStart} to ${forecast.anticipatedNeed.nextWindowEnd}`,
      priority: forecast.anticipatedNeed.confidence > 0.7 ? 'high' : 'medium',
    },
    {
      title: 'Cash Flow Management',
      description: forecast.cashFlowStabilityIndex < 60 ? 'Cash flow stability needs attention' : 'Cash flow stability is good',
      priority: forecast.cashFlowStabilityIndex < 60 ? 'high' : 'low',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Action</h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="flex items-start">
            <div className={`w-3 h-3 rounded-full mr-3 mt-1 ${
              action.priority === 'high' ? 'bg-red-500' :
              action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <div>
              <div className="font-medium text-gray-900">{action.title}</div>
              <div className="text-sm text-gray-600">{action.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailedChartsCard({ forecast }: { forecast: ForecastOutput }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Forecast Chart */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Revenue Forecast</h3>
          <div className="space-y-2">
            {forecast.revenueForecast.slice(0, 7).map((point, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{point.date}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">${point.point.toLocaleString()}</span>
                  <span className="text-gray-500">
                    (${point.ciLow.toLocaleString()} - ${point.ciHigh.toLocaleString()})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Signals */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Top Signals</h3>
          <div className="space-y-2">
            {forecast.anticipatedNeed.topSignals.map((signal, index) => (
              <div key={index} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                {signal}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
