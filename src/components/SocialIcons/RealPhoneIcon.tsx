import React from 'react';

const RealPhoneIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#FBBF24"/>
    <path d="M34.3 30.5C32.8 30.5 31.4 30.3 30 29.8C29.6 29.7 29.1 29.8 28.8 30.1L25.6 33.3C23 32 21 30 19.7 27.4L22.9 24.2C23.2 23.9 23.3 23.4 23.2 23C22.7 21.6 22.5 20.2 22.5 18.7C22.5 17.8 21.7 17 20.8 17H17.2C16.3 17 15.5 17.8 15.5 18.7C15.5 29.1 23.9 37.5 34.3 37.5C35.2 37.5 36 36.7 36 35.8V32.2C36 31.3 35.2 30.5 34.3 30.5Z" fill="black"/>
  </svg>
);

export default RealPhoneIcon;
