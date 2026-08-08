import React, { useEffect, useRef, useCallback } from 'react';
import { Particle } from '../types';
import { generateLogoTargets, TargetPoint } from '../lib/logoTargets';
import { bootAudio } from '../lib/audioSynth';

interface CanvasParticleSystemProps {
  currentTime: number; // 0.0 to 8.0s
  performanceMode: 'high' | 'low';
  onFpsUpdate?: (fps: number) => void;
  onPhaseChange?: (phase: string) => void;
}

export const CanvasParticleSystem: React.FC<CanvasParticleSystemProps> = ({
  currentTime,
  performanceMode,
  onFpsUpdate,
  onPhaseChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<TargetPoint[]>([]);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const prevTimeRef = useRef<number>(0);
  const pulseRingsRef = useRef<{ radius: number; maxRadius: number; alpha: number; speed: number }[]>([]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = performanceMode === 'high' ? (isMobile ? 1100 : 2500) : (isMobile ? 650 : 1200);

  // Initialize canvas particle dataset
  const initParticles = useCallback(
    (w: number, h: number) => {
      const targets = generateLogoTargets(w, h, particleCount);
      targetsRef.current = targets;

      const newParticles: Particle[] = [];
      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < particleCount; i++) {
        const target = targets[i] || {
          x: cx,
          y: cy,
          group: i % 5,
          color: 'rgba(79, 126, 255, 0.8)',
          originalX: cx,
          originalY: cy,
        };

        // Random spawn location across canvas
        const startX = Math.random() * w;
        const startY = Math.random() * h;

        // Bezier control points for galaxy spiral entrance
        const angle1 = Math.random() * Math.PI * 2;
        const dist1 = 140 + Math.random() * (Math.min(w, h) * 0.35);
        const cp1x = cx + Math.cos(angle1) * dist1;
        const cp1y = cy + Math.sin(angle1) * dist1;

        const angle2 = angle1 + (Math.random() - 0.5) * Math.PI;
        const dist2 = 70 + Math.random() * (Math.min(w, h) * 0.22);
        const cp2x = cx + Math.cos(angle2) * dist2;
        const cp2y = cy + Math.sin(angle2) * dist2;

        // Colors matching brand: Royal electric blue and bright white
        let colorStr = target.color;
        let rgbVals = '79, 126, 255';
        if (target.group === 0) {
          if (Math.random() > 0.3) {
            colorStr = 'rgba(79, 126, 255, 0.88)';
            rgbVals = '79, 126, 255';
          } else {
            colorStr = 'rgba(99, 140, 255, 0.92)';
            rgbVals = '99, 140, 255';
          }
        } else {
          if (Math.random() > 0.2) {
            colorStr = 'rgba(255, 255, 255, 0.95)';
            rgbVals = '255, 255, 255';
          } else {
            colorStr = 'rgba(225, 235, 255, 0.9)';
            rgbVals = '225, 235, 255';
          }
        }

        newParticles.push({
          id: i,
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          startX,
          startY,
          cp1x,
          cp1y,
          cp2x,
          cp2y,
          targetX: target.x,
          targetY: target.y,
          group: target.group,
          progress: 0,
          alpha: 0,
          size: 2, // 2px square strictly per design specs
          color: colorStr,
          rgbValues: rgbVals,
          speed: 0.6 + Math.random() * 0.8,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitRadius: (isMobile ? 110 : 160) + Math.random() * (isMobile ? 120 : 180),
          orbitSpeed: (Math.random() - 0.5) * 0.02,
        });
      }

      particlesRef.current = newParticles;
    },
    [particleCount, isMobile]
  );

  // Handle Resize & Canvas Scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobileDevice = w < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobileDevice ? 1.5 : 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Cubic Bezier interpolation helper
  const getCubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const oneMinusT = 1 - t;
    return (
      oneMinusT * oneMinusT * oneMinusT * p0 +
      3 * oneMinusT * oneMinusT * t * p1 +
      3 * oneMinusT * t * t * p2 +
      t * t * t * p3
    );
  };

  // Main Render Loop driven by requestAnimationFrame & currentTime state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;
    const t = currentTime;

    // Trigger audio cues & phase telemetry updates
    if (prevTimeRef.current < 1.0 && t >= 1.0) {
      bootAudio.triggerParticleActivation();
      if (onPhaseChange) onPhaseChange('1: Kernel Boot');
    }
    if (prevTimeRef.current < 2.0 && t >= 2.0) {
      if (onPhaseChange) onPhaseChange('2: Spiral Convergence');
    }
    if (prevTimeRef.current < 2.6 && t >= 2.6) {
      bootAudio.triggerLogoAssemblyStep(0);
      if (onPhaseChange) onPhaseChange('3: Particle Matrix Assembly');
    }
    if (prevTimeRef.current < 3.7 && t >= 3.7) {
      bootAudio.triggerPulseHarmonic();
      if (onPhaseChange) onPhaseChange('4: KARE ACM Logo Materialized');
      const minDim = Math.min(w, h);
      pulseRingsRef.current = [
        { radius: 10, maxRadius: minDim * 0.35, alpha: 0.8, speed: 4.0 },
        { radius: 5, maxRadius: minDim * 0.25, alpha: 0.6, speed: 3.0 },
      ];
    }
    if (prevTimeRef.current < 4.5 && t >= 4.5) {
      if (onPhaseChange) onPhaseChange('5: Logo Elevation Sequence');
    }
    if (prevTimeRef.current < 5.3 && t >= 5.3) {
      if (onPhaseChange) onPhaseChange('6: Presenter Text Reveal');
    }
    if (prevTimeRef.current < 5.9 && t >= 5.9) {
      if (onPhaseChange) onPhaseChange('7: DISFRUTAR 2K26 Launch');
    }

    prevTimeRef.current = t;

    // Calculate FPS
    const now = performance.now();
    frameCountRef.current++;
    if (now - lastTimeRef.current >= 500) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      if (onFpsUpdate) onFpsUpdate(fps);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    const particles = particlesRef.current;
    const targets = targetsRef.current;

    particles.forEach((p, idx) => {
      let currentAlpha = 0;
      let currX = p.startX;
      let currY = p.startY;

      const target = targets[idx] || { x: p.targetX, y: p.targetY };
      const tx = target.x;
      const ty = target.y;

      if (t < 0.4) {
        // Spawn fade in
        const spawnProgress = Math.max(0, t / 0.4);
        currentAlpha = spawnProgress * 0.8;
        currX = p.startX + p.vx * (t * 60);
        currY = p.startY + p.vy * (t * 60);
      } else if (t < 2.0) {
        // Preloader Vortex Spinning Phase around center preloader HUD
        currentAlpha = 0.75 + Math.sin(t * 4 + p.id) * 0.15;
        const orbitAngle = p.orbitAngle + t * (p.orbitSpeed * 12);
        const radius = (p.orbitRadius * 0.5) + Math.sin(t * 2 + p.id) * 15;
        currX = cx + Math.cos(orbitAngle) * radius * 1.4;
        currY = cy + Math.sin(orbitAngle) * radius * 1.4;
      } else if (t < 2.6) {
        // Spiral Convergence Prep towards logo targets
        const spiralT = (t - 2.0) / 0.6; // 0 to 1
        currentAlpha = 0.85;
        const curveX = getCubicBezier(spiralT, p.startX, p.cp1x, p.cp2x, tx);
        const curveY = getCubicBezier(spiralT, p.startY, p.cp1y, p.cp2y, ty);
        const spiralAngle = spiralT * Math.PI * 2 + p.id;
        const spiralRadius = (1 - spiralT) * 30;
        currX = curveX + Math.cos(spiralAngle) * spiralRadius;
        currY = curveY + Math.sin(spiralAngle) * spiralRadius;
      } else if (t < 3.7) {
        // Converging into logo shape before HD image appears (2.6s - 3.7s)
        const groupDelays = [2.6, 2.8, 3.0, 3.2, 3.4];
        const startGroupTime = groupDelays[p.group] || 2.6;
        const formProgress = Math.min(1.0, Math.max(0, (t - startGroupTime) / 0.6));
        const eased = 1 - Math.pow(1 - formProgress, 3);

        const fromX = getCubicBezier(0.7, p.startX, p.cp1x, p.cp2x, tx);
        const fromY = getCubicBezier(0.7, p.startY, p.cp1y, p.cp2y, ty);

        currX = fromX + (tx - fromX) * eased;
        currY = fromY + (ty - fromY) * eased;
        currentAlpha = 0.7 + formProgress * 0.25;
      } else {
        // t >= 3.7s: HD Logo image /acm_logo.png appears at exact center!
        // Particles burst OUTWARD into an ambient peripheral starfield far away from center,
        // completely clearing away any particles behind the logo or typography text!
        const burstT = Math.min(1.0, (t - 3.7) / 0.6);
        const burstEased = 1 - Math.pow(1 - burstT, 3);

        const targetRadius = p.orbitRadius; // 160px to 340px radius away from center
        const orbitAngle = p.orbitAngle + (t - 3.7) * p.orbitSpeed * 8;
        
        const peripheralX = cx + Math.cos(orbitAngle) * targetRadius;
        const peripheralY = cy + Math.sin(orbitAngle) * targetRadius;

        currX = tx + (peripheralX - tx) * burstEased;
        currY = ty + (peripheralY - ty) * burstEased;

        // Subtle peripheral starfield dust
        const breath = Math.sin((t - 3.7) * 3 + p.id * 0.1) * 0.1;
        currentAlpha = (0.22 + breath) * (1 - (t > 7.0 ? (t - 7.0) / 1.0 : 0));
      }

      // Draw particle as crisp 2px square
      if (currentAlpha > 0.02) {
        ctx.fillStyle = `rgba(${p.rgbValues || '79, 126, 255'}, ${currentAlpha.toFixed(2)})`;
        ctx.fillRect((currX + 0.5) | 0, (currY + 0.5) | 0, 2, 2);
      }
    });

    // Draw Subtle Energy Shockwave Rings at t >= 3.7s when logo appears
    if (t >= 3.7 && pulseRingsRef.current.length > 0) {
      pulseRingsRef.current.forEach((ring) => {
        if (ring.radius < ring.maxRadius) {
          ring.radius += ring.speed;
          ring.alpha *= 0.95;

          ctx.strokeStyle = `rgba(79, 126, 255, ${ring.alpha.toFixed(2)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }
  }, [currentTime, onFpsUpdate, onPhaseChange]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
