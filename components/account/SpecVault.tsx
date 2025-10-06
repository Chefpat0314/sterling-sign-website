import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventTracking } from '../../lib/events';
import { analytics } from '../../lib/metrics';

interface SavedDesign {
  id: string;
  name: string;
  productType: string;
  thumbnail: string;
  createdAt: string;
  lastModified: string;
  specifications: {
    dimensions: string;
    materials: string[];
    colors: string[];
    quantity: number;
  };
  pricing: {
    basePrice: number;
    totalPrice: number;
    currency: string;
  };
  status: 'draft' | 'quoted' | 'ordered' | 'archived';
}

interface SpecVaultProps {
  userId?: string;
  onDesignSelect?: (design: SavedDesign) => void;
  onReorder?: (design: SavedDesign) => void;
}

export default function SpecVault({ userId, onDesignSelect, onReorder }: SpecVaultProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'quoted' | 'ordered'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { track, trackDesignAction } = useEventTracking();

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDesigns: SavedDesign[] = [
      {
        id: 'design-001',
        name: 'Office Signage Package',
        productType: 'Channel Letters',
        thumbnail: '/images/products/channel-letters-thumb.jpg',
        createdAt: '2024-01-15',
        lastModified: '2024-01-20',
        specifications: {
          dimensions: '24" x 8"',
          materials: ['Aluminum', 'LED'],
          colors: ['White', 'Blue'],
          quantity: 5
        },
        pricing: {
          basePrice: 250,
          totalPrice: 1250,
          currency: 'USD'
        },
        status: 'quoted'
      },
      {
        id: 'design-002',
        name: 'Restaurant Menu Board',
        productType: 'Digital Display',
        thumbnail: '/images/products/digital-display-thumb.jpg',
        createdAt: '2024-01-10',
        lastModified: '2024-01-18',
        specifications: {
          dimensions: '32" x 18"',
          materials: ['Steel Frame', 'Touch Screen'],
          colors: ['Black', 'Silver'],
          quantity: 2
        },
        pricing: {
          basePrice: 450,
          totalPrice: 900,
          currency: 'USD'
        },
        status: 'draft'
      },
      {
        id: 'design-003',
        name: 'Vehicle Wrap Design',
        productType: 'Vehicle Graphics',
        thumbnail: '/images/products/vehicle-wrap-thumb.jpg',
        createdAt: '2024-01-05',
        lastModified: '2024-01-12',
        specifications: {
          dimensions: 'Full Vehicle',
          materials: ['Vinyl', 'Laminate'],
          colors: ['Custom Design'],
          quantity: 1
        },
        pricing: {
          basePrice: 1200,
          totalPrice: 1200,
          currency: 'USD'
        },
        status: 'ordered'
      }
    ];

    setTimeout(() => {
      setDesigns(mockDesigns);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDesigns = designs.filter(design => {
    const matchesFilter = filter === 'all' || design.status === filter;
    const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.productType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDesignSelect = (design: SavedDesign) => {
    trackDesignAction(design.id, 'viewed');
    analytics.track('design_viewed', { designId: design.id, productType: design.productType });
    onDesignSelect?.(design);
  };

  const handleReorder = (design: SavedDesign) => {
    trackDesignAction(design.id, 'reorder_initiated');
    analytics.track('reorder_initiated', { designId: design.id, productType: design.productType });
    onReorder?.(design);
  };

  const handleDelete = (designId: string) => {
    trackDesignAction(designId, 'deleted');
    analytics.track('design_deleted', { designId });
    setDesigns(prev => prev.filter(d => d.id !== designId));
  };

  const getStatusColor = (status: SavedDesign['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'ordered': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Design Vault</h2>
          <p className="text-gray-600">Manage your saved designs and specifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredDesigns.length} designs</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'draft', 'quoted', 'ordered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Designs Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={design.thumbnail}
                  alt={design.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{design.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(design.status)}`}>
                    {design.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{design.productType}</p>

                {/* Specifications */}
                <div className="space-y-1 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Size:</span> {design.specifications.dimensions}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Qty:</span> {design.specifications.quantity}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> ${design.pricing.totalPrice}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDesignSelect(design)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  
                  {design.status === 'quoted' && (
                    <button
                      onClick={() => handleReorder(design)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Reorder
                    </button>
                  )}
                </div>

                {/* Additional Actions */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Modified: {new Date(design.lastModified).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first design.'}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create New Design
          </button>
        </div>
      )}
    </div>
  );
}
