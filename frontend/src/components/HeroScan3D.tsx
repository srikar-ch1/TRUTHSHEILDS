/**
 * Hero 3D: "Unmasking" deepfakes.
 * - Point-cloud face (glowing particles) + soundwave
 * - Scanning beam passes over; red "glitch" revealed where fake is detected
 * - Custom shaders for Points + beam plane
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BEAM_SPEED = 0.18;
const BEAM_WIDTH = 0.25;

const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 6.0 * (400.0 / -mvPos.z);
  }
`;

const fragmentShader = `
  uniform float uBeam;
  uniform float uTime;
  varying vec3 vWorldPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float alpha = 1.0 - length(c) * 2.0;

    float beamX = uBeam * 3.0 - 1.5;
    float d = abs(vWorldPosition.x - beamX);
    float inBeam = 1.0 - smoothstep(0.0, 0.25, d);

    vec3 glowColor = vec3(0.2, 0.9, 1.0);
    vec3 glitchColor = vec3(1.0, 0.2, 0.25);
    float n = hash(vWorldPosition.xy + uTime * 10.0);
    vec3 glitchWithNoise = glitchColor + vec3(n * 0.4, 0.0, 0.0);

    vec3 col = mix(glowColor, glitchWithNoise, inBeam);
    alpha *= 0.85 + inBeam * 0.15;

    gl_FragColor = vec4(col, alpha);
  }
`;

const beamVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragmentShader = `
  uniform float uBeam;
  varying vec2 vUv;

  void main() {
    float beamUvX = uBeam;
    float d = abs(vUv.x - beamUvX);
    float strip = 1.0 - smoothstep(0.0, 0.06, d);
    float edge = 1.0 - smoothstep(0.0, 0.12, d);
    vec3 col = mix(vec3(0.2, 0.9, 1.0), vec3(1.0, 0.25, 0.3), strip * 0.7);
    float alpha = edge * 0.35;
    gl_FragColor = vec4(col, alpha);
  }
`;

function FacePointCloud({
  uniforms,
}: {
  uniforms: { uBeam: { value: number }; uTime: { value: number } };
}) {
  return (
    <points position={[0, 0, -1.2]} scale={1.6}>
      <sphereGeometry args={[0.9, 64, 40]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SoundwavePoints({
  uniforms,
}: {
  uniforms: { uBeam: { value: number }; uTime: { value: number } };
}) {
  const count = 200;
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 - 1;
      const x = t * 1.8;
      const y = Math.sin(t * Math.PI * 3) * 0.25 + Math.sin(t * 7) * 0.05;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y - 0.9;
      pos[i * 3 + 2] = -1.2;
    }
    return [pos];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ScanningBeamPlane({
  uBeam,
}: {
  uBeam: { value: number };
}) {
  const uniforms = useMemo(() => ({ uBeam }), [uBeam]);

  return (
    <mesh position={[0, 0, -1.0]} renderOrder={1}>
      <planeGeometry args={[5, 4]} />
      <shaderMaterial
        vertexShader={beamVertexShader}
        fragmentShader={beamFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function HeroScan3D() {
  const sharedUniforms = useRef({
    uBeam: { value: 0 },
    uTime: { value: 0 },
  }).current;

  useFrame((state) => {
    sharedUniforms.uTime.value = state.clock.elapsedTime;
    sharedUniforms.uBeam.value =
      (sharedUniforms.uBeam.value + BEAM_SPEED * 0.016) % 1.0;
  });

  return (
    <>
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={0.4} color="#22d3ee" />
      <FacePointCloud uniforms={sharedUniforms} />
      <SoundwavePoints uniforms={sharedUniforms} />
      <ScanningBeamPlane uBeam={sharedUniforms.uBeam} />
    </>
  );
}
