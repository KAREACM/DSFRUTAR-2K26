/**
 * Logo Target Generator & Pixel Sampler for KARE ACM Student Chapter Logo.
 * Generates exact pixel coordinates for 2,500 particles categorized into 5 groups:
 * Group 0: Diamond Fill & Edge (#50A7D8 ACM Sky Blue)
 * Group 1: Inner White Circle Ring (#FFFFFF)
 * Group 2: "KARE" Text (#FFFFFF)
 * Group 3: "ACM" Text (#FFFFFF)
 * Group 4: "STUDENT CHAPTER" Text (#FFFFFF / Cyan)
 */

export interface TargetPoint {
  x: number;
  y: number;
  group: number; // 0..4
  color: string;
  originalX: number;
  originalY: number;
}

export function getParticleLogoBounds(width: number, height: number) {
  const minDim = Math.min(width, height);
  const logoScale = Math.min(Math.max(minDim * 0.45, 260), 400);
  const diamondR = logoScale * 0.46;
  const boundingSize = diamondR * 2; // exact width/height of particle diamond box
  return {
    logoScale,
    boundingSize,
    centerX: width / 2,
    centerY: height / 2,
  };
}

export function generateLogoTargets(
  width: number,
  height: number,
  particleCount: number = 2500
): TargetPoint[] {
  const targets: TargetPoint[] = [];

  // Responsive logo canvas size based on screen dimensions
  const minDim = Math.min(width, height);
  const logoScale = Math.min(Math.max(minDim * 0.45, 260), 400);

  const size = Math.ceil(logoScale * 1.4);
  const cx = size / 2;
  const cy = size / 2;

  const createSubCanvas = () => {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    return c.getContext('2d', { willReadFrequently: true })!;
  };

  const diamondR = logoScale * 0.46;
  const circleR = logoScale * 0.35;

  // Group 0: Outer Diamond (Rotated Square in Electric Royal Blue #4F7EFF)
  const ctxDiamond = createSubCanvas();
  ctxDiamond.save();
  ctxDiamond.translate(cx, cy);
  ctxDiamond.rotate(Math.PI / 4); // 45 degree diamond
  const rectSize = (diamondR * 2) / 1.414;
  ctxDiamond.fillStyle = '#4F7EFF';
  ctxDiamond.fillRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize);
  ctxDiamond.restore();

  // Group 1: Inner White Circle Ring
  const ctxCircle = createSubCanvas();
  ctxCircle.lineWidth = Math.max(6, Math.round(logoScale * 0.025));
  ctxCircle.strokeStyle = '#FFFFFF';
  ctxCircle.beginPath();
  ctxCircle.arc(cx, cy, circleR, 0, Math.PI * 2);
  ctxCircle.stroke();

  // Group 2: "KARE" Text
  const ctxKare = createSubCanvas();
  ctxKare.fillStyle = '#FFFFFF';
  const fontKare = `900 ${Math.round(logoScale * 0.14)}px "Outfit", "Plus Jakarta Sans", sans-serif`;
  ctxKare.font = fontKare;
  ctxKare.textAlign = 'center';
  ctxKare.textBaseline = 'middle';
  ctxKare.fillText('KARE', cx, cy - logoScale * 0.14);

  // Group 3: "ACM" Text
  const ctxAcm = createSubCanvas();
  ctxAcm.fillStyle = '#FFFFFF';
  const fontAcm = `900 ${Math.round(logoScale * 0.20)}px "Outfit", "Plus Jakarta Sans", sans-serif`;
  ctxAcm.font = fontAcm;
  ctxAcm.textAlign = 'center';
  ctxAcm.textBaseline = 'middle';
  ctxAcm.fillText('ACM', cx, cy + logoScale * 0.01);

  // Group 4: "STUDENT CHAPTER" Text
  const ctxChapter = createSubCanvas();
  ctxChapter.fillStyle = '#FFFFFF';
  const fontChapter = `800 ${Math.round(logoScale * 0.058)}px "Plus Jakarta Sans", sans-serif`;
  ctxChapter.font = fontChapter;
  ctxChapter.textAlign = 'center';
  ctxChapter.textBaseline = 'middle';
  ctxChapter.fillText('STUDENT CHAPTER', cx, cy + logoScale * 0.16);

  // Pixel Extraction Helper
  const extractPoints = (
    subCtx: CanvasRenderingContext2D,
    groupIdx: number,
    colorStr: string
  ): TargetPoint[] => {
    const imgData = subCtx.getImageData(0, 0, size, size);
    const data = imgData.data;
    const pts: TargetPoint[] = [];
    const step = 2; // pixel sampling stride

    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 40) {
          const screenX = width / 2 + (x - cx);
          const screenY = height / 2 + (y - cy);
          pts.push({
            x: screenX,
            y: screenY,
            group: groupIdx,
            color: colorStr,
            originalX: screenX,
            originalY: screenY,
          });
        }
      }
    }
    return pts;
  };

  const ptsDiamond = extractPoints(ctxDiamond, 0, 'rgba(79, 126, 255, 0.78)');
  const ptsCircle = extractPoints(ctxCircle, 1, 'rgba(255, 255, 255, 0.95)');
  const ptsKare = extractPoints(ctxKare, 2, 'rgba(255, 255, 255, 0.98)');
  const ptsAcm = extractPoints(ctxAcm, 3, 'rgba(255, 255, 255, 0.98)');
  const ptsChapter = extractPoints(ctxChapter, 4, 'rgba(225, 235, 255, 0.95)');

  // Proportional allocation: Diamond (30%), Circle (25%), KARE (15%), ACM (18%), STUDENT CHAPTER (12%)
  const distribution = [
    { pts: ptsDiamond, count: Math.floor(particleCount * 0.32), group: 0 },
    { pts: ptsCircle, count: Math.floor(particleCount * 0.24), group: 1 },
    { pts: ptsKare, count: Math.floor(particleCount * 0.14), group: 2 },
    { pts: ptsAcm, count: Math.floor(particleCount * 0.18), group: 3 },
    {
      pts: ptsChapter,
      count:
        particleCount -
        (Math.floor(particleCount * 0.32) +
          Math.floor(particleCount * 0.24) +
          Math.floor(particleCount * 0.14) +
          Math.floor(particleCount * 0.18)),
      group: 4,
    },
  ];

  distribution.forEach(({ pts, count, group }) => {
    if (pts.length === 0) return;
    for (let i = 0; i < count; i++) {
      const p = pts[Math.floor(Math.random() * pts.length)];
      targets.push({
        x: p.x + (Math.random() - 0.5) * 1.2,
        y: p.y + (Math.random() - 0.5) * 1.2,
        group: group,
        color: p.color,
        originalX: p.x,
        originalY: p.y,
      });
    }
  });

  return targets;
}

export function fallbackParametricTargets(width: number, height: number, count: number): TargetPoint[] {
  const targets: TargetPoint[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const tx = cx + Math.cos(angle) * r;
    const ty = cy + Math.sin(angle) * r;
    targets.push({
      x: tx,
      y: ty,
      group: i % 5,
      color: i % 2 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(79, 126, 255, 0.8)',
      originalX: tx,
      originalY: ty,
    });
  }
  return targets;
}
