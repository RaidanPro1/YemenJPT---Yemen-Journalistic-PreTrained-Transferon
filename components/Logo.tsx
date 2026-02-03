
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YemenJPT Logo"
    >
      {/* Chip Chassis */}
      <rect x="10" y="10" width="80" height="80" rx="18" stroke="#007aff" strokeWidth="5" fill="white" className="drop-shadow-sm"/>
      
      {/* Circuit Nodes (Top/Bottom) */}
      <path d="M35 10V4 M50 10V2 M65 10V4" stroke="#007aff" strokeWidth="4" strokeLinecap="round"/>
      <path d="M35 90V96 M50 90V98 M65 90V96" stroke="#007aff" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Circuit Nodes (Left/Right) */}
      <path d="M10 35H4 M10 50H2 M10 65H4" stroke="#007aff" strokeWidth="4" strokeLinecap="round"/>
      <path d="M90 35H96 M90 50H98 M90 65H96" stroke="#007aff" strokeWidth="4" strokeLinecap="round"/>

      {/* Connection Dots */}
      <circle cx="35" cy="10" r="3" fill="#007aff"/>
      <circle cx="50" cy="10" r="3" fill="#007aff"/>
      <circle cx="65" cy="10" r="3" fill="#007aff"/>
      
      <circle cx="35" cy="90" r="3" fill="#007aff"/>
      <circle cx="50" cy="90" r="3" fill="#007aff"/>
      <circle cx="65" cy="90" r="3" fill="#007aff"/>

      <circle cx="10" cy="35" r="3" fill="#007aff"/>
      <circle cx="10" cy="50" r="3" fill="#007aff"/>
      <circle cx="10" cy="65" r="3" fill="#007aff"/>

      <circle cx="90" cy="35" r="3" fill="#007aff"/>
      <circle cx="90" cy="50" r="3" fill="#007aff"/>
      <circle cx="90" cy="65" r="3" fill="#007aff"/>

      {/* Internal Bezel */}
      <rect x="22" y="22" width="56" height="56" rx="8" stroke="#007aff" strokeWidth="2" strokeOpacity="0.3"/>

      {/* Brand Text */}
      {showText && (
        <>
          <text x="28" y="62" fontFamily="sans-serif" fontWeight="900" fontSize="36" fill="#fbbf24" style={{ filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.1))' }}>J</text>
          <text x="48" y="62" fontFamily="sans-serif" fontWeight="900" fontSize="36" fill="#007aff" style={{ filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.1))' }}>PT</text>
        </>
      )}
    </svg>
  );
};

export default Logo;
