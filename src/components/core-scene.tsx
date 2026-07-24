"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RoninCore() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const blade = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !ring.current || !blade.current) return;
    group.current.rotation.y += delta * 0.18;
    ring.current.rotation.z -= delta * 0.28;
    blade.current.rotation.y += delta * 0.1;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.22,
      0.04,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -state.pointer.x * 0.16,
      0.04,
    );
  });

  return (
    <Float speed={1.1} floatIntensity={0.35} rotationIntensity={0.15}>
      <group ref={group} rotation={[0.25, -0.45, 0.08]}>
        <mesh scale={1.45}>
          <octahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial transparent opacity={0} />
          <Edges color="#12100d" threshold={6} />
        </mesh>

        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} scale={1.25}>
          <torusGeometry args={[1, 0.025, 12, 96]} />
          <meshStandardMaterial color="#9d1515" roughness={0.45} metalness={0.2} />
        </mesh>

        <mesh ref={blade} rotation={[0, 0, -0.78]} position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 3.35, 0.035]} />
          <meshStandardMaterial color="#bfc5c0" roughness={0.18} metalness={0.8} />
        </mesh>

        <mesh rotation={[0, 0, -0.78]} position={[0.62, -0.62, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.06]} />
          <meshStandardMaterial color="#12100d" roughness={0.35} metalness={0.2} />
        </mesh>

        <mesh rotation={[0, 0, -0.78]} position={[0.82, -0.82, 0]}>
          <boxGeometry args={[0.1, 0.65, 0.07]} />
          <meshStandardMaterial color="#7b4d2d" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

export default function RoninArtifact() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[2, 4, 3]} intensity={2.7} />
      <pointLight position={[-3, -2, 4]} intensity={1.2} color="#9d1515" />
      <RoninCore />
    </Canvas>
  );
}
