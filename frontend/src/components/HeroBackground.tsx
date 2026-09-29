/**
 * Hero background that clearly communicates deepfake detection and voice scam detection.
 * No random 3D – only intentional, product-relevant visuals. Official web design.
 */
export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 min-h-[85vh] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #050b14 0%, #0c1424 45%, #050b14 100%)",
        }}
      />

      {/* Video frame grid – suggests frame-by-frame deepfake analysis */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="video-frames"
            x="0"
            y="0"
            width="120"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {[...Array(12)].map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              return (
                <rect
                  key={i}
                  x={12 + col * 28}
                  y={8 + row * 24}
                  width={24}
                  height={18}
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-cyan-400"
                />
              );
            })}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#video-frames)" />
      </svg>

      {/* Audio waveform bars – suggests voice / scam call analysis */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-1/3 opacity-[0.06]"
        preserveAspectRatio="none"
        viewBox="0 0 400 120"
      >
        <defs>
          <linearGradient
            id="wave-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {/* Simplified waveform / audio bars */}
        {[20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380].map(
          (x, i) => {
            const h = 20 + (i % 5) * 12 + (i % 3) * 6;
            return (
              <rect
                key={i}
                x={x}
                y={60 - h / 2}
                width="8"
                height={h}
                rx="2"
                fill="url(#wave-gradient)"
              />
            );
          }
        )}
      </svg>

      {/* Soft gradient orbs – minimal, brand only */}
      <div
        className="absolute top-1/4 right-1/4 w-[320px] h-[320px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-[240px] h-[240px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
      />
    </div>
  );
}
