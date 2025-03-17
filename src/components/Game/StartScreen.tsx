
import React from 'react';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            ANYO
            <span className="text-primary"> Flappy Bird</span>
          </h1>
          
          <div className="relative w-32 h-32 mx-auto my-8 animate-bounce-soft">
            <img 
              src="/lovable-uploads/ad198057-0b57-4427-bbc4-1fabc084dc0f.png" 
              alt="ANYO Bird"
              className="w-full h-full object-contain"
            />
          </div>
          
          <p className="text-white/80 text-lg">
            Help the ANYO fly through obstacles!
          </p>
        </div>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-lg transition-transform hover:translate-y-[-2px]"
          onClick={onStart}
        >
          Start Game
        </Button>
        
        <p className="text-white/60 text-sm mt-6">
          Tap the screen or press spacebar to fly
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
