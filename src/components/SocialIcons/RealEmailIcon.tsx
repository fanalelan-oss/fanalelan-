import React from 'react';

const RealEmailIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="10" fill="#EA4335"/>
    <path d="M12 16C12 13.7909 13.7909 12 16 12H32C34.2091 12 36 13.7909 36 16V32C36 34.2091 34.2091 36 32 36H16C13.7909 36 12 34.2091 12 32V16Z" fill="white" fillOpacity="0.2"/>
    <path d="M12 16.5L24 26L36 16.5V32C36 33.1046 35.1046 34 34 34H14C12.8954 34 12 33.1046 12 32V16.5Z" fill="white"/>
    <path d="M36 16L24 25.5L12 16H36Z" fill="#F1F1F1"/>
  </svg>
);

export default RealEmailIcon;
