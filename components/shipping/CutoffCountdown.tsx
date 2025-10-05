// components/shipping/CutoffCountdown.tsx - Daily cutoff countdown timer
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analytics } from '../../lib/metrics';
import { SHIPPING_CONFIG } from '../../config/shipping';

interface CutoffCountdownProps {
  className?: string;
  onCutoffPassed?: () => void;
}

export default function CutoffCountdown({ 
  className = '',
  onCutoffPassed
}: CutoffCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null>(null);
  const [isAfterCutoff, setIsAfterCutoff] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const [cutoffHour, cutoffMinute] = SHIPPING_CONFIG.dailyCutoffLocal.split(':').map(Number);
      
      const cutoffToday = new Date(now);
      cutoffToday.setHours(cutoffHour, cutoffMinute, 0, 0);
      
      const cutoffTomorrow = new Date(cutoffToday);
      cutoffTomorrow.setDate(cutoffTomorrow.getDate() + 1);
      
      const targetCutoff = now < cutoffToday ? cutoffToday : cutoffTomorrow;
      const diff = targetCutoff.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsAfterCutoff(true);
        if (onCutoffPassed) onCutoffPassed();
        return null;
      }
      
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return { hours, minutes, seconds, totalSeconds };
    };

    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      // Track analytics when timer is first shown
      if (remaining && !hasTracked) {
        analytics.track('cutoff_timer_viewed', {
          secondsRemaining: remaining.totalSeconds,
          cutoffState: 'before_cutoff',
        });
        setHasTracked(true);
      }
    };

    // Initial calculation
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [onCutoffPassed, hasTracked]);

  if (isAfterCutoff) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 ${className}`}
      >
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-orange-800">
          Orders now start tomorrow
        </span>
      </motion.div>
    );
  }

  if (!timeRemaining) {
    return null;
  }

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 ${className}`}
    >
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm font-medium text-blue-800">
        Order in {formatTime(timeRemaining.hours)}h {formatTime(timeRemaining.minutes)}m for today's production start
      </span>
    </motion.div>
  );
}
