
import React from 'react';

interface ObstacleProps {
  position: { x: number, y: number };
  height: number;
  width: number;
  isTop: boolean;
  speed: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ position, height, width, isTop, speed }) => {
  const animationDuration = `${5 / speed}s`;
  
  const obstacleStyle = {
    height: `${height}px`,
    width: `${width}px`,
    left: `${position.x}px`,
    top: isTop ? 0 : `${position.y}px`,
    backgroundImage: 'linear-gradient(135deg, #e60000 0%, #ff0000 50%, #cc0000 100%)',
    borderRight: '8px solid #990000',
    borderLeft: '4px solid #660000',
    boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
  };

  const spikeStyle = {
    width: 0,
    height: 0,
    borderLeft: `${width / 2}px solid transparent`,
    borderRight: `${width / 2}px solid transparent`,
    borderTop: isTop ? 'none' : '20px solid #990000',
    borderBottom: isTop ? '20px solid #990000' : 'none',
    position: 'absolute' as 'absolute',
    left: 0,
    [isTop ? 'bottom' : 'top']: 0,
  };

  return (
    <div 
      className="obstacle absolute z-10"
      style={obstacleStyle}
    >
      <div style={spikeStyle}></div>
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 flex flex-col justify-around items-center">
          {Array.from({ length: Math.floor(height / 50) }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-2/3 h-1 bg-white rounded-full"
              style={{ opacity: 0.5 + (idx % 3) * 0.2 }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Obstacle;
