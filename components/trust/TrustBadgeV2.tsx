import React from 'react';
import { motion } from 'framer-motion';

interface TrustBadgeV2Props {
  variant?: 'security' | 'shipping' | 'guarantee' | 'support' | 'reviews';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function TrustBadgeV2({ 
  variant = 'security', 
  size = 'md', 
  animated = true 
}: TrustBadgeV2Props) {
  const badges = {
    security: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      title: "SSL Secured",
      description: "256-bit encryption"
    },
    shipping: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      ),
      title: "Fast Shipping",
      description: "2-5 business days"
    },
    guarantee: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.78 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.78 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.78 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.78 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: "Quality Guarantee",
      description: "100% satisfaction"
    },
    support: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.906l1.562-1.562C14.759 8.071 16 8.993 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.532a1.5 1.5 0 00-2.122-2.122L2.716 6.96A5.98 5.98 0 004 10a5.98 5.98 0 001.242 3.04l1.415-1.415zm11.33-10.246a1.5 1.5 0 00-2.122-2.122L14.07 2.05A5.98 5.98 0 0010 4a5.98 5.98 0 00-3.04 1.242l1.415 1.415a4.006 4.006 0 012.86.02zm-1.415 1.415a4.006 4.006 0 00-2.86-.02l-1.415-1.415A5.98 5.98 0 0010 4a5.98 5.98 0 004.07-1.95l1.415 1.415z" clipRule="evenodd" />
        </svg>
      ),
      title: "Expert Support",
      description: "24/7 assistance"
    },
    reviews: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      title: "5-Star Rated",
      description: "500+ reviews"
    }
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const badge = badges[variant];
  const BadgeComponent = (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg ${sizeClasses[size]}`}>
      <div className="text-green-600">
        {badge.icon}
      </div>
      <div>
        <div className="font-medium text-green-800">{badge.title}</div>
        <div className="text-green-600">{badge.description}</div>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {BadgeComponent}
      </motion.div>
    );
  }

  return BadgeComponent;
}
