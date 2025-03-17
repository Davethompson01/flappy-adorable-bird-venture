
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
      className={`absolute w-16 h-16 z-20 select-none ${isFlapping && !isDead ? 'animate-bounce-soft' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: isDead ? 'none' : 'transform 0.2s ease',
        willChange: 'transform'
      }}
    >
      <img 
        src="/lovable-uploads/ad198057-0b57-4427-bbc4-1fabc084dc0f.png" 
        alt="ANYO Bird" 
        className={`w-full h-full object-contain ${isDead ? 'opacity-75' : 'opacity-100'}`}
        style={{ filter: isDead ? 'grayscale(50%)' : 'none' }}
      />
    </div>
  );
};

export default Bird;
