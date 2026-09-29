import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroScene3D from "./HeroScene3D";

export default function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full min-h-[85vh] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["transparent"]} />
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color="#1e293b" wireframe />
            </mesh>
          }
        >
          <HeroScene3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
