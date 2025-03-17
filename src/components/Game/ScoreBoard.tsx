
import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="absolute top-5 left-0 right-0 mx-auto w-full max-w-xs flex flex-col items-center gap-2 p-4 z-30 text-white font-bold text-shadow-lg backdrop-blur-sm bg-black/20 rounded-xl">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm uppercase opacity-80">Score</span>
          <span className="text-3xl">{score}</span>
        </div>
        <div className="w-px h-12 bg-white/20"></div>
        <div className="flex flex-col items-end">
          <span className="text-sm uppercase opacity-80">Best</span>
          <span className="text-3xl">{highScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
