"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Artifact() {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !knot.current) return;
    group.current.rotation.y += delta * 0.22;
    knot.current.rotation.z -= delta * 0.11;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.25,
      0.04,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -state.pointer.x * 0.18,
      0.04,
    );
  });

  return (
    <Float speed={1.3} floatIntensity={0.35} rotationIntensity={0.2}>
      <group ref={group} rotation={[0.3, -0.4, 0.1]}>
        <mesh scale={1.65}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial transparent opacity={0} />
          <Edges color="#111111" threshold={8} />
        </mesh>
        <mesh ref={knot} scale={0.72}>
          <torusKnotGeometry args={[1, 0.23, 180, 20, 2, 3]} />
          <meshStandardMaterial color="#ff482b" roughness={0.3} metalness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

export default function EditorialObject() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 43 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={2.4} />
      <directionalLight position={[2, 4, 3]} intensity={3} />
      <Artifact />
    </Canvas>
  );
}
