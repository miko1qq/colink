import React from 'react';

interface CoventryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoventryLogo: React.FC<CoventryLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* University Shield Background */}
        <path
          d="M50 5 L20 20 L20 45 Q20 70 50 85 Q80 70 80 45 L80 20 Z"
          fill="#003A70"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        
        {/* Inner Shield */}
        <path
          d="M50 12 L28 24 L28 42 Q28 60 50 72 Q72 60 72 42 L72 24 Z"
          fill="#FFFFFF"
          stroke="#003A70"
          strokeWidth="1"
        />
        
        {/* Central Cross/Book Symbol */}
        <g fill="#003A70">
          {/* Vertical line */}
          <rect x="47" y="30" width="6" height="25" />
          {/* Horizontal line */}
          <rect x="38" y="39" width="24" height="6" />
          {/* Book pages */}
          <rect x="42" y="48" width="16" height="2" />
          <rect x="44" y="52" width="12" height="2" />
          <rect x="46" y="56" width="8" height="2" />
        </g>
        
        {/* Decorative elements */}
        <circle cx="35" cy="32" r="2" fill="#003A70" />
        <circle cx="65" cy="32" r="2" fill="#003A70" />
        <circle cx="50" cy="65" r="3" fill="#003A70" />
      </svg>
    </div>
  );
};

export default CoventryLogo;