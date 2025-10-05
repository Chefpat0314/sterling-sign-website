// components/TrustBar.tsx - Sticky trust messaging bar
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrustBarProps {
  items?: Array<{
    icon: string;
    text: string;
    color?: string;
  }>;
  className?: string;
}

const defaultItems = [
  {
    icon: '⚡',
    text: 'Fast Turnarounds',
    color: 'text-yellow-600',
  },
  {
    icon: '✅',
    text: '100% Satisfaction',
    color: 'text-green-600',
  },
  {
    icon: '🚚',
    text: 'On-Time Delivery',
    color: 'text-blue-600',
  },
  {
    icon: '🤝',
    text: 'Free Design Help',
    color: 'text-purple-600',
  },
];

export default function TrustBar({ items = defaultItems, className = '' }: TrustBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ${className}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Desktop View */}
              <div className="hidden md:flex items-center justify-center w-full space-x-8">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Mobile View */}
              <div className="md:hidden flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3"
                    >
                      {items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span className="text-sm">{item.icon}</span>
                          <span className="text-xs font-medium">{item.text}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  
                  {isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-sm">⚡</span>
                      <span className="text-xs font-medium">Fast & Reliable</span>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={toggleCollapsed}
                  className="p-1 rounded-md hover:bg-blue-500 transition-colors"
                  aria-label={isCollapsed ? 'Expand trust bar' : 'Collapse trust bar'}
                >
                  <motion.svg
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
              </div>

              {/* Mobile Expanded View */}
              <AnimatePresence>
                {isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-blue-700 border-t border-blue-500"
                  >
                    <div className="px-4 py-3 space-y-2">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm">{item.icon}</span>
                          <span className="text-sm font-medium">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
