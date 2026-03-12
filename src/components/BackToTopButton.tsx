'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 left-8 p-3 rounded-full bg-yellow-500 text-black shadow-lg transition-opacity duration-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}