// components/TrustBadges.tsx - Trust and security badges
import React from 'react';
import { motion } from 'framer-motion';

interface TrustBadge {
  icon: string;
  text: string;
  subtext?: string;
  color: string;
  bgColor: string;
}

interface TrustBadgesProps {
  badges?: TrustBadge[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const defaultBadges: TrustBadge[] = [
  {
    icon: '🔒',
    text: 'Secure Checkout',
    subtext: 'SSL Encrypted',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  {
    icon: '💳',
    text: 'No Hidden Fees',
    subtext: 'All-inclusive pricing',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    icon: '🏆',
    text: 'Price Match',
    subtext: 'Beat any verified quote',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    icon: '✅',
    text: '100% Satisfaction',
    subtext: 'Guaranteed quality',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
];

const cardBadges: TrustBadge[] = [
  {
    icon: '💳',
    text: 'We Accept',
    subtext: 'All major cards',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
];

export default function TrustBadges({ 
  badges = defaultBadges, 
  layout = 'horizontal',
  size = 'md',
  className = '' 
}: TrustBadgesProps) {
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-xs',
      subtext: 'text-xs',
    },
    md: {
      container: 'p-3',
      icon: 'w-5 h-5',
      text: 'text-sm',
      subtext: 'text-xs',
    },
    lg: {
      container: 'p-4',
      icon: 'w-6 h-6',
      text: 'text-base',
      subtext: 'text-sm',
    },
  };

  const layoutClasses = {
    horizontal: 'flex items-center space-x-4',
    vertical: 'flex flex-col space-y-3',
    grid: 'grid grid-cols-2 gap-3',
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className={`${badge.bgColor} ${badge.color} ${currentSize.container} rounded-lg border border-opacity-20 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center space-x-3">
            <div className={`${currentSize.icon} flex items-center justify-center`}>
              {badge.icon}
            </div>
            <div className="flex-1">
              <div className={`${currentSize.text} font-semibold`}>
                {badge.text}
              </div>
              {badge.subtext && (
                <div className={`${currentSize.subtext} opacity-75`}>
                  {badge.subtext}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Card logos component
export function CardLogos({ className = '' }: { className?: string }) {
  const cards = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'American Express', logo: '💳' },
    { name: 'Discover', logo: '💳' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs text-gray-600 mr-2">We accept:</span>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="w-8 h-6 bg-white rounded border flex items-center justify-center text-xs"
          title={card.name}
        >
          {card.logo}
        </motion.div>
      ))}
    </div>
  );
}

// Security badges component
export function SecurityBadges({ className = '' }: { className?: string }) {
  const securityItems = [
    { icon: '🔒', text: 'SSL Secured' },
    { icon: '🛡️', text: 'PCI Compliant' },
    { icon: '🔐', text: '256-bit Encryption' },
  ];

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {securityItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex items-center space-x-1 text-xs text-gray-600"
        >
          <span>{item.icon}</span>
          <span>{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Guarantee badges component
export function GuaranteeBadges({ className = '' }: { className?: string }) {
  const guarantees = [
    {
      icon: '✅',
      text: '100% Satisfaction',
      description: 'Not happy? We make it right.',
    },
    {
      icon: '🚚',
      text: 'On-Time Delivery',
      description: 'Late? Credit back guarantee.',
    },
    {
      icon: '💰',
      text: 'Price Match',
      description: 'Beat any verified quote.',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {guarantees.map((guarantee, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-2">{guarantee.icon}</div>
          <div className="font-semibold text-gray-900 mb-1">{guarantee.text}</div>
          <div className="text-sm text-gray-600">{guarantee.description}</div>
        </motion.div>
      ))}
    </div>
  );
}
