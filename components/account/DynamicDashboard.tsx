import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEventTracking } from '../../lib/events';
import { analytics } from '../../lib/metrics';
import SpecVault from './SpecVault';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  preferences: {
    productTypes: string[];
    communicationFrequency: 'daily' | 'weekly' | 'monthly';
    notifications: boolean;
  };
  lifecycleStage: 'new' | 'active' | 'at-risk' | 'churned';
  segment: 'enterprise' | 'small-business' | 'individual';
}

interface DashboardMetrics {
  recentOrders: number;
  pendingQuotes: number;
  savedDesigns: number;
  totalSpent: number;
  averageOrderValue: number;
  lastActivity: string;
}

interface DynamicDashboardProps {
  userId: string;
}

export default function DynamicDashboard({ userId }: DynamicDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'designs' | 'orders' | 'quotes'>('overview');
  const { track, getUserId } = useEventTracking();

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockProfile: UserProfile = {
      id: userId,
      name: 'John Smith',
      email: 'john@company.com',
      company: 'Acme Corporation',
      role: 'Marketing Director',
      joinDate: '2023-06-15',
      totalOrders: 12,
      totalSpent: 15420,
      lastOrderDate: '2024-01-15',
      preferences: {
        productTypes: ['Channel Letters', 'Vehicle Graphics', 'Digital Displays'],
        communicationFrequency: 'weekly',
        notifications: true
      },
      lifecycleStage: 'active',
      segment: 'enterprise'
    };

    const mockMetrics: DashboardMetrics = {
      recentOrders: 3,
      pendingQuotes: 2,
      savedDesigns: 8,
      totalSpent: 15420,
      averageOrderValue: 1285,
      lastActivity: '2024-01-20'
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setMetrics(mockMetrics);
      setLoading(false);
      
      // Track dashboard view
      track('dashboard_viewed', { userId, segment: mockProfile.segment });
      analytics.track('dashboard_viewed', { userId, segment: mockProfile.segment });
    }, 1000);
  }, [userId, track]);

  const getLifecycleColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'small-business': return 'bg-blue-100 text-blue-800';
      case 'individual': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !metrics) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile.name}</h1>
          <p className="text-gray-600">{profile.company} • {profile.role}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLifecycleColor(profile.lifecycleStage)}`}>
            {profile.lifecycleStage.replace('-', ' ')}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSegmentColor(profile.segment)}`}>
            {profile.segment.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Orders</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.recentOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pendingQuotes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Designs</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.savedDesigns}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'designs', label: 'Designs' },
            { id: 'orders', label: 'Orders' },
            { id: 'quotes', label: 'Quotes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New quote requested for "Office Signage Package"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Order #12345 shipped</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Design "Restaurant Menu Board" saved</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-2">Similar to your recent orders</h4>
                  <p className="text-sm text-gray-600 mb-3">Based on your channel letter orders, you might like our LED channel letters.</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Recommendations →
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-2">Seasonal Special</h4>
                  <p className="text-sm text-gray-600 mb-3">Get 15% off your next vehicle wrap order this month.</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Claim Offer →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'designs' && (
          <SpecVault
            userId={userId}
            onDesignSelect={(design) => {
              track('design_selected', { designId: design.id, productType: design.productType });
            }}
            onReorder={(design) => {
              track('reorder_initiated', { designId: design.id, productType: design.productType });
            }}
          />
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
            <p className="text-gray-600">Order tracking and management features coming soon.</p>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quote Management</h3>
            <p className="text-gray-600">Quote tracking and management features coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
