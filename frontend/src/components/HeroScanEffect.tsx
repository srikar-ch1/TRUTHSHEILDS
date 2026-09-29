/**
 * Scanning beam + glitch effect with CSS/SVG – no WebGL.
 * Face-like dots + soundwave dots; beam sweeps left-to-right, revealing red "glitch".
 */
import { useEffect, useState } from "react";

const DOT_COUNT_FACE = 220;
const DOT_COUNT_WAVE = 100;
const BEAM_WIDTH_PERCENT = 12;
const CYCLE_MS = 5000;

function useBeamPosition() {
  const [beam, setBeam] = useState(0);
  useEffect(() => {
    let start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - start) / CYCLE_MS;
      setBeam((t % 1) * 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return beam;
}

export default function HeroScanEffect() {
  const beam = useBeamPosition();

  const faceDots = [];
  const r = 22;
  for (let i = 0; i < DOT_COUNT_FACE; i++) {
    const phi = Math.acos(-1 + (2 * i) / DOT_COUNT_FACE);
    const theta = Math.sqrt(DOT_COUNT_FACE * Math.PI) * phi;
    const x = 50 + r * Math.sin(phi) * Math.cos(theta);
    const y = 38 + r * 0.9 * Math.cos(phi);
    faceDots.push({ x, y });
  }

  const waveDots = [];
  for (let i = 0; i < DOT_COUNT_WAVE; i++) {
    const t = i / DOT_COUNT_WAVE;
    const x = 15 + t * 70;
    const y = 78 + Math.sin(t * Math.PI * 4) * 4 + Math.sin(t * 12) * 1.5;
    waveDots.push({ x, y });
  }

  const allDots = [...faceDots, ...waveDots];

  return (
    <div
      className="absolute inset-0 min-h-[85vh] pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden
    >
      {/* Cyan dots – face + wave */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 42%, rgba(34, 211, 238, 0.12) 0%, transparent 55%)`,
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        {allDots.map((d, i) => (
          <circle
            key={`cyan-${i}`}
            cx={d.x}
            cy={d.y}
            r="0.65"
            fill="#22d3ee"
            opacity="0.95"
          />
        ))}
      </svg>

      {/* Moving beam: red glitch dots revealed in strip */}
      <div
        className="absolute top-0 bottom-0 overflow-hidden"
        style={{
          left: `${beam}%`,
          width: `${BEAM_WIDTH_PERCENT}%`,
          marginLeft: `${-BEAM_WIDTH_PERCENT / 2}%`,
        }}
      >
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: `${(100 / BEAM_WIDTH_PERCENT) * 100}%`,
            marginLeft: `${-(beam / 100) * (100 / BEAM_WIDTH_PERCENT) * 100}%`,
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 100 100"
          >
            {allDots.map((d, i) => (
              <circle
                key={`red-${i}`}
                cx={d.x}
                cy={d.y}
                r="0.75"
                fill="#ff3366"
                opacity="1"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Visible scan line – bright vertical strip */}
      <div
        className="absolute top-0 bottom-0 w-1"
        style={{
          left: `${beam}%`,
          marginLeft: "-2px",
          boxShadow: "0 0 24px rgba(34, 211, 238, 0.9), 0 0 48px rgba(255, 51, 102, 0.5)",
          background: "linear-gradient(180deg, transparent 0%, rgba(34, 211, 238, 0.7) 40%, rgba(255, 51, 102, 0.8) 50%, rgba(34, 211, 238, 0.7) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
