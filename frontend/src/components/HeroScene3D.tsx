import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/** Rotating scan ring around the shield – deepfake "detection" vibe */
function ScanRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x = ref.current.rotation.x + delta * 0.4;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.5]}>
      <torusGeometry args={[1.8, 0.02, 16, 64]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.9} />
    </mesh>
  );
}

/** Second ring, opposite rotation */
function ScanRingOuter() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y = ref.current.rotation.y + delta * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.6]}>
      <torusGeometry args={[2.1, 0.015, 8, 48]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
    </mesh>
  );
}

/** Central shield-like shape – protection / trust */
function ShieldCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y = ref.current.rotation.y + delta * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <octahedronGeometry args={[0.75, 0]} />
      <meshStandardMaterial
        color="#0f172a"
        emissive="#1e3a5f"
        emissiveIntensity={0.4}
        metalness={0.9}
        roughness={0.2}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

/** Wireframe "face mesh" – suggests deepfake / AI analysis */
function FaceMeshWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x = Math.sin(ref.current.rotation.y * 0.5) * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -1.2]}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshBasicMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/** Floating particles – data / detection points */
function Particles() {
  const count = 80;
  const ref = useRef<THREE.Points>(null);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.5 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 1;
  }
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y = (ref.current.rotation.y ?? 0) + delta * 0.12;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#06b6d4"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Glowing center orb */
function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y = (ref.current.rotation.y ?? 0) + delta * 0.25;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.2]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.9} />
    </mesh>
  );
}

export default function HeroScene3D() {
  return (
    <group position={[0, 0, 0]} scale={1}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1} color="#3b82f6" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#8b5cf6" />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <ScanRingOuter />
        <ScanRing />
        <FaceMeshWireframe />
        <ShieldCore />
        <CoreOrb />
        <Particles />
      </Float>
    </group>
  );
}
