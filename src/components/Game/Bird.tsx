
import React, { useEffect, useRef } from 'react';

interface BirdProps {
  position: { x: number, y: number };
  rotation: number;
  isFlapping: boolean;
  isDead: boolean;
}

const Bird: React.FC<BirdProps> = ({ position, rotation, isFlapping, isDead }) => {
  const birdRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (birdRef.current) {
      birdRef.current.style.transition = isDead ? 'none' : 'transform 0.1s ease';
    }
  }, [isDead]);

  return (
    <div 
      ref={birdRef}
      className={`absolute w-16 h-16 z-20 select-none transition-all duration-300 ease-in-out ${
        isFlapping && !isDead ? 'scale-y-[1.05] scale-x-[0.95]' : ''
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: isDead ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        willChange: 'transform'
      }}
    >
      <div className={`w-full h-full relative ${isFlapping && !isDead ? 'animate-[pulse_0.3s_ease-in-out]' : ''}`}>
        <img 
          src="/lovable-uploads/ad198057-0b57-4427-bbc4-1fabc084dc0f.png" 
          alt="ANYO Bird" 
          className={`w-full h-full object-contain ${isDead ? 'opacity-75' : 'opacity-100'} transition-all duration-200`}
          style={{ 
            filter: isDead ? 'grayscale(50%)' : 'none',
            transform: isFlapping && !isDead ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />
      </div>
    </div>
  );
};

export default Bird;
