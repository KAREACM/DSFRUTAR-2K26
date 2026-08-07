export type BootPhase = 
  | 'black'
  | 'spawn'
  | 'active'
  | 'spiral'
  | 'logo_diamond'
  | 'logo_circle'
  | 'logo_kare'
  | 'logo_acm'
  | 'logo_chapter'
  | 'pulse'
  | 'typography'
  | 'complete';

export interface Particle {
  id: number;
  // Current position
  x: number;
  y: number;
  // Velocity
  vx: number;
  vy: number;
  // Spawn / initial position
  startX: number;
  startY: number;
  // Control points for organic bezier curves
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  // Target position in assembled logo
  targetX: number;
  targetY: number;
  // Target assembly group (0: Diamond, 1: Circle, 2: KARE, 3: ACM, 4: STUDENT CHAPTER)
  group: number;
  // Interpolation progress (0 to 1)
  progress: number;
  // Target opacity & scale
  alpha: number;
  size: number; // 2px square as per spec
  color: string; // rgba white or purple
  rgbValues?: string; // Pre-parsed 'r, g, b' for 60 FPS render performance
  speed: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  // Beat Particle Properties
  beatPhase?: number;
  beatFreq?: number;
  beatAmp?: number;
  beatRingIndex?: number;
  beatAngle?: number;
  beatBaseRadius?: number;
  pulseScale?: number;
}

export interface BootSystemMetrics {
  fps: number;
  particleCount: number;
  currentTime: number;
  duration: number;
  isPaused: boolean;
  isMuted: boolean;
  performanceMode: 'high' | 'low';
}
