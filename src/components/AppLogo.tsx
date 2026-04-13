import React from 'react';

const AppLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rounded square background */}
    <rect width="32" height="32" rx="8" fill="#2D3748" />
    {/* Card shape */}
    <rect x="6" y="9" width="20" height="14" rx="2.5" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    {/* Accent line left */}
    <rect x="6" y="9" width="5" height="14" rx="2.5" fill="white" fillOpacity="0.25" />
    {/* Name lines */}
    <rect x="13" y="13" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.8" />
    <rect x="13" y="16.5" width="7" height="1" rx="0.5" fill="white" fillOpacity="0.4" />
    {/* Contact dots */}
    <circle cx="14" cy="20" r="0.75" fill="white" fillOpacity="0.5" />
    <circle cx="17" cy="20" r="0.75" fill="white" fillOpacity="0.5" />
    <circle cx="20" cy="20" r="0.75" fill="white" fillOpacity="0.5" />
  </svg>
);

export default AppLogo;
