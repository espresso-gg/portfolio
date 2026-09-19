"use client";

import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Moon() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.035;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.08,
      0.025,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -state.pointer.x * 0.08,
      0.025,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.42, 96, 96]} />
        <meshStandardMaterial
          color="#b9b1c0"
          metalness={0.05}
          roughness={0.92}
        />
      </mesh>

      <mesh scale={1.018}>
        <sphereGeometry args={[1.42, 64, 64]} />
        <meshBasicMaterial
          color="#6d4c69"
          side={THREE.BackSide}
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh rotation={[1.28, 0.08, -0.38]} scale={1.55}>
        <torusGeometry args={[1.18, 0.006, 8, 192]} />
        <meshBasicMaterial color="#cbb9ce" transparent opacity={0.32} />
      </mesh>

      <mesh rotation={[0.45, 1.08, 0.12]} scale={1.68}>
        <torusGeometry args={[1.18, 0.004, 8, 192]} />
        <meshBasicMaterial color="#9a7192" transparent opacity={0.2} />
      </mesh>

      <mesh rotation={[-0.58, 0.24, 1.12]} scale={1.42}>
        <torusGeometry args={[1.18, 0.004, 8, 192]} />
        <meshBasicMaterial color="#d8d9e8" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function LunarScene() {
  return (
    <Canvas
      className="lunar-canvas"
      camera={{ position: [0, 0, 4.7], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.015} />
      <pointLight
        position={[3.4, 1.2, 2.8]}
        color="#fff2fa"
        intensity={32}
        distance={9}
        decay={2}
      />
      <pointLight
        position={[-2.5, -1.8, -1]}
        color="#6e2048"
        intensity={9}
        distance={6}
        decay={2}
      />
      <pointLight
        position={[0.4, -2.2, 1.4]}
        color="#8299c0"
        intensity={5}
        distance={5}
        decay={2}
      />
      <Float speed={0.55} rotationIntensity={0.12} floatIntensity={0.18}>
        <Moon />
      </Float>
      <Sparkles
        count={90}
        scale={[8, 5, 3]}
        size={1.35}
        speed={0.12}
        opacity={0.5}
        color="#e4d7e7"
      />
    </Canvas>
  );
}
