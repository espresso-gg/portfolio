"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  twinkle: number;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  strength: number;
}

export function LunarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canvas || prefersReducedMotion) {
      return undefined;
    }

    const fieldCanvas = canvas;
    const context = fieldCanvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const drawingContext = context;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let pointerX = -999;
    let pointerY = -999;
    let lastRipple = 0;
    const stars: Star[] = [];
    const ripples: Ripple[] = [];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = fieldCanvas.clientWidth;
      height = fieldCanvas.clientHeight;
      fieldCanvas.width = width * ratio;
      fieldCanvas.height = height * ratio;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);

      stars.length = 0;
      const count = Math.floor(Math.min(170, Math.max(90, width / 9)));

      for (let index = 0; index < count; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.72,
          radius: Math.random() * 1.35 + 0.25,
          alpha: Math.random() * 0.55 + 0.22,
          speed: Math.random() * 0.08 + 0.025,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    function addRipple(x: number, y: number, strength = 1) {
      if (y < height * 0.58) return;
      ripples.push({ x, y, age: 0, strength });
      if (ripples.length > 12) ripples.shift();
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = fieldCanvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;

      const now = performance.now();
      if (now - lastRipple > 130) {
        addRipple(pointerX, pointerY, 0.75);
        lastRipple = now;
      }
    }

    function handlePointerLeave() {
      pointerX = -999;
      pointerY = -999;
    }

    function draw(time: number) {
      drawingContext.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.y += star.speed;
        star.twinkle += 0.018;

        if (star.y > height * 0.78) {
          star.y = -10;
          star.x = Math.random() * width;
        }

        const distance = Math.hypot(star.x - pointerX, star.y - pointerY);
        const pointerBoost = Math.max(0, 1 - distance / 160) * 0.7;
        const alpha = star.alpha + Math.sin(star.twinkle) * 0.16 + pointerBoost;

        drawingContext.beginPath();
        drawingContext.fillStyle = `rgba(194, 231, 255, ${Math.min(1, alpha)})`;
        drawingContext.shadowBlur = 10 + pointerBoost * 18;
        drawingContext.shadowColor = "rgba(152, 210, 255, 0.85)";
        drawingContext.arc(star.x, star.y, star.radius + pointerBoost * 0.55, 0, Math.PI * 2);
        drawingContext.fill();
      }

      drawingContext.shadowBlur = 0;

      const glow = drawingContext.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 210);
      glow.addColorStop(0, "rgba(210, 240, 255, 0.2)");
      glow.addColorStop(0.45, "rgba(92, 165, 255, 0.08)");
      glow.addColorStop(1, "rgba(92, 165, 255, 0)");
      drawingContext.fillStyle = glow;
      drawingContext.fillRect(0, 0, width, height);

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        ripple.age += 0.012;
        const radius = ripple.age * 270;
        const alpha = (1 - ripple.age) * 0.24 * ripple.strength;

        if (ripple.age >= 1) {
          ripples.splice(index, 1);
          continue;
        }

        drawingContext.beginPath();
        drawingContext.ellipse(ripple.x, ripple.y, radius * 1.8, radius * 0.26, 0, 0, Math.PI * 2);
        drawingContext.strokeStyle = `rgba(206, 238, 255, ${alpha})`;
        drawingContext.lineWidth = 1;
        drawingContext.shadowBlur = 18;
        drawingContext.shadowColor = "rgba(124, 198, 255, 0.55)";
        drawingContext.stroke();
      }

      if (Math.floor(time / 1700) !== Math.floor((time - 16) / 1700)) {
        addRipple(width * (0.42 + Math.random() * 0.16), height * (0.68 + Math.random() * 0.16), 0.45);
      }

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    fieldCanvas.addEventListener("pointermove", handlePointerMove);
    fieldCanvas.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      fieldCanvas.removeEventListener("pointermove", handlePointerMove);
      fieldCanvas.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="lunar-field" aria-hidden="true" />;
}