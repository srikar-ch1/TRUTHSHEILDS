/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#050b14",
          925: "#0a0f1a",
          975: "#060a12",
        },
        brand: {
          navy: "#050b14",
          surface: "#0c1424",
          card: "#0f172a",
          cyan: "#22d3ee",
          indigo: "#818cf8",
          violet: "#a78bfa",
          amber: "#fbbf24",
        },
        accent: {
          blue: "#3b82f6",
          cyan: "#22d3ee",
          purple: "#818cf8",
          violet: "#a78bfa",
        },
      },
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scan-reveal": "scan-reveal 0.8s ease-out forwards",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "scan-reveal": {
          from: { clipPath: "inset(0 100% 0 0)", opacity: "0" },
          to: { clipPath: "inset(0 0 0 0)", opacity: "1" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
