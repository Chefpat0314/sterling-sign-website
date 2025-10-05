// components/SocialProof.tsx - Reviews and client logos carousel
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  quote: string;
  author: string;
  company?: string;
  rating: number;
  avatar?: string;
  logoUrl?: string;
}

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  url?: string;
}

interface SocialProofProps {
  reviews?: Review[];
  clientLogos?: ClientLogo[];
  showReviews?: boolean;
  showLogos?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const defaultReviews: Review[] = [
  {
    id: '1',
    quote: 'Sterling delivered our banner on time and the quality exceeded our expectations. Will definitely use again!',
    author: 'Sarah Johnson',
    company: 'ABC Construction',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    id: '2',
    quote: 'Fast turnaround and professional service. The design team helped us perfect our vision.',
    author: 'Mike Chen',
    company: 'Tech Startup Inc',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    id: '3',
    quote: 'Quality signs at competitive prices. The rush service saved our event!',
    author: 'Lisa Rodriguez',
    company: 'Event Planning Co',
    rating: 5,
    avatar: '👩‍🎨',
  },
  {
    id: '4',
    quote: 'Excellent customer service and the proof process was seamless. Highly recommended!',
    author: 'David Wilson',
    company: 'Retail Solutions',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    id: '5',
    quote: 'Professional installation and great communication throughout the project.',
    author: 'Jennifer Lee',
    company: 'Healthcare Partners',
    rating: 5,
    avatar: '👩‍⚕️',
  },
];

const defaultClientLogos: ClientLogo[] = [
  {
    id: '1',
    name: 'ABC Construction',
    logoUrl: '/images/clients/abc-construction.png',
  },
  {
    id: '2',
    name: 'Tech Startup Inc',
    logoUrl: '/images/clients/tech-startup.png',
  },
  {
    id: '3',
    name: 'Event Planning Co',
    logoUrl: '/images/clients/event-planning.png',
  },
  {
    id: '4',
    name: 'Retail Solutions',
    logoUrl: '/images/clients/retail-solutions.png',
  },
  {
    id: '5',
    name: 'Healthcare Partners',
    logoUrl: '/images/clients/healthcare-partners.png',
  },
  {
    id: '6',
    name: 'Education First',
    logoUrl: '/images/clients/education-first.png',
  },
];

export default function SocialProof({
  reviews = defaultReviews,
  clientLogos = defaultClientLogos,
  showReviews = true,
  showLogos = true,
  autoPlay = true,
  interval = 5000,
  className = '',
}: SocialProofProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying || reviews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, reviews.length]);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentReviewIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Reviews Section */}
      {showReviews && reviews.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h3>
            <p className="text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-6">
                  {renderStars(reviews[currentReviewIndex].rating)}
                </div>
                
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{reviews[currentReviewIndex].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-3xl">
                    {reviews[currentReviewIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {reviews[currentReviewIndex].author}
                    </div>
                    {reviews[currentReviewIndex].company && (
                      <div className="text-sm text-gray-600">
                        {reviews[currentReviewIndex].company}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Review Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevReview}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Previous review"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToReview(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentReviewIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Next review"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label={isPlaying ? 'Pause reviews' : 'Play reviews'}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-4h1m4 0h1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Logos Section */}
      {showLogos && clientLogos.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Leading Companies
            </h3>
            <p className="text-gray-600">
              Join our growing list of satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clientLogos.map((logo, index) => (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {logo.logoUrl ? (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {logo.name.charAt(0)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { number: '98.6%', label: 'On-Time Delivery' },
          { number: '+64', label: 'NPS Score' },
          { number: '15k+', label: 'Happy Customers' },
          { number: '2h', label: 'Average Proof Time' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="text-center p-6 bg-white rounded-lg shadow-sm"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
