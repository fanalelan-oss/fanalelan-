'use client';

import { useEffect, useState } from 'react';
import '../app/animations.css';

const AnimatedLogo = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Set up the 10-second interval to restart the animation
    const interval = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="logo-stage w-14 h-14" key={key}>
      <div className="glow"></div>
      <svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="part-large">
          <path d="M22 22 H78 V45 H48 V75 H22 Z" fill="#ff9000" />
        </g>
        <g className="part-small">
          <rect x="52" y="52" width="34" height="34" rx="7" fill="#ff9000" />
          {/* Using Noto Kufi Arabic font with the original white color */}
          <text 
            x="69" 
            y="78" 
            className="text-element" 
            fontFamily="var(--font-noto-kufi), sans-serif" 
            fontSize="22" 
            fontWeight="900" 
            fill="#ffffff" 
            textAnchor="middle"
          >
            فن
          </text>
        </g>
      </svg>
    </div>
  );
}

export default AnimatedLogo;
