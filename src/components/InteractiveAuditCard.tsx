import React, { useState, useRef } from 'react';

interface AuditItem {
  id: string;
  title: string;
  subtitle: string;
  icon: 'website' | 'rankings' | 'maps' | 'aisearch';
  score: number;
  status: 'complete' | 'scanning' | 'warning';
  detail: string;
  metricLabel: string;
}

const auditData: AuditItem[] = [
  {
    id: 'website',
    title: 'Your website',
    subtitle: 'Speed, mobile, consultation requests',
    icon: 'website',
    score: 100,
    status: 'complete',
    detail: '⚡ 98/100 Mobile Speed Score · SSL Secured · High Consultation Conversion Architecture',
    metricLabel: '100% Optimized'
  },
  {
    id: 'rankings',
    title: 'Google rankings',
    subtitle: 'Where you show up for your procedures',
    icon: 'rankings',
    score: 100,
    status: 'complete',
    detail: '📈 Rank #1 for Facelift, Rhinoplasty, & Blepharoplasty in your target geographic market',
    metricLabel: 'Rank #1 Authority'
  },
  {
    id: 'maps',
    title: 'Google Maps',
    subtitle: 'Profile, reviews, nearby searches',
    icon: 'maps',
    score: 100,
    status: 'complete',
    detail: '📍 Top 3 Map Pack Placement · 150+ Verified 5-Star Reviews · Geo-targeted Local SEO',
    metricLabel: 'Top 3 Map Pack'
  },
  {
    id: 'aisearch',
    title: 'AI search',
    subtitle: 'ChatGPT, Gemini, Google AI answers',
    icon: 'aisearch',
    score: 88,
    status: 'scanning',
    detail: '🤖 Cited as top-recommended facial surgeon on ChatGPT, Gemini, & Google AI Overviews',
    metricLabel: 'AI Recommended'
  }
];

export default function InteractiveAuditCard() {
  const [activeId, setActiveId] = useState<string>('aisearch');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scanLaserPos, setScanLaserPos] = useState<number>(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const activeIndex = auditData.findIndex((item) => item.id === activeId);

  // 3D Card Hover Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // max tilt ~ 5 degrees
    const rotateX = (-y / (rect.height / 2)) * 5;
    const rotateY = (x / (rect.width / 2)) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Trigger Live Audit Scan Simulation
  const handleStartScan = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLaserPos(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 4;
      setScanLaserPos(currentStep);
      setScanProgress(Math.min(100, Math.floor(currentStep * 1.05)));

      if (currentStep >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
        }, 400);
      }
    }, 40);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="relative w-full max-w-[460px] cursor-pointer select-none group/card"
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C5A880]/20 via-[#1D60C8]/20 to-[#C5A880]/20 rounded-3xl blur-2xl transform rotate-1 scale-98 transition-opacity group-hover/card:opacity-100 opacity-70"></div>

      {/* Main Audit Card Surface */}
      <div className="relative bg-white text-neutral-900 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(5,19,41,0.25)] border border-white/60 overflow-hidden">
        
        {/* Animated Scanning Laser Overlay */}
        {isScanning && (
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent shadow-[0_0_15px_#C5A880] z-30 transition-all duration-75 pointer-events-none"
            style={{ top: `${scanLaserPos}%` }}
          />
        )}

        {/* Card Header Bar */}
        <div className="flex items-start justify-between pb-3.5 mb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#C5A880] uppercase block">
                PRACTICE VISIBILITY AUDIT
              </span>
              {isScanning && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold animate-pulse">
                  Scanning... {scanProgress}%
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#051329] tracking-tight font-urbanist mt-0.5">
              Your practice, as patients see it
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Four places patients look before they book
            </p>
          </div>

          {/* Interactive Re-Scan Button */}
          <button
            onClick={handleStartScan}
            title="Click to run live interactive scan"
            className="group/scan relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#051329] hover:bg-[#1D60C8] text-[#C5A880] hover:text-white transition-all duration-300 shadow-md shrink-0 active:scale-95"
          >
            <svg
              className={`w-4 h-4 ${isScanning ? 'animate-spin' : 'group-hover/scan:rotate-180 transition-transform duration-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Audit Channel Items List */}
        <div className="relative space-y-3 mb-5">

          {auditData.map((item, index) => {
            const isSelected = activeId === item.id;
            const itemProgress = isScanning
              ? Math.min(100, Math.max(0, (scanProgress - index * 20) * 1.5))
              : item.score;

            return (
              <div key={item.id} className="relative">
                <div
                  onClick={() => setActiveId(item.id)}
                  onMouseEnter={() => setActiveId(item.id)}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/70 border-2 border-[#C5A880]/60 shadow-sm transform translate-x-1'
                      : 'bg-neutral-50/80 hover:bg-neutral-100/90 border border-neutral-100'
                  }`}
                >
                  {/* Left: Icon & Label */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs ${
                        isSelected
                          ? 'bg-[#051329] text-[#C5A880] scale-105'
                          : 'bg-[#1D60C8] text-white'
                      }`}
                    >
                      {item.icon === 'website' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      )}
                      {item.icon === 'rankings' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {item.icon === 'maps' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {item.icon === 'aisearch' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>

                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
                        )}
                      </p>
                      <p className="text-[10px] sm:text-xs text-neutral-500 font-medium truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress Bar & Status Badge */}
                  <div className="flex items-center gap-2.5 shrink-0 pl-2">
                    <div className="w-16 sm:w-24 h-2.5 rounded-full bg-neutral-200/80 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === 'scanning' && isSelected
                            ? 'bg-gradient-to-r from-[#C5A880] via-amber-400 to-[#C5A880]'
                            : 'bg-[#C5A880]'
                        }`}
                        style={{ width: `${itemProgress}%` }}
                      />
                    </div>

                    {item.status === 'complete' || itemProgress >= 100 ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-[#051329] flex items-center justify-center text-[10px] font-bold shadow-xs animate-pulse">
                        ···
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Interactive Detail Insight Drawer */}
                {isSelected && (
                  <div className="mt-1.5 px-3 py-2 rounded-xl bg-[#051329] text-white text-[11px] leading-snug font-medium flex items-center justify-between shadow-inner animate-fadeIn">
                    <span className="text-amber-200/90">{item.detail}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-bold shrink-0 ml-2">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* 
            Redesigned Optical Magnifying Glass Lens Overlay
            Positioned smoothly according to activeIndex!
          */}
          <div
            className="absolute right-1 sm:right-2 pointer-events-none transition-all duration-500 ease-out z-20"
            style={{
              top: `${activeIndex * 68 + 6}px`
            }}
          >
            <div className="relative transform rotate-[-12deg] group-hover/card:scale-105 transition-transform duration-300">
              
              {/* Radar Wave Pulse Ring around Lens */}
              <div className="absolute -inset-2 rounded-full border border-[#C5A880]/40 animate-ping opacity-40"></div>
              
              {/* Precision Optical Lens Frame */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[2.5px] border-[#C5A880] bg-gradient-to-br from-white/80 via-amber-100/30 to-[#C5A880]/30 backdrop-blur-md shadow-[0_8px_20px_rgba(197,168,128,0.4)] flex items-center justify-center overflow-hidden">
                
                {/* Glass Optical Glare Sheen Line */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent transform -skew-y-12"></div>
                
                {/* Precision Crosshair Target Reticle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-[#C5A880]"></div>
                  <div className="h-full w-[1px] bg-[#C5A880] absolute"></div>
                </div>

                {/* Glowing Center Focal Point Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880] animate-pulse relative z-10"></div>
              </div>

              {/* Sleek Metallic Gold & Navy Handle angled at 45 degrees */}
              <div className="absolute bottom-[-6px] right-[-10px] w-7 h-2 sm:w-8 sm:h-2.5 bg-gradient-to-r from-[#E2C8A0] via-[#C5A880] to-[#8C6D3B] rounded-full transform rotate-45 origin-left shadow-md border border-amber-900/20">
                {/* Ferrule Gold Collar Ring */}
                <div className="w-1.5 h-full bg-[#051329] rounded-l-xs"></div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Dark Navy Pill Banner */}
        <a
          href="https://audit.seelutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#051329] hover:bg-[#081B3A] text-white py-3 px-4 rounded-xl text-center text-xs font-medium shadow-md transition-all duration-300 hover:scale-[1.01] group/btn"
        >
          <span>Where patients go instead, </span>
          <span className="text-[#C5A880] font-bold underline underline-offset-2 group-hover/btn:text-amber-300">
            and how to fix it →
          </span>
        </a>

      </div>
    </div>
  );
}
