
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center game-over-blur animate-fade-in">
      <div className="bg-black/80 border border-primary/30 rounded-xl p-8 max-w-md w-full mx-4 backdrop-blur-md shadow-2xl">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-white animate-pulse-scale">Game Over</h2>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-sm text-white/60 uppercase">Score</p>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <p className="text-sm text-white/60 uppercase">Best</p>
              <p className="text-3xl font-bold text-white">{highScore}</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            {score === highScore && score > 0 && (
              <div className="text-center mb-4">
                <p className="text-primary font-bold animate-bounce-soft inline-block">
                  🏆 New High Score! 🏆
                </p>
              </div>
            )}
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg transition-transform hover:translate-y-[-2px]"
              onClick={onRestart}
            >
              Try Again
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-white/60 text-sm">
                Tap the screen or press spacebar to fly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
