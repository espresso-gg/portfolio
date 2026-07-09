"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!outer.current || !inner.current) return;
    outer.current.rotation.x += delta * 0.11;
    outer.current.rotation.y += delta * 0.16;
    inner.current.rotation.x -= delta * 0.2;
    inner.current.rotation.z += delta * 0.12;
    const pointerX = state.pointer.x * 0.24;
    const pointerY = state.pointer.y * 0.18;
    outer.current.position.x = THREE.MathUtils.lerp(outer.current.position.x, pointerX, 0.025);
    outer.current.position.y = THREE.MathUtils.lerp(outer.current.position.y, pointerY, 0.025);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.45} floatIntensity={0.5}>
      <mesh ref={outer} scale={1.7}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.35}
          roughness={0.12}
          transmission={0.93}
          chromaticAberration={0.12}
          anisotropy={0.2}
          distortion={0.25}
          distortionScale={0.25}
          temporalDistortion={0.08}
          color="#dce4de"
        />
      </mesh>
      <mesh ref={inner} scale={0.88}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ff8b32" emissive="#ff4d00" emissiveIntensity={2.4} roughness={0.24} metalness={0.5} />
      </mesh>
      <pointLight color="#ff6a22" intensity={16} distance={8} />
    </Float>
  );
}

export default function CoreScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 4]} intensity={2.6} color="#d8f7ff" />
      <Core />
      <Sparkles count={65} scale={[8, 6, 4]} size={1.2} speed={0.25} opacity={0.5} color="#ffb46f" />
    </Canvas>
  );
}
