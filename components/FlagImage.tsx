
import React, { useState } from 'react';

interface FlagImageProps {
  url: string;
  name: string;
  className?: string;
}

const FlagImage: React.FC<FlagImageProps> = ({ url, name, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <>
      <div 
        className={`relative overflow-hidden cursor-zoom-in rounded-lg shadow-md transition-transform hover:scale-[1.02] ${className}`}
        onClick={toggleZoom}
      >
        <img 
          src={url} 
          alt={`Flag of ${name}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity" />
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 cursor-zoom-out animate-in fade-in duration-300"
          onClick={toggleZoom}
        >
          <img 
            src={url} 
            alt={`Detailed flag of ${name}`} 
            className="max-w-full max-h-full shadow-2xl rounded-sm object-contain animate-in zoom-in-95 duration-300"
          />
          <button 
            className="absolute top-6 right-6 text-white text-3xl hover:text-slate-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default FlagImage;
