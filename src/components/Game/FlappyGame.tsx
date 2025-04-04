import React, { useState, useEffect, useRef, useCallback } from "react";
import Bird from "./Bird";
import Obstacle from "./Obstacle";
import ScoreBoard from "./ScoreBoard";
import GameOver from "./GameOver";
import StartScreen from "./StartScreen";
import { toast } from "sonner";

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const BIRD_SIZE = 50;
const BIRD_X_POSITION = 100;
const OBSTACLE_WIDTH = 80;
const OBSTACLE_GAP = 250;
const OBSTACLE_SPEED_INITIAL = 0.8;
const OBSTACLE_SPEED_INCREMENT = 0.01;
const OBSTACLE_SPAWN_INTERVAL = 2000;

const FlappyGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [birdPosition, setBirdPosition] = useState({
    x: BIRD_X_POSITION,
    y: 300,
  });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [obstacles, setObstacles] = useState<
    Array<{ x: number; height: number; passed: boolean }>
  >([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacleSpeed, setObstacleSpeed] = useState(OBSTACLE_SPEED_INITIAL);
  const [isFlapping, setIsFlapping] = useState(false);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastObstacleTimeRef = useRef<number>(0);
  const gameHeightRef = useRef<number>(0);
  const gameWidthRef = useRef<number>(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("anyoFlappyHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (gameContainerRef.current) {
        gameHeightRef.current = gameContainerRef.current.clientHeight;
        gameWidthRef.current = gameContainerRef.current.clientWidth;
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleJump = useCallback(() => {
    if (!gameStarted) return;

    setBirdVelocity(JUMP_FORCE);
    setIsFlapping(true);

    setTimeout(() => setIsFlapping(false), 300);

    if (gameOver) {
      resetGame();
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleJump();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [handleJump]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const updateGameState = (timestamp: number) => {
      if (
        !lastObstacleTimeRef.current ||
        timestamp - lastObstacleTimeRef.current >
          OBSTACLE_SPAWN_INTERVAL / obstacleSpeed
      ) {
        const minHeight = 50;
        const maxHeight = gameHeightRef.current - OBSTACLE_GAP - minHeight;
        const newObstacleHeight = Math.floor(
          Math.random() * (maxHeight - minHeight) + minHeight
        );

        setObstacles((prev) => [
          ...prev,
          {
            x: gameWidthRef.current,
            height: newObstacleHeight,
            passed: false,
          },
        ]);

        lastObstacleTimeRef.current = timestamp;
      }

      const newVelocity = birdVelocity + GRAVITY;
      const newY = birdPosition.y + newVelocity;
      const newRotation = Math.min(90, Math.max(-45, newVelocity * 2));

      setBirdVelocity(newVelocity);
      setBirdPosition((prev) => ({ ...prev, y: newY }));
      setBirdRotation(newRotation);

      setObstacles((prev) => {
        return prev
          .map((obstacle) => {
            const newX = obstacle.x - obstacleSpeed * 5;

            if (!obstacle.passed && newX + OBSTACLE_WIDTH < BIRD_X_POSITION) {
              setScore((s) => {
                const newScore = s + 1;

                if (newScore % 5 === 0) {
                  setObstacleSpeed((prev) =>
                    Math.min(3, prev + OBSTACLE_SPEED_INCREMENT)
                  );
                  toast(
                    `Speed increased! Level ${Math.floor(newScore / 5) + 1}`
                  );
                }

                if (newScore > highScore) {
                  setHighScore(newScore);
                  localStorage.setItem(
                    "anyoFlappyHighScore",
                    newScore.toString()
                  );
                }

                return newScore;
              });

              return { ...obstacle, passed: true };
            }

            return { ...obstacle, x: newX };
          })
          .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH);
      });

      if (newY <= 0 || newY >= gameHeightRef.current - BIRD_SIZE) {
        handleGameOver();
        return;
      }

      for (const obstacle of obstacles) {
        if (
          BIRD_X_POSITION + BIRD_SIZE > obstacle.x &&
          BIRD_X_POSITION < obstacle.x + OBSTACLE_WIDTH
        ) {
          const isInGap =
            birdPosition.y > obstacle.height &&
            birdPosition.y + BIRD_SIZE < obstacle.height + OBSTACLE_GAP;

          if (!isInGap) {
            handleGameOver();
            return;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateGameState);
    };

    animationFrameRef.current = requestAnimationFrame(updateGameState);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [
    birdPosition,
    birdVelocity,
    gameStarted,
    gameOver,
    obstacles,
    obstacleSpeed,
    highScore,
  ]);

  const handleGameOver = () => {
    setGameOver(true);
    cancelAnimationFrame(animationFrameRef.current);
    toast.error("Game Over!");
  };

  const startGame = () => {
    resetGame();
    setGameStarted(true);
    toast.success("Game Started! Fly the ANYO!");
  };

  const resetGame = () => {
    setBirdPosition({ x: BIRD_X_POSITION, y: 300 });
    setBirdVelocity(0);
    setBirdRotation(0);
    setObstacles([]);
    setScore(0);
    setObstacleSpeed(OBSTACLE_SPEED_INITIAL);
    setGameOver(false);
    lastObstacleTimeRef.current = 0;
  };

  return (
    <div
      ref={gameContainerRef}
      className="game-container w-full h-full min-h-[600px] relative overflow-hidden"
      onClick={gameStarted && !gameOver ? handleJump : undefined}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-red-900/40 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/80"></div>

        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white z-0"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `pulse ${
                Math.random() * 3 + 2
              }s ease-in-out infinite alternate`,
            }}
          ></div>
        ))}
      </div>

      <Bird
        position={birdPosition}
        rotation={birdRotation}
        isFlapping={isFlapping}
        isDead={gameOver}
      />

      {obstacles.map((obstacle, index) => (
        <React.Fragment key={index}>
          <Obstacle
            position={{ x: obstacle.x, y: obstacle.height + OBSTACLE_GAP }}
            height={gameHeightRef.current - obstacle.height - OBSTACLE_GAP}
            width={OBSTACLE_WIDTH}
            isTop={false}
            speed={obstacleSpeed}
          />
          <Obstacle
            position={{ x: obstacle.x, y: 0 }}
            height={obstacle.height}
            width={OBSTACLE_WIDTH}
            isTop={true}
            speed={obstacleSpeed}
          />
        </React.Fragment>
      ))}

      <ScoreBoard score={score} highScore={highScore} />

      {!gameStarted && <StartScreen onStart={startGame} />}
      {gameOver && (
        <GameOver score={score} highScore={highScore} onRestart={startGame} />
      )}

      <div className="absolute bottom-3 left-0 right-0 mx-auto text-center text-white/40 text-xs z-30">
        <p>ANYO Flappy Bird • Built for the ANYO_nft community</p>
      </div>
    </div>
  );
};

export default FlappyGame;
