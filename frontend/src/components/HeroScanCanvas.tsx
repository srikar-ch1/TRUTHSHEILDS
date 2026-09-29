import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroScan3D from "./HeroScan3D";

export default function HeroScanCanvas() {
  return (
    <div
      className="absolute inset-0 w-full h-full min-h-[85vh] pointer-events-none"
      style={{ zIndex: 2, minHeight: "85vh" }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 55 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color="#0f172a" wireframe />
            </mesh>
          }
        >
          <HeroScan3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
