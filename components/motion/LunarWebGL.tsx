"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#d9f2ff");
  gradient.addColorStop(0.52, "#b8d7e9");
  gradient.addColorStop(1, "#739ab8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 220; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 15 + 2;
    const alpha = Math.random() * 0.18 + 0.04;
    context.fillStyle = `rgba(49, 87, 111, ${alpha})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function LunarWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest<HTMLElement>(".lunar-journey");
    if (!canvas || !section) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.1, 15.5);

    const moonTexture = makeMoonTexture();
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(2.72, 96, 64),
      new THREE.MeshStandardMaterial({ map: moonTexture ?? undefined, roughness: 0.9, metalness: 0.02, emissive: 0x2e5d78, emissiveIntensity: 0.12 }),
    );
    moon.position.set(0, 0.15, 0);
    scene.add(moon);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(3.14, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xa9dcff, transparent: true, opacity: 0.1, side: THREE.BackSide, blending: THREE.AdditiveBlending }),
    );
    moon.add(halo);

    const figure = new THREE.Group();
    const figureMaterial = new THREE.MeshStandardMaterial({ color: 0x06101d, roughness: 0.96, metalness: 0.04 });
    const cloakMaterial = new THREE.MeshStandardMaterial({ color: 0x0a1e32, roughness: 0.88, metalness: 0.08 });
    const figureBody = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.92, 12), figureMaterial);
    figureBody.position.y = 0.48;
    const figureHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 16), figureMaterial);
    figureHead.position.y = 1.06;
    const figureCloak = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.05, 16, 1, true), cloakMaterial);
    figureCloak.position.set(-0.18, 0.45, -0.04);
    figureCloak.rotation.z = -0.1;
    figure.add(figureBody, figureHead, figureCloak);
    figure.position.set(0, -1.62, 1.55);
    figure.scale.setScalar(1.08);
    scene.add(figure);

    const crystalGroup = new THREE.Group();
    const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0x74cfff, emissive: 0x2a94d0, emissiveIntensity: 1.5, roughness: 0.24, metalness: 0.18, transparent: true, opacity: 0.9 });
    [-5.2, -4.25, 4.55, 5.45].forEach((x, index) => {
      const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.28 + (index % 2) * 0.12, 1.2 + (index % 2) * 0.5, 6), crystalMaterial);
      crystal.position.set(x, -1.8, 1.7 + (index % 2) * 0.4);
      crystal.rotation.z = (index % 2 ? -1 : 1) * 0.18;
      crystalGroup.add(crystal);
    });
    scene.add(crystalGroup);

    const horizon = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 14),
      new THREE.MeshBasicMaterial({ color: 0x071d36, transparent: true, opacity: 0.78 }),
    );
    horizon.position.set(0, -2.25, -5.5);
    scene.add(horizon);

    const mountainGroup = new THREE.Group();
    [
      [-8, 2.8, -4.5, 0x071a31],
      [-4.8, 2.1, -3.5, 0x0b2743],
      [4.8, 2.6, -4.2, 0x09233d],
      [8.5, 3.2, -5.2, 0x06182e],
    ].forEach(([x, height, z, color]) => {
      const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(height * 1.45, height, 5),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.86 }),
      );
      mountain.position.set(x, -2.05 + height / 2, z);
      mountain.rotation.y = 0.35;
      mountainGroup.add(mountain);
    });
    scene.add(mountainGroup);

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(42, 26, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x0b3151, roughness: 0.32, metalness: 0.58, transparent: true, opacity: 0.74 }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -2.3, -1.5);
    scene.add(water);

    const rippleGroup = new THREE.Group();
    for (let index = 0; index < 8; index += 1) {
      const ripple = new THREE.Mesh(
        new THREE.RingGeometry(0.8 + index * 0.42, 0.81 + index * 0.42, 96),
        new THREE.MeshBasicMaterial({ color: 0x9ddcff, transparent: true, opacity: 0.14 - index * 0.012, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
      );
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.set(0, -2.26, 0.45);
      ripple.scale.set(1.8, 0.42, 1);
      rippleGroup.add(ripple);
    }
    scene.add(rippleGroup);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1700 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 34;
      starPositions[index + 1] = (Math.random() - 0.5) * 22;
      starPositions[index + 2] = -Math.random() * 18 - 2;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xc7eaff, size: 0.035, transparent: true, opacity: 0.8, sizeAttenuation: true }));
    scene.add(stars);

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(500 * 3);
    for (let index = 0; index < dustPositions.length; index += 3) {
      dustPositions[index] = (Math.random() - 0.5) * 12;
      dustPositions[index + 1] = (Math.random() - 0.5) * 8;
      dustPositions[index + 2] = Math.random() * 8 - 4;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x99d9ff, size: 0.018, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending }));
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0x9fd6ff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xe8f7ff, 3.4);
    keyLight.position.set(-4, 3, 8);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x70c9ff, 7, 18, 2);
    rimLight.position.set(4, 1, -1);
    scene.add(rimLight);

    let frame = 0;
    let progress = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const next = reducedMotion ? 0 : THREE.MathUtils.clamp(-rect.top / Math.max(section.offsetHeight - window.innerHeight, 1), 0, 1);
      progress += (next - progress) * 0.085;
      section.style.setProperty("--lunar-progress", progress.toFixed(3));
      canvas.style.opacity = rect.bottom > 0 && rect.top < window.innerHeight ? "1" : "0";
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    const render = () => {
      updateProgress();
      const travel = THREE.MathUtils.smoothstep(progress, 0, 1);
      camera.position.z = THREE.MathUtils.lerp(15.5, 4.65, travel);
      camera.position.y = THREE.MathUtils.lerp(0.1, 0.18, travel);
      camera.position.x = Math.sin(progress * Math.PI * 1.3) * 0.34;
      camera.lookAt(0, 0.15, 0);
      moon.rotation.y += 0.0018;
      moon.rotation.x = Math.sin(progress * Math.PI) * 0.04;
      stars.rotation.y = progress * 0.12;
      dust.rotation.y -= 0.0008;
      dust.position.z = progress * 2;
      mountainGroup.position.z = progress * 2.5;
      water.position.z = -1.5 + progress * 2.2;
      rippleGroup.position.z = progress * 2.8;
      figure.position.z = 0.9 + progress * 1.2;
      crystalGroup.position.z = progress * 1.6;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("resize", onResize);
    render();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      moonTexture?.dispose();
      moon.geometry.dispose();
      (moon.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      horizon.geometry.dispose();
      (horizon.material as THREE.Material).dispose();
      mountainGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      water.geometry.dispose();
      (water.material as THREE.Material).dispose();
      rippleGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      figure.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      crystalGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      dustGeometry.dispose();
      (dust.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="lunar-webgl" aria-hidden="true" />;
}
