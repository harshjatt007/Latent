import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('latent-theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('latent-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hanging pull-cord light switch
export const RopeLightSwitch = () => {
  const { isDark, toggleTheme } = useTheme();
  const [pulling, setPulling] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const pullStartY = useRef(null);
  const ropeRef = useRef(null);

  const handlePullStart = (e) => {
    pullStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    setPulling(true);
    document.addEventListener('mousemove', handlePullMove);
    document.addEventListener('mouseup', handlePullEnd);
    document.addEventListener('touchmove', handlePullMove);
    document.addEventListener('touchend', handlePullEnd);
  };

  const handlePullMove = (e) => {
    if (!pullStartY.current) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    if (ropeRef.current) {
      const pulled = Math.min(Math.max(currentY - pullStartY.current, 0), 40);
      ropeRef.current.style.transform = `translateY(${pulled}px)`;
    }
  };

  const handlePullEnd = (e) => {
    const currentY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const delta = currentY - (pullStartY.current || currentY);
    if (ropeRef.current) {
      ropeRef.current.style.transform = 'translateY(0)';
    }
    if (delta > 15) {
      toggleTheme();
      setSwinging(true);
      setTimeout(() => setSwinging(false), 1000);
    }
    setPulling(false);
    pullStartY.current = null;
    document.removeEventListener('mousemove', handlePullMove);
    document.removeEventListener('mouseup', handlePullEnd);
    document.removeEventListener('touchmove', handlePullMove);
    document.removeEventListener('touchend', handlePullEnd);
  };

  return (
    <div className="relative flex flex-col items-center select-none z-[100]" style={{ height: 70, width: 60, marginTop: -15 }}>
      {/* Ceiling Connection (Always stays at the top) */}
      <div className={`w-0.5 h-6 ${isDark ? 'bg-gray-800' : 'bg-gray-300'} absolute top-0`} />

      {/* Swinging Assembly */}
      <div
        ref={ropeRef}
        onMouseDown={handlePullStart}
        onTouchStart={handlePullStart}
        onClick={() => { toggleTheme(); setSwinging(true); setTimeout(() => setSwinging(false), 1000); }}
        className={`flex flex-col items-center cursor-pointer transition-transform ${swinging ? 'animate-swing' : ''}`}
        style={{ userSelect: 'none', transformOrigin: 'top center', marginTop: 10 }}
        title={isDark ? 'Pull to turn light ON' : 'Pull to turn light OFF'}
      >
        {/* The main rope segment */}
        <div className={`w-0.5 h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} shadow-sm`} />
        
        {/* Connector */}
        <div className={`w-5 h-3 bg-gray-800 rounded-t-lg -mt-1 flex flex-col items-center shadow-lg border-t border-gray-700`}>
           <div className="w-6 h-0.5 bg-gray-700 rounded-full" />
        </div>

        {/* The Bulb */}
        <div className="relative -mt-0.5">
          <svg width="30" height="38" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 drop-shadow-xl">
            {/* Glow if ON */}
            {!isDark && (
              <circle cx="17" cy="22" r="20" fill="#FDE047" fillOpacity="0.6" className="animate-pulse" />
            )}
            
            {/* Bulb Glass */}
            <path 
              d="M17 38C10.3726 38 5 32.6274 5 26C5 21.5 8 18.5 10 16V10H24V16C26 18.5 29 21.5 29 26C29 32.6274 23.6274 38 17 38Z" 
              fill={isDark ? "#374151" : "#FDE047"} 
              stroke={isDark ? "#4B5563" : "#EAB308"} 
              strokeWidth="2"
            />
            
            {/* Filament */}
            <path 
              d="M14 22C14 22 15 20 17 20C19 20 20 22 20 22M14 26C14 26 15 24 17 24C19 24 20 26 20 26" 
              stroke={isDark ? "#6B7280" : "#A16207"} 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes swing {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(20deg); }
          30%  { transform: rotate(-16deg); }
          45%  { transform: rotate(10deg); }
          60%  { transform: rotate(-6deg); }
          75%  { transform: rotate(3deg); }
          90%  { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-swing {
          animation: swing 1s ease-out;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};
