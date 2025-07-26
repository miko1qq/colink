import React from 'react';
import logoImage from '@/assets/logo.png';

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
      <img
        src={logoImage}
        alt="Coventry University Astana Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CoventryLogo;