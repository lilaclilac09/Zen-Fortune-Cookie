
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stats, CookieState, Fortune } from './types';
import { FORTUNES, STORAGE_KEY, GESTURE_THRESHOLD_START, GESTURE_THRESHOLD_PULL } from './constants';

// Access MediaPipe from global window object defined in index.html
declare const Hands: any;
declare const Camera: any;

const App: React.FC = () => {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { totalPoints: 0, tapCount: 0 };
  });

  const [cookieState, setCookieState] = useState<CookieState>('intact');
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [handsDetected, setHandsDetected] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1

  const [isReadyToPull, setIsReadyToPull] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<any>(null);
  const lastDistanceRef = useRef<number>(0);
  const isReadyToPullRef = useRef<boolean>(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const breakCookie = useCallback(() => {
    if (cookieState !== 'intact') return;

    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    const points = Math.floor(Math.random() * 91) + 10; // 10 to 100

    setCookieState('cracking');
    
    setTimeout(() => {
      setCookieState('broken');
      setCurrentFortune({ text: randomFortune, points });
      setStats(prev => ({
        totalPoints: prev.totalPoints + points,
        tapCount: prev.tapCount + 1
      }));
    }, 400);
  }, [cookieState]);

  const resetCookie = () => {
    setCookieState('resetting');
    setTimeout(() => {
      setCookieState('intact');
      setCurrentFortune(null);
      setPullProgress(0);
      isReadyToPullRef.current = false;
    }, 300);
  };

  // MediaPipe Initialization
  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length >= 2) {
        setHandsDetected(true);
        
        // Simple distance calculation between the centers of two hands (palm base)
        const h1 = results.multiHandLandmarks[0][0];
        const h2 = results.multiHandLandmarks[1][0];
        
        // Convert normalized coordinates to approximate pixel space for easier thresholding
        const dx = (h1.x - h2.x) * 1000;
        const dy = (h1.y - h2.y) * 1000;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!isReadyToPullRef.current && distance < GESTURE_THRESHOLD_START) {
          isReadyToPullRef.current = true;
          setIsReadyToPull(true);
        }

        if (isReadyToPullRef.current) {
          const progress = Math.min(1, Math.max(0, (distance - GESTURE_THRESHOLD_START) / (GESTURE_THRESHOLD_PULL - GESTURE_THRESHOLD_START)));
          setPullProgress(progress);

          if (distance > GESTURE_THRESHOLD_PULL) {
            breakCookie();
            isReadyToPullRef.current = false;
            setIsReadyToPull(false);
          }
        }
        
        lastDistanceRef.current = distance;
      } else {
        setHandsDetected(false);
        setPullProgress(0);
        isReadyToPullRef.current = false;
        setIsReadyToPull(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480
    });

    camera.start().then(() => setIsCameraReady(true));
    handsRef.current = hands;

    return () => {
      camera.stop();
    };
  }, [breakCookie]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-orange-900 font-sans relative">
      {/* Background Stats */}
      <div className="absolute top-8 left-8 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md">
        <div className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Total Points</div>
        <div className="text-3xl font-black text-orange-600">{stats.totalPoints.toLocaleString()}</div>
      </div>
      
      <div className="absolute top-8 right-8 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
        <div className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Cookies Opened</div>
        <div className="text-3xl font-black text-orange-600">{stats.tapCount}</div>
      </div>

      {/* Main Cookie Interaction Area */}
      <div className="relative flex flex-col items-center justify-center z-10">
        
        {/* Cookie Visuals */}
        <div className={`relative transition-transform duration-300 ${cookieState === 'cracking' ? 'animate-shake' : ''}`}>
          
          {cookieState === 'intact' || cookieState === 'cracking' || cookieState === 'resetting' ? (
            <div 
              className={`text-[280px] md:text-[350px] select-none cursor-pointer filter drop-shadow-2xl transition-all duration-100 active:scale-95 ${pullProgress > 0.5 ? 'animate-shake' : ''}`}
              style={{ 
                transform: `scale(${1 + pullProgress * 0.15})`,
                filter: `drop-shadow(0 0 ${pullProgress * 20}px rgba(251, 146, 60, 0.4))`
              }}
              onClick={breakCookie}
            >
              🥠
            </div>
          ) : (
            <div className="flex gap-4 relative">
              {/* Left Piece */}
              <div className="text-[280px] md:text-[350px] select-none -translate-x-12 -rotate-12 filter drop-shadow-xl opacity-80">
                🥠
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-100/80 clip-path-right" style={{ clipPath: 'inset(0 0 0 50%)' }}></div>
              </div>
              {/* Right Piece */}
              <div className="text-[280px] md:text-[350px] select-none translate-x-12 rotate-12 filter drop-shadow-xl opacity-80">
                🥠
              </div>

              {/* Fortune Slip */}
              {currentFortune && (
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 bg-white px-6 py-4 rounded shadow-lg border-t-4 border-orange-400 min-w-[280px] text-center animate-slip z-20">
                  <p className="text-lg font-medium italic mb-2">"{currentFortune.text}"</p>
                  <p className="text-sm font-bold text-orange-500">+{currentFortune.points} Points!</p>
                  <button 
                    onClick={resetCookie}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-md active:scale-95"
                  >
                    Next Cookie
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interaction Hint */}
        <div className="mt-12 max-w-md text-center">
          {cookieState === 'intact' && (
            <div className={`transition-all duration-500 ${handsDetected ? 'opacity-100' : 'opacity-60'}`}>
              <p className="text-xl font-medium mb-2">
                {handsDetected 
                  ? (isReadyToPull ? "Ready! Now pull apart! ↔️" : "Bring your hands closer together first! 👐")
                  : "Place both hands in front of the camera to start! 🥠"}
              </p>
              {handsDetected && !isReadyToPull && (
                <p className="text-sm text-orange-700/70 animate-pulse">
                  (Move hands together to arm the pull)
                </p>
              )}
              {isReadyToPull && (
                <p className="text-sm text-green-600 font-bold animate-bounce">
                  PULL NOW!
                </p>
              )}
              <p className="mt-4 text-xs opacity-40 hover:opacity-100 transition-opacity cursor-pointer" onClick={breakCookie}>
                (Or just click the cookie if you're in a hurry! 🖱️)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Preview (Hidden/Small) */}
      <div className="fixed bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/50 shadow-lg bg-black/20 group hover:w-64 hover:h-48 transition-all duration-500">
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs text-center p-2 bg-orange-900/40">
            Requesting Camera...
          </div>
        )}
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover scale-x-[-1]" 
          autoPlay 
          muted 
          playsInline
        />
        <div className={`absolute top-2 left-2 w-3 h-3 rounded-full ${handsDetected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        
        {/* Debug Info on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-mono p-2">
          <div>Hands: {handsDetected ? 'YES' : 'NO'}</div>
          <div>Ready: {isReadyToPull ? 'YES' : 'NO'}</div>
          <div>Dist: {Math.round(lastDistanceRef.current)}</div>
          <div className="mt-1 text-[8px] opacity-60">Start: {GESTURE_THRESHOLD_START} | Pull: {GESTURE_THRESHOLD_PULL}</div>
        </div>
      </div>

      {/* Pull Progress Visualizer */}
      {cookieState === 'intact' && pullProgress > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-64 h-2 bg-white/30 rounded-full overflow-hidden border border-white/20">
          <div 
            className="h-full bg-orange-500 transition-all duration-100 ease-out"
            style={{ width: `${pullProgress * 100}%` }}
          />
        </div>
      )}

      {/* Decorative Floating Elements */}
      <div className="fixed top-20 right-[15%] text-4xl opacity-20 select-none animate-bounce pointer-events-none">✨</div>
      <div className="fixed bottom-40 left-[10%] text-4xl opacity-20 select-none animate-pulse pointer-events-none">🥠</div>
      <div className="fixed top-1/2 left-[5%] text-4xl opacity-10 select-none pointer-events-none">🌟</div>
    </div>
  );
};

export default App;
